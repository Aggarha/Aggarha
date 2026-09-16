import { ListingStatus, ListingVisibility, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * Statuses a visitor may see on someone else's profile. Drafts, rejected and
 * pending listings are the owner's working state, not public inventory —
 * owners still see all of their own, which is what /listings/mine is for.
 */
const PUBLIC_LISTING_STATUSES = [
  ListingStatus.PUBLISHED,
  ListingStatus.RESERVED,
  ListingStatus.RENTED,
  ListingStatus.SWAPPED,
  ListingStatus.COMPLETED
];

const PRIVATE_VISIBILITIES = [ListingVisibility.PRIVATE, ListingVisibility.HIDDEN];

/** Everything listingCardData() reads, plus photos for a real cover image and the favourite count shown on the card. */
const listingCardInclude = {
  category: { select: { slug: true } },
  location: { select: { city: true, governorate: true } },
  owner: {
    select: {
      id: true,
      trustScore: true,
      level: true,
      verificationLevel: true,
      profile: { select: { displayName: true } }
    }
  },
  photos: { select: { id: true, url: true, isMain: true, sortOrder: true } },
  _count: { select: { favorites: true } }
} satisfies Prisma.ListingInclude;

export type ProfileListingRow = Prisma.ListingGetPayload<{ include: typeof listingCardInclude }>;

function publicListingFilter(ownerId: string, viewerIsOwner: boolean): Prisma.ListingWhereInput {
  if (viewerIsOwner) {
    return { ownerId };
  }
  return {
    ownerId,
    status: { in: PUBLIC_LISTING_STATUSES },
    visibility: { notIn: PRIVATE_VISIBILITIES }
  };
}

/**
 * A profile as seen by a specific viewer. `viewerId` is what makes the page
 * viewer-relative — it decides isSelf (edit affordances), isFollowing (button
 * state), and whether unpublished listings are included.
 */
export async function getProfileByHandle(handle: string, viewerId: string | null) {
  const profile = await prisma.profile.findUnique({
    where: { handle },
    include: {
      user: {
        select: {
          id: true,
          verificationLevel: true,
          trustScore: true,
          trustTier: true,
          level: true,
          xp: true,
          createdAt: true,
          isBanned: true
        }
      }
    }
  });

  if (!profile || profile.user.isBanned) {
    return null;
  }

  const userId = profile.userId;
  const isSelf = viewerId !== null && viewerId === userId;

  // Enforced mutually: whichever side blocked, neither sees the other's
  // listings, so a blocked user cannot detect the block by watching content
  // reappear. Checked before the counts so a blocked profile reports zero.
  const blockEdge =
    viewerId && !isSelf
      ? await prisma.block.findFirst({
          where: {
            OR: [
              { blockerId: viewerId, blockedId: userId },
              { blockerId: userId, blockedId: viewerId }
            ]
          },
          select: { blockerId: true }
        })
      : null;

  const blockedByViewer = blockEdge?.blockerId === viewerId;
  const isBlocked = blockEdge !== null;

  const [listingCount, followerCount, followingCount, rating, followEdge] = await Promise.all([
    isBlocked ? Promise.resolve(0) : prisma.listing.count({ where: publicListingFilter(userId, isSelf) }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
    prisma.review.aggregate({
      where: { revieweeId: userId, isHidden: false },
      _avg: { rating: true },
      _count: { _all: true }
    }),
    viewerId && !isSelf && !isBlocked
      ? prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: viewerId, followingId: userId } },
          select: { id: true }
        })
      : Promise.resolve(null)
  ]);

  return {
    userId,
    handle: profile.handle,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    city: profile.city,
    country: profile.country,
    memberSince: profile.user.createdAt,
    verificationLevel: profile.user.verificationLevel,
    trustScore: Number(profile.user.trustScore),
    level: profile.user.level,
    xp: profile.user.xp,
    listingCount,
    followerCount,
    followingCount,
    // Computed live from reviews rather than read from Profile.averageRating,
    // which is a denormalised column nothing currently recalculates.
    ratingAverage: rating._count._all > 0 ? Number(rating._avg.rating ?? 0) : null,
    reviewCount: rating._count._all,
    isSelf,
    isFollowing: followEdge !== null,
    /** True either way round — see the mutual-enforcement note above. */
    isBlocked,
    /** Only the blocker gets an Unblock control; the blocked side is told nothing. */
    blockedByViewer
  };
}

export type ProfileSummary = NonNullable<Awaited<ReturnType<typeof getProfileByHandle>>>;

/** The Listings tab. Newest first, and scoped to public statuses unless the viewer owns the profile. */
export async function getProfileListings(
  ownerId: string,
  viewerIsOwner: boolean,
  blocked = false
): Promise<ProfileListingRow[]> {
  if (blocked) {
    return [];
  }

  return prisma.listing.findMany({
    where: publicListingFilter(ownerId, viewerIsOwner),
    orderBy: { createdAt: "desc" },
    take: 60,
    include: listingCardInclude
  });
}

/**
 * The Liked and Saved tabs. Both are private to the account that owns them —
 * a visitor never sees what someone else hearted — so these take the viewer's
 * own id rather than the profile owner's.
 */
export async function getViewerFavorites(viewerId: string): Promise<ProfileListingRow[]> {
  const rows = await prisma.favorite.findMany({
    where: { userId: viewerId },
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { listing: { include: listingCardInclude } }
  });
  return rows.map((row) => row.listing);
}

export async function getViewerSavedListings(viewerId: string): Promise<ProfileListingRow[]> {
  const rows = await prisma.savedListing.findMany({
    where: { userId: viewerId },
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { listing: { include: listingCardInclude } }
  });
  return rows.map((row) => row.listing);
}

/** Resolves the signed-in user's own handle, for /profile -> /u/[handle]. */
export async function getOwnHandle(userId: string): Promise<string | null> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { handle: true }
  });
  return profile?.handle ?? null;
}
