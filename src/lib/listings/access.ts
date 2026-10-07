import { ListingStatus, ListingVisibility } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Paused (owner-hidden) or archived listings are off the public marketplace. */
export function isListingPubliclyVisible(listing: { status: ListingStatus | string; visibility: ListingVisibility | string }) {
  return listing.status !== ListingStatus.ARCHIVED && listing.visibility !== ListingVisibility.HIDDEN;
}

/**
 * Whether a viewer may open a listing's page. Public listings are open to anyone; a
 * paused or archived one stays reachable for its owner and for anyone with a booking
 * or deal on it, so they can get back to it from their bookings.
 */
export async function canViewListing(
  listing: { id: string; ownerId: string; status: ListingStatus | string; visibility: ListingVisibility | string },
  viewerId: string | null
): Promise<boolean> {
  if (isListingPubliclyVisible(listing)) {
    return true;
  }
  if (!viewerId) {
    return false;
  }
  if (listing.ownerId === viewerId) {
    return true;
  }

  const [booking, deal] = await Promise.all([
    prisma.booking.findFirst({
      where: { listingId: listing.id, OR: [{ requesterId: viewerId }, { ownerId: viewerId }] },
      select: { id: true }
    }),
    prisma.deal.findFirst({
      where: { listingId: listing.id, OR: [{ renterId: viewerId }, { initiatorId: viewerId }, { ownerId: viewerId }] },
      select: { id: true }
    })
  ]);
  return booking !== null || deal !== null;
}
