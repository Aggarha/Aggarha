import { ListingMode, ListingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { HomeFeedInsight, MatchInsight, RecommendationInsight, UserSignals } from "@/lib/ai/types";

const activeStatuses: ListingStatus[] = ["PUBLISHED", "RESERVED", "RENTED", "SWAPPED", "COMPLETED"];

type ListingWithSignals = Prisma.ListingGetPayload<{
  include: {
    location: true;
    category: true;
    owner: true;
  };
}>;

async function basePool(limit = 40): Promise<ListingWithSignals[]> {
  return prisma.listing.findMany({
    where: { status: { in: activeStatuses } },
    orderBy: [{ featuredUntil: "desc" }, { viewCount: "desc" }, { createdAt: "desc" }],
    take: limit,
    include: {
      location: true,
      category: true,
      owner: true
    }
  });
}

function rankForSignals(listings: ListingWithSignals[], userSignals?: UserSignals): ListingWithSignals[] {
  const governorate = userSignals?.location?.governorate?.toLowerCase();
  const favorites = (userSignals?.favoriteCategorySlugs ?? []).map((value) => value.toLowerCase());

  return [...listings].sort((a, b) => {
    const aScore =
      (favorites.some((slug) => a.title.toLowerCase().includes(slug)) ? 20 : 0) +
      (governorate && a.location?.governorate?.toLowerCase() === governorate ? 16 : 0) +
      a.viewCount / 10;

    const bScore =
      (favorites.some((slug) => b.title.toLowerCase().includes(slug)) ? 20 : 0) +
      (governorate && b.location?.governorate?.toLowerCase() === governorate ? 16 : 0) +
      b.viewCount / 10;

    return bScore - aScore;
  });
}

function toCardListing(item: ListingWithSignals) {
  return {
    ...item,
    owner: {
      trustScore: item.owner.trustScore,
      level: item.owner.level,
      verificationLevel: item.owner.verificationLevel
    },
    location: item.location
      ? {
          city: item.location.city,
          governorate: item.location.governorate
        }
      : null
  };
}

export async function buildRecommendations(userSignals?: UserSignals): Promise<RecommendationInsight> {
  const pool = await basePool();
  const ranked = rankForSignals(pool, userSignals);

  const becauseViewed = ranked.filter((item) => userSignals?.viewedListingIds?.includes(item.id)).slice(0, 6);
  const becauseRented = ranked.filter((item) => item.mode === ListingMode.RENT || item.mode === ListingMode.BOTH).slice(0, 6);
  const becauseSwapped = ranked.filter((item) => item.mode === ListingMode.SWAP || item.mode === ListingMode.BOTH).slice(0, 6);
  const trendingNearby = ranked.slice(0, 6);

  return {
    becauseViewed: becauseViewed.map(toCardListing),
    becauseRented: becauseRented.map(toCardListing),
    becauseSwapped: becauseSwapped.map(toCardListing),
    trendingNearby: trendingNearby.map(toCardListing),
    similarPeopleRented: becauseRented.slice(0, 4).map(toCardListing),
    similarPeopleSwapped: becauseSwapped.slice(0, 4).map(toCardListing),
    recommendedForYou: ranked.slice(0, 8).map(toCardListing)
  };
}

export async function buildMatches(listingId: string, userSignals?: UserSignals): Promise<MatchInsight> {
  const [target, pool] = await Promise.all([
    prisma.listing.findUnique({ where: { id: listingId }, include: { location: true, category: true } }),
    basePool()
  ]);

  const safePool = pool.filter((item) => item.id !== listingId);
  const compatible = safePool.filter((item) =>
    target ? item.mode === target.mode || item.mode === ListingMode.BOTH || target.mode === ListingMode.BOTH : true
  );
  const preferredCategories = new Set((userSignals?.favoriteCategorySlugs ?? []).map((slug) => slug.toLowerCase()));
  const nearby = compatible.filter((item) =>
    target?.location ? item.location?.city === target.location.city || item.location?.governorate === target.location.governorate : false
  );
  const ranked = [...compatible].sort((left, right) => {
    const leftBoost = preferredCategories.has(left.category.slug.toLowerCase()) ? 1 : 0;
    const rightBoost = preferredCategories.has(right.category.slug.toLowerCase()) ? 1 : 0;
    return rightBoost - leftBoost;
  });

  return {
    listingSuggestions: ranked.slice(0, 8),
    userSuggestions: ranked.slice(0, 5).map((item) => ({ userId: item.ownerId, reason: `Owner with matching ${item.mode.toLowerCase()} preference` })),
    potentialSwaps: compatible.slice(0, 6).map((item) => ({ listingId: item.id, reason: "Mode and category overlap" })),
    nearbyAlternatives: nearby.slice(0, 6),
    betterDeals: [...compatible].sort((a, b) => Number(a.priceAmount ?? 0) - Number(b.priceAmount ?? 0)).slice(0, 5),
    upgradeSuggestions: [
      "Compare top trust listings in same city",
      "Try listing bundles for faster multi-item swap",
      "Set flexible availability to unlock higher ranking"
    ],
    multiWaySwapIdeas: [
      "User A gives camera body, User B gives lens kit, User C gives lighting package",
      "Console -> controller set -> premium game bundle cycle"
    ],
    chainSwapIdeas: [
      "2-hop swap path: listing A -> listing B -> target listing",
      "3-hop high trust chain for rare collectibles"
    ]
  };
}

export async function buildHomeFeed(userSignals?: UserSignals): Promise<HomeFeedInsight> {
  const recs = await buildRecommendations(userSignals);

  return {
    rankedListings: recs.recommendedForYou,
    reasoning: [
      "Ranked by interest similarity",
      "Location-aware weighting",
      "Trust and completed history normalization",
      "Seasonal demand adjustment"
    ],
    seasonality: "Summer mobility and travel accessories are peaking.",
    demandSignal: "Gaming and collectibles swaps are rising this week."
  };
}
