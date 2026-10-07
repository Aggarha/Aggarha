import { notFound } from "next/navigation";
import { ListingStatus } from "@prisma/client";
import { AddListingWizard } from "@/components/listings/add-listing-wizard";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { EGYPT_GOVERNORATE_VALUES } from "@/lib/locations/egypt-governorates";
import { mapCategoryTree } from "@/lib/marketplace/format";
import { getCategoryTree } from "@/lib/marketplace/query";
import { toNumber } from "@/lib/marketplace/serializers";

const SEVERITY = { MINOR: "minor", MEDIUM: "medium", MAJOR: "major" } as const;

/**
 * Pre-fills the governorate only when it's one of the 27 in the picker (older listings may
 * hold a free-text city), and carries an older listing's distinct city over as the area.
 */
function initialLocation(location: { city: string; governorate: string; district: string | null } | null) {
  if (!location) {
    return { governorate: "", district: "" };
  }
  const governorate = EGYPT_GOVERNORATE_VALUES.has(location.governorate) ? location.governorate : "";
  const legacyCity = EGYPT_GOVERNORATE_VALUES.has(location.city) ? "" : location.city;
  return { governorate, district: location.district ?? legacyCity };
}

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const [listing, categoryTree, { locale }] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: {
        category: { select: { slug: true } },
        location: { select: { city: true, governorate: true, district: true } },
        photos: { orderBy: { sortOrder: "asc" } },
        conditionMarks: { orderBy: { createdAt: "asc" } },
        availabilityDates: { where: { status: "BLOCKED" }, select: { date: true } }
      }
    }),
    getCategoryTree(),
    getLocaleAndDictionary()
  ]);

  // Owner-only; anyone else sees the same 404 as a missing listing.
  if (!listing || listing.ownerId !== session.userId || listing.status === ListingStatus.ARCHIVED) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <AddListingWizard
        categories={mapCategoryTree(categoryTree)}
        lang={locale}
        listingId={listing.id}
        initialValues={{
          title: listing.title,
          description: listing.description,
          categorySlug: listing.category.slug,
          mode: listing.mode,
          minPrice: listing.minPrice != null ? toNumber(listing.minPrice) : listing.priceAmount != null ? toNumber(listing.priceAmount) : null,
          maxPrice: listing.maxPrice != null ? toNumber(listing.maxPrice) : null,
          ...initialLocation(listing.location),
          swapPreferences: listing.swapPreferences ?? "",
          photos: listing.photos.map((photo) => ({ url: photo.url, isMain: photo.isMain })),
          conditionMarks: listing.conditionMarks.map((mark) => ({
            id: mark.id,
            existingId: mark.id,
            description: mark.description,
            severity: SEVERITY[mark.severity],
            hasPhoto: Boolean(mark.photoUrl)
          })),
          // Stored at UTC midnight from the wizard's YYYY-MM-DD keys, so slicing the ISO string round-trips.
          blockedDates: listing.availabilityDates.map((entry) => entry.date.toISOString().slice(0, 10))
        }}
      />
    </div>
  );
}
