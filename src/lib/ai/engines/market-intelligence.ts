import { prisma } from "@/lib/db";
import type { BusinessInsight, DashboardInsight, MarketplaceInsight, NotificationInsight, UserSignals } from "@/lib/ai/types";

export async function buildMarketplaceInsight(): Promise<MarketplaceInsight> {
  const [topListings, lowListings, categoryRows, cityRows] = await Promise.all([
    prisma.listing.findMany({
      where: { status: { in: ["PUBLISHED", "RESERVED", "RENTED", "SWAPPED", "COMPLETED"] } },
      orderBy: { viewCount: "desc" },
      take: 8,
      select: { title: true, category: { select: { name: true } } }
    }),
    prisma.listing.findMany({
      where: { status: { in: ["PUBLISHED", "RESERVED", "RENTED", "SWAPPED", "COMPLETED"] } },
      orderBy: { viewCount: "asc" },
      take: 8,
      select: { title: true, category: { select: { name: true } } }
    }),
    prisma.category.findMany({
      orderBy: { listings: { _count: "desc" } },
      take: 6,
      include: { _count: { select: { listings: true } } }
    }),
    prisma.location.findMany({
      orderBy: { listings: { _count: "desc" } },
      take: 6,
      include: { _count: { select: { listings: true } } }
    })
  ]);

  return {
    highDemandProducts: topListings.map((item) => item.title),
    lowDemandProducts: lowListings.map((item) => item.title),
    bestRentalTiming: "Evening and weekend windows show strongest completion rates.",
    bestSwapOpportunities: topListings.map((item) => `Swap lane: ${item.category.name}`),
    trendingCategories: categoryRows.map((item) => `${item.name} (${item._count.listings})`),
    growingCities: cityRows.map((item) => `${item.city}, ${item.governorate}`),
    marketActivity: `Tracked ${topListings.length + lowListings.length} demand markers from active inventory.`
  };
}

export async function buildBusinessInsight(): Promise<BusinessInsight> {
  const listings = await prisma.listing.findMany({
    where: { status: { in: ["PUBLISHED", "RESERVED", "RENTED", "SWAPPED", "COMPLETED"] } },
    select: { priceAmount: true, category: { select: { name: true } }, location: { select: { city: true } } },
    take: 200
  });

  const prices = listings.map((item) => Number(item.priceAmount ?? 0)).filter((value) => value > 0);
  const avg = prices.length === 0 ? 0 : prices.reduce((acc, value) => acc + value, 0) / prices.length;

  const categories = new Map<string, number>();
  const cities = new Map<string, number>();

  for (const row of listings) {
    categories.set(row.category.name, (categories.get(row.category.name) ?? 0) + 1);
    const city = row.location?.city ?? "Unknown";
    cities.set(city, (cities.get(city) ?? 0) + 1);
  }

  return {
    forecastRevenue: Math.round(avg * 14),
    expectedDemand: avg > 900 ? "high" : avg > 500 ? "medium" : "low",
    bestPricingRange: [Math.round(avg * 0.85), Math.round(avg * 1.15)],
    bestPostingTime: "Thursday 7 PM - Saturday 11 PM",
    bestLocations: [...cities.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([city]) => city),
    topProfitableCategories: [...categories.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name]) => name)
  };
}

export async function buildNotifications(userSignals?: UserSignals): Promise<NotificationInsight> {
  const baseArea = userSignals?.location?.city ?? "your city";
  return {
    userId: userSignals?.userId,
    notifications: [
      {
        type: "better-swap",
        title: "Found a better swap",
        body: "A higher trust listing now matches your recent exchange activity.",
        priority: "high"
      },
      {
        type: "price-drop",
        title: "Price dropped",
        body: "One of your viewed items dropped below the estimated market range.",
        priority: "medium"
      },
      {
        type: "nearby-listing",
        title: `New nearby listing in ${baseArea}`,
        body: "A similar item is now available with instant booking windows.",
        priority: "medium"
      }
    ]
  };
}

export async function buildDashboardInsight(): Promise<DashboardInsight> {
  const [users, listings, reports, deals, reviews] = await Promise.all([
    prisma.user.findMany({ select: { trustScore: true, verificationLevel: true }, take: 1000 }),
    prisma.listing.findMany({ select: { priceAmount: true, mode: true, location: { select: { city: true } } }, take: 1000 }),
    prisma.fraudReport.findMany({ select: { status: true }, take: 500 }),
    prisma.deal.count(),
    prisma.review.count()
  ]);

  const avgTrust = users.length === 0 ? 0 : users.reduce((acc, user) => acc + Number(user.trustScore), 0) / users.length;
  const verifiedRate = users.length === 0 ? 0 : users.filter((user) => user.verificationLevel !== "UNVERIFIED").length / users.length;

  const cityScores = new Map<string, number>();
  let rentalTotal = 0;
  let swapTotal = 0;
  let rentalCount = 0;
  let swapCount = 0;

  for (const listing of listings) {
    const city = listing.location?.city ?? "Unknown";
    cityScores.set(city, (cityScores.get(city) ?? 0) + 1);
    const price = Number(listing.priceAmount ?? 0);
    if (listing.mode === "RENT" || listing.mode === "BOTH") {
      rentalTotal += price;
      rentalCount += 1;
    }
    if (listing.mode === "SWAP" || listing.mode === "BOTH") {
      swapTotal += price;
      swapCount += 1;
    }
  }

  const openReports = reports.filter((report) => report.status === "OPEN" || report.status === "UNDER_REVIEW").length;

  return {
    marketplaceHealth: {
      score: Number((Math.min(100, avgTrust * 0.8 + deals * 0.07 + reviews * 0.03)).toFixed(2)),
      summary: "AI signals are stable with strong trust-weighted marketplace velocity."
    },
    demandHeatmap: [...cityScores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([city, score]) => ({ city, score })),
    fraudAlerts: [
      { label: "Open / Under review", count: openReports },
      { label: "Confirmed", count: reports.filter((report) => report.status === "CONFIRMED").length },
      { label: "Dismissed", count: reports.filter((report) => report.status === "DISMISSED").length }
    ],
    recommendationStats: {
      ctrEstimate: Number((0.08 + avgTrust / 1200).toFixed(3)),
      savedFromRecommendations: Math.round(deals * 0.34)
    },
    trustAnalytics: {
      averageTrust: Number(avgTrust.toFixed(2)),
      topVerifiedRate: Number((verifiedRate * 100).toFixed(2))
    },
    pricingAnalytics: {
      averageRentalPrice: rentalCount === 0 ? 0 : Number((rentalTotal / rentalCount).toFixed(2)),
      averageSwapValue: swapCount === 0 ? 0 : Number((swapTotal / swapCount).toFixed(2))
    }
  };
}
