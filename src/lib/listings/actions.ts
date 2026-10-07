"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Route } from "next";
import { BookingStatus, DefectSeverity, ListingMode, ListingStatus, ListingVisibility, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { buildCategoryImageUrl } from "@/lib/marketplace/demo-content";
import { EGYPT_GOVERNORATE_VALUES } from "@/lib/locations/egypt-governorates";
import { isOwnedListingPhotoUrl } from "@/lib/storage/r2";

const ERRORS = {
  en: {
    invalidInput: "Please fill in the required fields before publishing.",
    invalidCategory: "Select a valid category before publishing.",
    priceRequired: "Enter a daily price for rent listings.",
    unexpected: "Something went wrong while publishing. Please try again.",
    notFound: "This listing no longer exists.",
    notAuthorized: "You can only manage your own listings.",
    dateBooked: "Some of the dates you blocked are already booked. Unblock them and try again.",
    saveFailed: "Something went wrong while saving. Please try again."
  },
  ar: {
    invalidInput: "يرجى ملء الحقول المطلوبة قبل النشر.",
    invalidCategory: "اختر فئة صحيحة قبل النشر.",
    priceRequired: "أدخل سعر اليوم لإعلانات الإيجار.",
    unexpected: "حدث خطأ أثناء النشر. يرجى المحاولة مرة أخرى.",
    notFound: "هذا الإعلان لم يعد موجودًا.",
    notAuthorized: "يمكنك إدارة إعلاناتك فقط.",
    dateBooked: "بعض التواريخ التي حجبتها محجوزة بالفعل. ألغِ حجبها وحاول مرة أخرى.",
    saveFailed: "حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى."
  }
};

const photoSchema = z.object({ url: z.string().url(), isMain: z.boolean() });

const listingFieldsSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500),
  categorySlug: z.string().min(1),
  mode: z.enum(["RENT", "SWAP", "BOTH"]),
  minPrice: z.number().positive().nullable(),
  maxPrice: z.number().positive().nullable(),
  // Required: one of Egypt's 27 governorates (stored by English name). The area is optional free text.
  governorate: z.string().refine((value) => EGYPT_GOVERNORATE_VALUES.has(value)),
  district: z.string().trim().max(80),
  swapPreferences: z.string().trim().max(200).nullable(),
  photos: z.array(photoSchema).min(1).max(4),
  conditionMarks: z.array(
    z.object({
      // Set when the mark already exists on the listing being edited, so its stored photo survives the edit.
      id: z.string().optional(),
      description: z.string(),
      severity: z.enum(["minor", "medium", "major"])
    })
  ),
  blockedDates: z.array(z.string())
});

const isValidPriceRange = (data: { minPrice: number | null; maxPrice: number | null }) =>
  data.minPrice === null || data.maxPrice === null || data.maxPrice >= data.minPrice;
const priceRangeIssue = { message: "Max price must be greater than or equal to min price.", path: ["maxPrice"] };
// Anything rentable needs at least the daily (min) price; swap-only listings may leave it empty.
const hasRequiredPrice = (data: { mode: string; minPrice: number | null }) => data.mode === "SWAP" || data.minPrice !== null;
const priceRequiredIssue = { message: "A daily price is required for rent listings.", path: ["minPrice"] };

const createListingSchema = listingFieldsSchema
  .extend({
    photos: listingFieldsSchema.shape.photos.refine((photos) => photos.every((photo) => isOwnedListingPhotoUrl(photo.url)), {
      message: "Photo URLs must come from a completed upload."
    })
  })
  .refine(isValidPriceRange, priceRangeIssue)
  .refine(hasRequiredPrice, priceRequiredIssue);
// Edits may keep photos already on the listing (checked against the DB in the action), so
// the upload-origin check happens there rather than in the schema.
const updateListingSchema = listingFieldsSchema
  .refine(isValidPriceRange, priceRangeIssue)
  .refine(hasRequiredPrice, priceRequiredIssue);

function parseErrorMessage(error: z.ZodError, copy: (typeof ERRORS)["en"]) {
  return error.issues.some((issue) => issue.message === priceRequiredIssue.message) ? copy.priceRequired : copy.invalidInput;
}

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type CreateListingResult = { error: string } | { listingId: string };
export type ListingMutationResult = { error: string } | { ok: true };
export type DeleteListingResult = { error: string } | { outcome: "deleted" | "archived" };

const SEVERITY_MAP: Record<"minor" | "medium" | "major", DefectSeverity> = {
  minor: DefectSeverity.MINOR,
  medium: DefectSeverity.MEDIUM,
  major: DefectSeverity.MAJOR
};

type ListingFields = z.infer<typeof listingFieldsSchema>;

/** Resolves the category, which must be a leaf: a parent that has subcategories is not selectable. */
async function findLeafCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { children: true } } }
  });
  return category && category._count.children === 0 ? category : null;
}

