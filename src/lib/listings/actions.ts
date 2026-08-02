"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { DefectSeverity, ListingMode, ListingStatus, ListingVisibility } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { buildCategoryImageUrl } from "@/lib/marketplace/demo-content";

const ERRORS = {
  en: {
    invalidInput: "Please fill in the required fields before publishing.",
    invalidCategory: "Select a valid category before publishing."
  },
  ar: {
    invalidInput: "يرجى ملء الحقول المطلوبة قبل النشر.",
    invalidCategory: "اختر فئة صحيحة قبل النشر."
  }
};

const createListingSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim(),
  categorySlug: z.string().min(1),
  mode: z.enum(["RENT", "SWAP", "BOTH"]),
  priceAmount: z.number().positive().nullable(),
  city: z.string().trim(),
  swapPreferences: z.string().trim().max(200).nullable(),
  photoCount: z.number().int().min(0).max(4),
  conditionMarks: z.array(
    z.object({
      description: z.string(),
      severity: z.enum(["minor", "medium", "major"])
    })
  ),
  blockedDates: z.array(z.string())
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

  const coverImageUrl = buildCategoryImageUrl(data.categorySlug);

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
        priceAmount: data.priceAmount ?? undefined,
        currencyCode: data.priceAmount ? "EGP" : undefined,
        imageUrl: coverImageUrl,
        swapPreferences: data.swapPreferences || null,
        publishedAt: new Date()
      }
    });

    if (data.photoCount > 0) {
      await tx.listingPhoto.createMany({
        data: Array.from({ length: data.photoCount }, (_, index) => ({
          listingId: created.id,
          url: coverImageUrl,
          sortOrder: index
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

  redirect(`/marketplace/${listing.id}` as Route);
}
