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
    invalidAvatar: "That photo didn't finish uploading. Try again.",
    unexpected: "Something went wrong. Try again."
  },
  ar: {
    invalidInput: "راجع الحقول وحاول مرة أخرى.",
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