function buildPhotoRows(photos: ListingFields["photos"]) {
  const hasExplicitMain = photos.some((photo) => photo.isMain);
  return photos.map((photo, index) => ({
    url: photo.url,
    sortOrder: index,
    isMain: hasExplicitMain ? photo.isMain : index === 0
  }));
}

function listingColumns(data: ListingFields, coverImageUrl: string) {
  return {
    title: data.title,
    description: data.description,
    mode: data.mode as ListingMode,
    // priceAmount stays the single canonical rate used by rent booking totals and the
    // AI engines; it derives from the low end of the entered range.
    priceAmount: data.minPrice,
    minPrice: data.minPrice,
    maxPrice: data.maxPrice,
    currencyCode: data.minPrice || data.maxPrice ? "EGP" : null,
    imageUrl: coverImageUrl,
    swapPreferences: data.swapPreferences || null
  };
}

async function writeListingChildren(
  tx: Prisma.TransactionClient,
  listingId: string,
  photoRows: ReturnType<typeof buildPhotoRows>,
  data: ListingFields,
  existingMarkPhotos: Map<string, string | null> = new Map()
) {
  if (photoRows.length > 0) {
    await tx.listingPhoto.createMany({
      data: photoRows.map((photo) => ({ listingId, ...photo }))
    });
  }

  if (data.conditionMarks.length > 0) {
    await tx.listingConditionMark.createMany({
      data: data.conditionMarks.map((mark) => ({
        listingId,
        description: mark.description,
        severity: SEVERITY_MAP[mark.severity],
        photoUrl: mark.id ? existingMarkPhotos.get(mark.id) ?? null : null
      }))
    });
  }

  if (data.blockedDates.length > 0) {
    await tx.availabilityDate.createMany({
      data: data.blockedDates.map((iso) => ({ listingId, date: new Date(iso), status: "BLOCKED" as const })),
      // A date the calendar already marks RESERVED keeps that row; blocking it again is a no-op.
      skipDuplicates: true
    });
  }
}

/**
 * The wizard collects a governorate plus an optional area, not a separate city, so the
 * governorate doubles as the city and the area goes in `district` (shown as "Area, Governorate").
 */
function locationColumns(data: { governorate: string; district: string }) {
  return { country: "Egypt", governorate: data.governorate, city: data.governorate, district: data.district || null };
}

export async function createListingAction(input: CreateListingInput): Promise<CreateListingResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const parsed = createListingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parseErrorMessage(parsed.error, copy) };
  }
  const data = parsed.data;

  const category = await findLeafCategory(data.categorySlug);
  if (!category) {
    return { error: copy.invalidCategory };
  }

  const photoRows = buildPhotoRows(data.photos);
  const coverImageUrl = photoRows.find((photo) => photo.isMain)?.url ?? buildCategoryImageUrl(data.categorySlug);

  let listingId: string;
  try {
    const listing = await prisma.$transaction(async (tx) => {
      const location = await tx.location.create({ data: locationColumns(data) });

      const created = await tx.listing.create({
        data: {
          ...listingColumns(data, coverImageUrl),
          ownerId: session.userId,
          categoryId: category.id,
          locationId: location.id,
          status: ListingStatus.PUBLISHED,
          visibility: ListingVisibility.PUBLIC,
          publishedAt: new Date()
        }
      });

      await writeListingChildren(tx, created.id, photoRows, data);
      return created;
    });
    listingId = listing.id;
  } catch (error) {
    // redirect() below throws Next's internal navigation signal — keeping it OUTSIDE this
    // try/catch means we only ever catch real DB/transaction failures here, never swallow
    // the redirect. Without this, an unexpected failure previously surfaced as nothing at
    // all: no redirect, no error, no client-visible signal.
    console.error("createListingAction: failed to create listing", error);
    return { error: copy.unexpected };
  }

  redirect(`/listings/${listingId}/success` as Route);
}

/** Loads a listing for an owner-only mutation; archived listings are treated as gone. */
type OwnedListing = { id: string; ownerId: string; status: ListingStatus; visibility: ListingVisibility; locationId: string | null };

async function findOwnedListing(
  listingId: string,
  userId: string,
  copy: (typeof ERRORS)["en"]
): Promise<{ error: string } | { listing: OwnedListing }> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, ownerId: true, status: true, visibility: true, locationId: true }
  });
  if (!listing || listing.status === ListingStatus.ARCHIVED) {
    return { error: copy.notFound };
  }
  if (listing.ownerId !== userId) {
    return { error: copy.notAuthorized };
  }
  return { listing };
}

function revalidateListingSurfaces(listingId: string) {
  revalidatePath("/listings/mine");
  revalidatePath(`/marketplace/${listingId}`);
  revalidatePath("/marketplace");
  revalidatePath("/");
}

