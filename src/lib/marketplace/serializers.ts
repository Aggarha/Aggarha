import type { ListingMode } from "@prisma/client";
import { buildSellerName } from "@/lib/marketplace/demo-content";

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
    ownerName: buildSellerName(listing.owner.id),
    viewCount: listing.viewCount
  };
}
