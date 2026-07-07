import { ListingMode, ListingStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

const activeStatuses: ListingStatus[] = ["PUBLISHED", "RESERVED", "RENTED", "SWAPPED", "COMPLETED"];

export async function buildNearbyDiscovery(input: { city?: string; governorate?: string }) {
  const where = {
    status: { in: activeStatuses },
    location: {
      is: {
        city: input.city,
        governorate: input.governorate
      }
    }
  };

  const listings = await prisma.listing.findMany({
    where,
    orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
    include: { category: true, location: true, owner: true },
    take: 24
  });

  const byCategory = (needle: string) => listings.filter((item) => item.category.name.toLowerCase().includes(needle)).slice(0, 4);

  return {
    rentals: listings.filter((item) => item.mode === ListingMode.RENT || item.mode === ListingMode.BOTH).slice(0, 6),
    swaps: listings.filter((item) => item.mode === ListingMode.SWAP || item.mode === ListingMode.BOTH).slice(0, 6),
    collectibles: byCategory("collect"),
    gaming: byCategory("game"),
    cars: byCategory("car"),
    electronics: byCategory("elect"),
    cameras: byCategory("camera"),
    tools: byCategory("tool"),
    musicalInstruments: byCategory("music"),
    eventEquipment: byCategory("event")
  };
}

export async function buildPlaystationIntelligence(userWishlistKeywords: string[] = []) {
  const listings = await prisma.listing.findMany({
    where: {
      status: { in: activeStatuses },
      OR: [
        { title: { contains: "playstation", mode: "insensitive" } },
        { description: { contains: "playstation", mode: "insensitive" } },
        { title: { contains: "ps", mode: "insensitive" } }
      ]
    },
    include: { category: true, owner: true, location: true },
    orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
    take: 30
  });

  const wishMatches = listings.filter((listing) =>
    userWishlistKeywords.some((keyword) =>
      `${listing.title} ${listing.description}`.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  return {
    swapCandidates: listings.filter((item) => item.mode === ListingMode.SWAP || item.mode === ListingMode.BOTH).slice(0, 8),
    rentalCandidates: listings.filter((item) => item.mode === ListingMode.RENT || item.mode === ListingMode.BOTH).slice(0, 8),
    gameBundles: listings.filter((item) => /bundle|set|pack/i.test(item.title)).slice(0, 6),
    collectorEditions: listings.filter((item) => /collector|limited/i.test(item.title)).slice(0, 6),
    accessories: listings.filter((item) => /controller|headset|dock|charger/i.test(item.title)).slice(0, 6),
    wishlistMatches: wishMatches.slice(0, 8),
    futureReleaseRecommendations: [
      "Set alerts for upcoming remastered titles",
      "Recommend early swap windows around launch month"
    ]
  };
}

export async function buildCollectiblesIntelligence() {
  const listings = await prisma.listing.findMany({
    where: {
      status: { in: activeStatuses },
      OR: [
        { title: { contains: "collector", mode: "insensitive" } },
        { title: { contains: "limited", mode: "insensitive" } },
        { description: { contains: "rare", mode: "insensitive" } }
      ]
    },
    orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
    include: { category: true, owner: true, location: true },
    take: 40
  });

  const valueScore = (title: string, viewCount: number) => {
    let score = Math.min(100, viewCount / 9);
    if (/limited|collector|first edition|rare/i.test(title)) score += 18;
    return Math.min(100, Math.round(score));
  };

  return listings.slice(0, 12).map((listing) => {
    const demand = Math.min(100, Math.round(listing.viewCount / 7));
    return {
      listingId: listing.id,
      title: listing.title,
      rarityScore: valueScore(listing.title, listing.viewCount),
      popularityScore: Math.min(100, Math.round(listing.viewCount / 6)),
      estimatedValue: Math.round(Number(listing.priceAmount ?? 0) * 1.1 + 120),
      marketTrend: demand > 75 ? "up" : demand < 35 ? "down" : "stable",
      demandScore: demand,
      collectionScore: Math.min(100, Math.round((demand + valueScore(listing.title, listing.viewCount)) / 2))
    };
  });
}