export async function updateListingAction(listingId: string, input: CreateListingInput): Promise<ListingMutationResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const owned = await findOwnedListing(listingId, session.userId, copy);
  if ("error" in owned) {
    return { error: owned.error };
  }

  const parsed = updateListingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parseErrorMessage(parsed.error, copy) };
  }
  const data = parsed.data;

  const [category, existingPhotos, existingMarks, approvedBookings] = await Promise.all([
    findLeafCategory(data.categorySlug),
    prisma.listingPhoto.findMany({ where: { listingId }, select: { url: true } }),
    prisma.listingConditionMark.findMany({ where: { listingId }, select: { id: true, photoUrl: true } }),
    prisma.booking.findMany({
      where: { listingId, status: BookingStatus.APPROVED, startDate: { not: null }, endDate: { not: null } },
      select: { startDate: true, endDate: true }
    })
  ]);
  if (!category) {
    return { error: copy.invalidCategory };
  }

  const keptPhotoUrls = new Set(existingPhotos.map((photo) => photo.url));
  if (!data.photos.every((photo) => keptPhotoUrls.has(photo.url) || isOwnedListingPhotoUrl(photo.url))) {
    return { error: copy.invalidInput };
  }

  // Confirmed bookings live on Booking (start/end), not in AvailabilityDate, so replacing the
  // owner's BLOCKED rows below never touches them — but the owner must not block a booked day.
  const blocksBookedDay = data.blockedDates.some((iso) => {
    const day = new Date(iso).getTime();
    return approvedBookings.some(
      (booking) => booking.startDate && booking.endDate && day >= startOfDay(booking.startDate) && day < booking.endDate.getTime()
    );
  });
  if (blocksBookedDay) {
    return { error: copy.dateBooked };
  }

  const photoRows = buildPhotoRows(data.photos);
  const coverImageUrl = photoRows.find((photo) => photo.isMain)?.url ?? buildCategoryImageUrl(data.categorySlug);
  const existingMarkPhotos = new Map(existingMarks.map((mark) => [mark.id, mark.photoUrl]));

  try {
    await prisma.$transaction(async (tx) => {
      const location = locationColumns(data);
      const locationId = owned.listing.locationId
        ? (await tx.location.update({ where: { id: owned.listing.locationId }, data: location })).id
        : (await tx.location.create({ data: location })).id;

      await tx.listing.update({
        where: { id: listingId },
        data: { ...listingColumns(data, coverImageUrl), categoryId: category.id, locationId }
      });

      await tx.listingPhoto.deleteMany({ where: { listingId } });
      await tx.listingConditionMark.deleteMany({ where: { listingId } });
      // Only the owner's manual blocks are replaced; RESERVED/AVAILABLE rows stay as they are.
      await tx.availabilityDate.deleteMany({ where: { listingId, status: "BLOCKED" } });
      await writeListingChildren(tx, listingId, photoRows, data, existingMarkPhotos);
    });
  } catch (error) {
    console.error("updateListingAction: failed to update listing", error);
    return { error: copy.saveFailed };
  }

  revalidateListingSurfaces(listingId);
  return { ok: true };
}

function startOfDay(date: Date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
}

/** Pausing hides the listing from search and the homepage without deleting anything. */
export async function setListingPausedAction(listingId: string, paused: boolean): Promise<ListingMutationResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const owned = await findOwnedListing(listingId, session.userId, copy);
  if ("error" in owned) {
    return { error: owned.error };
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: { visibility: paused ? ListingVisibility.HIDDEN : ListingVisibility.PUBLIC }
  });

  revalidateListingSurfaces(listingId);
  return { ok: true };
}

/**
 * Bookings, deals and swap offers all cascade-delete with their listing, so a listing with
 * any of that history is archived instead of deleted to keep the booking record intact.
 */
export async function deleteListingAction(listingId: string): Promise<DeleteListingResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const owned = await findOwnedListing(listingId, session.userId, copy);
  if ("error" in owned) {
    return { error: owned.error };
  }

  const [bookings, deals, offers] = await Promise.all([
    prisma.booking.count({ where: { listingId } }),
    prisma.deal.count({ where: { listingId } }),
    prisma.bookingOfferedListing.count({ where: { listingId } })
  ]);
  const hasHistory = bookings + deals + offers > 0;

  try {
    if (hasHistory) {
      await prisma.listing.update({ where: { id: listingId }, data: { status: ListingStatus.ARCHIVED } });
    } else {
      await prisma.listing.delete({ where: { id: listingId } });
    }
  } catch (error) {
    console.error("deleteListingAction: failed to remove listing", error);
    return { error: copy.saveFailed };
  }

  revalidateListingSurfaces(listingId);
  return { outcome: hasHistory ? "archived" : "deleted" };
}
