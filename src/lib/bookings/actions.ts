"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { BookingStatus as PrismaBookingStatus, ListingMode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";

const ERRORS = {
  en: {
    invalidInput: "Please fill in the required fields.",
    listingNotFound: "This listing is no longer available.",
    modeNotSupported: "This listing doesn't support that request type.",
    ownListing: "You can't request your own listing.",
    invalidDates: "Choose an end date after the start date.",
    noOfferedListings: "Select at least one listing to offer.",
    notFound: "Request not found.",
    notAuthorized: "You're not allowed to do that.",
    notPending: "This request has already been responded to."
  },
  ar: {
    invalidInput: "يرجى ملء الحقول المطلوبة.",
    listingNotFound: "هذا الإعلان لم يعد متاحًا.",
    modeNotSupported: "هذا الإعلان لا يدعم نوع الطلب هذا.",
    ownListing: "لا يمكنك تقديم طلب على إعلانك الخاص.",
    invalidDates: "اختر تاريخ انتهاء بعد تاريخ البدء.",
    noOfferedListings: "اختر إعلاناً واحداً على الأقل لعرضه.",
    notFound: "الطلب غير موجود.",
    notAuthorized: "غير مسموح لك بذلك.",
    notPending: "تم الرد على هذا الطلب بالفعل."
  }
};

const createBookingSchema = z.object({
  listingId: z.string().min(1),
  mode: z.enum(["RENT", "SWAP"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  offeredListingIds: z.array(z.string()).optional(),
  message: z.string().optional()
});

export type CreateBookingState = { error: string } | undefined;

export async function createBookingRequestAction(
  _prevState: CreateBookingState,
  formData: FormData
): Promise<CreateBookingState> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const parsed = createBookingSchema.safeParse({
    listingId: formData.get("listingId"),
    mode: formData.get("mode"),
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    offeredListingIds: formData.getAll("offeredListingIds"),
    message: formData.get("message") || undefined
  });
  if (!parsed.success) {
    return { error: copy.invalidInput };
  }
  const data = parsed.data;

  const listing = await prisma.listing.findUnique({ where: { id: data.listingId } });
  if (!listing) {
    return { error: copy.listingNotFound };
  }
  if (listing.ownerId === session.userId) {
    return { error: copy.ownListing };
  }

  if (data.mode === "RENT") {
    if (!(listing.mode === ListingMode.RENT || listing.mode === ListingMode.BOTH)) {
      return { error: copy.modeNotSupported };
    }
    if (!data.startDate || !data.endDate) {
      return { error: copy.invalidInput };
    }
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (!(endDate.getTime() > startDate.getTime())) {
      return { error: copy.invalidDates };
    }
    const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    await prisma.booking.create({
      data: {
        listingId: listing.id,
        requesterId: session.userId,
        ownerId: listing.ownerId,
        mode: ListingMode.RENT,
        startDate,
        endDate,
        totalDays,
        requesterMessage: data.message || undefined
      }
    });
  } else {
    if (!(listing.mode === ListingMode.SWAP || listing.mode === ListingMode.BOTH)) {
      return { error: copy.modeNotSupported };
    }
    if (!data.offeredListingIds || data.offeredListingIds.length === 0) {
      return { error: copy.noOfferedListings };
    }

    const ownedCount = await prisma.listing.count({
      where: { id: { in: data.offeredListingIds }, ownerId: session.userId }
    });
    if (ownedCount !== data.offeredListingIds.length) {
      return { error: copy.invalidInput };
    }

    await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          listingId: listing.id,
          requesterId: session.userId,
          ownerId: listing.ownerId,
          mode: ListingMode.SWAP,
          requesterMessage: data.message || undefined
        }
      });
      await tx.bookingOfferedListing.createMany({
        data: (data.offeredListingIds ?? []).map((id) => ({ bookingId: created.id, listingId: id }))
      });
    });
  }

  revalidatePath("/bookings");
  redirect("/bookings" as Route);
}

export type BookingActionResult = { error: string } | { ok: true };

export async function respondToBookingAction(input: {
  bookingId: string;
  decision: "APPROVE" | "REJECT";
}): Promise<BookingActionResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const booking = await prisma.booking.findUnique({ where: { id: input.bookingId } });
  if (!booking) {
    return { error: copy.notFound };
  }
  if (booking.ownerId !== session.userId) {
    return { error: copy.notAuthorized };
  }
  if (booking.status !== PrismaBookingStatus.REQUESTED) {
    return { error: copy.notPending };
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data:
      input.decision === "APPROVE"
        ? { status: PrismaBookingStatus.APPROVED, approvedAt: new Date() }
        : { status: PrismaBookingStatus.REJECTED, rejectedAt: new Date() }
  });

  revalidatePath("/bookings");
  return { ok: true };
}

export async function cancelBookingAction(input: { bookingId: string }): Promise<BookingActionResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const booking = await prisma.booking.findUnique({ where: { id: input.bookingId } });
  if (!booking) {
    return { error: copy.notFound };
  }
  if (booking.requesterId !== session.userId) {
    return { error: copy.notAuthorized };
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: PrismaBookingStatus.CANCELED, canceledAt: new Date() }
  });

  revalidatePath("/bookings");
  return { ok: true };
}
