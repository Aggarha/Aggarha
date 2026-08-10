"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";

const ERRORS = {
  en: {
    invalidInput: "Please provide a valid rating.",
    notFound: "Booking not found.",
    notAuthorized: "You're not allowed to do that.",
    notCompleted: "This booking hasn't been completed yet.",
    noDeal: "This booking can't be reviewed.",
    alreadyReviewed: "You've already reviewed this booking."
  },
  ar: {
    invalidInput: "يرجى تقديم تقييم صالح.",
    notFound: "الحجز غير موجود.",
    notAuthorized: "غير مسموح لك بذلك.",
    notCompleted: "لم يتم إكمال هذا الحجز بعد.",
    noDeal: "لا يمكن تقييم هذا الحجز.",
    alreadyReviewed: "لقد قيّمت هذا الحجز بالفعل."
  }
};

const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional()
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateReviewResult = { error: string } | { ok: true };

function clampTrustScore(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)) * 100) / 100;
}

export async function createReviewAction(input: CreateReviewInput): Promise<CreateReviewResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const parsed = createReviewSchema.safeParse(input);
  if (!parsed.success) {
    return { error: copy.invalidInput };
  }
  const data = parsed.data;

  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    include: { deal: true }
  });
  if (!booking) {
    return { error: copy.notFound };
  }
  if (booking.requesterId !== session.userId && booking.ownerId !== session.userId) {
    return { error: copy.notAuthorized };
  }
  if (booking.status !== "COMPLETED") {
    return { error: copy.notCompleted };
  }
  if (!booking.deal) {
    return { error: copy.noDeal };
  }

  const revieweeId = session.userId === booking.requesterId ? booking.ownerId : booking.requesterId;

  const existing = await prisma.review.findUnique({
    where: { dealId_reviewerId: { dealId: booking.deal.id, reviewerId: session.userId } }
  });
  if (existing) {
    return { error: copy.alreadyReviewed };
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        dealId: booking.deal!.id,
        listingId: booking.listingId,
        reviewerId: session.userId,
        revieweeId,
        rating: data.rating,
        comment: data.comment || undefined
      }
    });

    const agg = await tx.review.aggregate({
      where: { revieweeId, isHidden: false },
      _avg: { rating: true },
      _count: true
    });

    const averageRating = Math.round((agg._avg.rating ?? 0) * 100) / 100;
    const reviewCount = agg._count;
    const trustScore = clampTrustScore(50 + (averageRating - 3) * 10);

    await tx.profile.update({
      where: { userId: revieweeId },
      data: { averageRating, reviewCount }
    });

    await tx.user.update({
      where: { id: revieweeId },
      data: { trustScore }
    });
  });

  revalidatePath("/bookings");
  revalidatePath(`/marketplace/${booking.listingId}`);
  return { ok: true };
}
