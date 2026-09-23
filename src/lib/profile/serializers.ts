import { buildListingCoverUrl } from "@/lib/marketplace/condition-evidence";
import { listingCardData } from "@/lib/marketplace/serializers";
import type { ProfileListingRow } from "@/lib/profile/query";

/**
 * A profile-grid card: the marketplace card shape, plus the owner's real
 * uploaded cover photo and the like count the grid shows on each tile.
 * Listing.imageUrl is the pre-upload demo column, so an uploaded photo has
 * to win over it or a real listing shows a stock image on its own profile.
 */
export function profileListingCardData(listing: ProfileListingRow) {
  return {
    ...listingCardData(listing),
    imageUrl: buildListingCoverUrl(listing) ?? listing.imageUrl,
    favoriteCount: listing._count.favorites
  };
}

export type ProfileListingCard = ReturnType<typeof profileListingCardData>;
