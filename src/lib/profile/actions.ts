"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { buildProfilePath } from "@/lib/profile/identity";
import { isOwnedAvatarUrl } from "@/lib/storage/r2";

const ERRORS = {
  en: {
    invalidInput: "Check the fields and try again.",
    cannotFollowSelf: "You can't follow yourself.",
    cannotBlockSelf: "You can't block yourself.",
    invalidAvatar: "That photo didn't finish uploading. Try again.",
    unexpected: "Something went wrong. Try again."
  },
  ar: {
    invalidInput: "راجع الحقول وحاول مرة أخرى.",
    cannotFollowSelf: "لا يمكنك متابعة نفسك.",
    cannotBlockSelf: "لا يمكنك حظر نفسك.",
    invalidAvatar: "لم يكتمل رفع الصورة. حاول مرة أخرى.",
    unexpected: "حدث خطأ. حاول مرة أخرى."
  }
};

const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(60),
  bio: z.string().trim().max(300),
  city: z.string().trim().max(80),
  /** Absent means "leave the current avatar alone"; null means "remove it". */
  avatarUrl: z.string().url().nullable().optional()
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateProfileResult = { error: string } | { ok: true; handle: string };

export async function updateProfileAction(input: UpdateProfileInput): Promise<UpdateProfileResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: copy.invalidInput };
  }
  const data = parsed.data;

  // An avatar URL is only trusted when it sits under this user's own upload
  // prefix — otherwise a client could point the field at any URL it liked.
  if (typeof data.avatarUrl === "string" && !isOwnedAvatarUrl(data.avatarUrl, session.userId)) {
    return { error: copy.invalidAvatar };
  }

  try {
    const profile = await prisma.profile.update({
      where: { userId: session.userId },
      data: {
        displayName: data.displayName,
        // Empty strings are stored as null so "no bio" is one state, not two.
        bio: data.bio.length > 0 ? data.bio : null,
        city: data.city.length > 0 ? data.city : null,
        ...(data.avatarUrl === undefined ? {} : { avatarUrl: data.avatarUrl })
      },
      select: { handle: true }
    });

    revalidatePath(buildProfilePath(profile.handle));
    return { ok: true, handle: profile.handle };
  } catch {
    return { error: copy.unexpected };
  }
}

export type ToggleFollowResult = { error: string } | { following: boolean; followerCount: number };

/**
 * Idempotent by construction: the unique index on (followerId, followingId)
 * means a double-tap can never create two edges, and deleteMany on an absent
 * edge is a no-op rather than an error. Returns the recounted follower total
 * so the caller can settle its optimistic number against the real one.
 */
export async function toggleFollowAction(targetUserId: string): Promise<ToggleFollowResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  if (targetUserId === session.userId) {
    return { error: copy.cannotFollowSelf };
  }

  try {
    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: session.userId, followingId: targetUserId } },
      select: { id: true }
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
    } else {
      await prisma.follow.create({
        data: { followerId: session.userId, followingId: targetUserId }
      });
    }

    const [followerCount, profile] = await Promise.all([
      prisma.follow.count({ where: { followingId: targetUserId } }),
      prisma.profile.findUnique({ where: { userId: targetUserId }, select: { handle: true } })
    ]);

    if (profile) {
      revalidatePath(buildProfilePath(profile.handle));
    }

    return { following: !existing, followerCount };
  } catch {
    return { error: copy.unexpected };
  }
}

export type ToggleBlockResult = { error: string } | { blocked: boolean };

/**
 * Blocking also tears down the follow edges in both directions — leaving a
 * follow in place would keep the blocked account in the blocker's Following
 * list, which is not what "block" means to anyone.
 */
export async function toggleBlockAction(targetUserId: string): Promise<ToggleBlockResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  if (targetUserId === session.userId) {
    return { error: copy.cannotBlockSelf };
  }

  try {
    const existing = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: session.userId, blockedId: targetUserId } },
      select: { id: true }
    });

    if (existing) {
      await prisma.block.delete({ where: { id: existing.id } });
    } else {
      await prisma.$transaction([
        prisma.block.create({ data: { blockerId: session.userId, blockedId: targetUserId } }),
        prisma.follow.deleteMany({
          where: {
            OR: [
              { followerId: session.userId, followingId: targetUserId },
              { followerId: targetUserId, followingId: session.userId }
            ]
          }
        })
      ]);
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
      select: { handle: true }
    });
    if (profile) {
      revalidatePath(buildProfilePath(profile.handle));
    }

    return { blocked: !existing };
  } catch {
    return { error: copy.unexpected };
  }
}

const reportSchema = z.object({
  targetUserId: z.string().min(1),
  reason: z.enum(["scam", "fake_listings", "harassment", "other"]),
  details: z.string().trim().max(500)
});

export type ReportUserInput = z.infer<typeof reportSchema>;
export type ReportUserResult = { error: string } | { ok: true };

/**
 * Files into the existing FraudReport queue rather than a profile-specific
 * table, so moderation keeps one inbox for listing and account reports alike.
 */
export async function reportUserAction(input: ReportUserInput): Promise<ReportUserResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) {
    return { error: copy.invalidInput };
  }
  if (parsed.data.targetUserId === session.userId) {
    return { error: copy.invalidInput };
  }

  try {
    await prisma.fraudReport.create({
      data: {
        reporterId: session.userId,
        targetUserId: parsed.data.targetUserId,
        reason: parsed.data.reason,
        details: parsed.data.details.length > 0 ? parsed.data.details : null
      }
    });
    return { ok: true };
  } catch {
    return { error: copy.unexpected };
  }
}
