"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { DefectSeverity, ListingMode, ListingStatus, ListingVisibility } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { buildCategoryImageUrl } from "@/lib/marketplace/demo-content";
import { isOwnedListingPhotoUrl } from "@/lib/storage/r2";

const ERRORS = {
  en: {
    invalidInput: "Please fill in the required fields before publishing.",
    invalidCategory: "Select a valid category before publishing.",
    unexpected: "Something went wrong while publishing. Please try again."
  },
  ar: {
    invalidInput: "يرجى ملء الحقول المطلوبة قبل النشر.",
    invalidCategory: "اختر فئة صحيحة قبل النشر.",
    unexpected: "حدث خطأ أثناء النشر. يرجى المحاولة مرة أخرى."
  }
};

const createListingSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500),
  categorySlug: z.string().min(1),
  mode: z.enum(["RENT", "SWAP", "BOTH"]),
  minPrice: z.number().positive().nullable(),
  maxPrice: z.number().positive().nullable(),
  city: z.string().trim(),
  swapPreferences: z.string().trim().max(200).nullable(),
  photos: z
    .array(z.object({ url: z.string().url(), isMain: z.boolean() }))
    .max(4)
    .refine((photos) => photos.every((photo) => isOwnedListingPhotoUrl(photo.url)), {
      message: "Photo URLs must come from a completed upload."
    }),
  conditionMarks: z.array(
    z.object({
      description: z.string(),
      severity: z.enum(["minor", "medium", "major"])
    })
  ),
  blockedDates: z.array(z.string())
}).refine((data) => data.minPrice === null || data.maxPrice === null || data.maxPrice >= data.minPrice, {
  message: "Max price must be greater than or equal to min price.",
  path: ["maxPrice"]
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type CreateListingResult = { error: string } | { listingId: string };

const SEVERITY_MAP: Record<"minor" | "medium" | "major", DefectSeverity> = {
  minor: DefectSeverity.MINOR,
  medium: DefectSeverity.MEDIUM,
  major: DefectSeverity.MAJOR
};

export async function createListingAction(input: CreateListingInput): Promise<CreateListingResult> {
  const [session, locale] = await Promise.all([requireSession(), getLocale()]);
  const copy = ERRORS[locale];

  const parsed = createListingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: copy.invalidInput };
  }
  const data = parsed.data;

  const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
  if (!category) {
    return { error: copy.invalidCategory };
  }

  const hasExplicitMain = data.photos.some((photo) => photo.isMain);
  const photoRows = data.photos.map((photo, index) => ({
    url: photo.url,
    sortOrder: index,
    isMain: hasExplicitMain ? photo.isMain : index === 0
  }));
  const mainPhotoUrl = photoRows.find((photo) => photo.isMain)?.url ?? null;
  const coverImageUrl = mainPhotoUrl ?? buildCategoryImageUrl(data.categorySlug);

  let listingId: string;
  try {
    const listing = await prisma.$transaction(async (tx) => {
      // The wizard only collects a free-text city, not a separate governorate, so we
      // duplicate the typed value into both fields rather than inventing a fake governorate.
      const location = data.city
        ? await tx.location.create({ data: { country: "Egypt", city: data.city, governorate: data.city } })
        : null;

      const created = await tx.listing.create({
        data: {
          ownerId: session.userId,
          categoryId: category.id,
          locationId: location?.id,
          title: data.title,
          description: data.description,
          mode: data.mode as ListingMode,
          status: ListingStatus.PUBLISHED,
          visibility: ListingVisibility.PUBLIC,
          // priceAmount stays the single canonical rate used by rent booking totals and the
          // AI engines; new listings derive it from the low end of the entered range.
          priceAmount: data.minPrice ?? undefined,
          minPrice: data.minPrice ?? undefined,
          maxPrice: data.maxPrice ?? undefined,
          currencyCode: data.minPrice || data.maxPrice ? "EGP" : undefined,
          imageUrl: coverImageUrl,
          swapPreferences: data.swapPreferences || null,
          publishedAt: new Date()
        }
      });

      if (photoRows.length > 0) {
        await tx.listingPhoto.createMany({
          data: photoRows.map((photo) => ({
            listingId: created.id,
            url: photo.url,
            sortOrder: photo.sortOrder,
            isMain: photo.isMain
          }))
        });
      }

      if (data.conditionMarks.length > 0) {
        await tx.listingConditionMark.createMany({
          data: data.conditionMarks.map((mark) => ({
            listingId: created.id,
            description: mark.description,
            severity: SEVERITY_MAP[mark.severity]
          }))
        });
      }

      if (data.blockedDates.length > 0) {
        await tx.availabilityDate.createMany({
          data: data.blockedDates.map((iso) => ({
            listingId: created.id,
            date: new Date(iso),
            status: "BLOCKED"
          }))
        });
      }

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

  redirect(`/marketplace/${listingId}` as Route);
}
