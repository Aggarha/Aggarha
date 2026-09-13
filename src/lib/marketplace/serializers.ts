import type { ListingMode } from "@prisma/client";
import { buildConditionRating, buildConditionReport, buildListingGallery } from "@/lib/marketplace/condition-evidence";
import { resolveDisplayName } from "@/lib/profile/identity";
import type { Locale } from "@/lib/i18n/types";

type RawListing = {
  id: string;
  title: string;
  description: string;
  mode: ListingMode;
  status: string;
  visibility: string;
  imageUrl: string | null;
  priceAmount: unknown;
  currencyCode: string | null;
  viewCount: number;
  category: {
    slug: string;
  };
  owner: {
    id: string;
    trustScore: unknown;
    level: number;
    verificationLevel: string;
    profile?: {
      displayName: string | null;
    } | null;
  };
  location: {
    city: string;
    governorate: string;
  } | null;
};

export function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  return Number(value ?? 0);
}

export function listingCardData(listing: RawListing) {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    mode: listing.mode,
    status: listing.status,
    visibility: listing.visibility,
    imageUrl: listing.imageUrl,
    categorySlug: listing.category.slug,
    priceAmount: listing.priceAmount ? toNumber(listing.priceAmount) : null,
    currencyCode: listing.currencyCode,
    city: listing.location?.city ?? "Unknown",
    governorate: listing.location?.governorate ?? "Unknown",
    trustScore: toNumber(listing.owner.trustScore),
    level: listing.owner.level,
    verificationLevel: listing.owner.verificationLevel,
    ownerName: resolveDisplayName(listing.owner.profile),
    viewCount: listing.viewCount
  };
}

type RawListingQuickView = {
  id: string;
  title: string;
  mode: ListingMode;
  imageUrl: string | null;
  priceAmount: unknown;
  currencyCode: string | null;
  category: { slug: string; name: string };
  owner: {
    id: string;
    verificationLevel: string;
    profile?: { displayName: string | null; avatarUrl: string | null } | null;
  };
  location: { city: string; governorate: string; latitude: unknown; longitude: unknown } | null;
  photos: Array<{ id: string; url: string; isMain: boolean; sortOrder: number }>;
  _count: { favorites: number };
};

/** Shapes a listing for the half-sheet quick-view — real photos, a derived condition rating, and a compact seller identity, without the reviews/bookings/availability weight of the full detail page. */
export function listingQuickViewData(listing: RawListingQuickView, lang: Locale) {
  const conditionRating = buildConditionRating(buildConditionReport({ id: listing.id }), lang);

  return {
    id: listing.id,
    title: listing.title,
    mode: listing.mode,
    categorySlug: listing.category.slug,
    categoryName: listing.category.name,
    photos: buildListingGallery(listing),
    favoriteCount: listing._count.favorites,
    city: listing.location?.city ?? null,
    governorate: listing.location?.governorate ?? null,
    latitude: listing.location?.latitude != null ? toNumber(listing.location.latitude) : null,
    longitude: listing.location?.longitude != null ? toNumber(listing.location.longitude) : null,
    conditionRating,
    seller: {
      id: listing.owner.id,
      name: resolveDisplayName(listing.owner.profile, lang),
      avatarUrl: listing.owner.profile?.avatarUrl ?? null,
      verificationLevel: listing.owner.verificationLevel,
      // Seller's general area — we don't track a separate profile location, and the
      // reference app shows the same value for item location and seller location.
      location: listing.location?.city ?? null
    }
  };
}
