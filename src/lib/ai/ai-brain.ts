import { ListingMode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getLLMService } from "@/lib/ai/providers";
import { analyzeListingImages } from "@/lib/ai/engines/image-analyzer";
import { generateListingDraft } from "@/lib/ai/engines/listing-assistant";
import { buildCollectiblesIntelligence, buildNearbyDiscovery, buildPlaystationIntelligence } from "@/lib/ai/engines/domain-intelligence";
import { buildBusinessInsight, buildDashboardInsight, buildMarketplaceInsight, buildNotifications } from "@/lib/ai/engines/market-intelligence";
import { estimatePricing } from "@/lib/ai/engines/pricing-engine";
import { buildHomeFeed, buildMatches, buildRecommendations } from "@/lib/ai/engines/recommendation-engine";
import { calculateFraudRisk, calculateTrustScore } from "@/lib/ai/engines/risk-engine";
import { runIntelligentSearch } from "@/lib/ai/engines/search-intelligence";
import type { ListingAssistantInput, UserSignals } from "@/lib/ai/types";

export async function runSearchIntelligence(query: string, signals?: UserSignals) {
  return runIntelligentSearch(query, signals);
}

export async function runListingAssistant(input: ListingAssistantInput) {
  const draft = generateListingDraft(input);
  const imageInsights = analyzeListingImages(draft.imageCaptions.map((caption) => `placeholder://${caption.replace(/\s+/g, "-")}`));

  return {
    draft,
    imageInsights,
    modelProvider: getLLMService().provider
  };
}

export async function runPricingForListing(listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      owner: true,
      category: true
    }
  });

  if (!listing) {
    return null;
  }

  const categoryFactor = /collect|playstation|game/i.test(listing.category.name) ? 1.22 : 1;

  return estimatePricing({
    mode: listing.mode,
    trustScore: Number(listing.owner.trustScore),
    level: listing.owner.level,
    views: listing.viewCount,
    categoryFactor
  });
}

export async function runTrustAndFraudForListing(listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      owner: {
        include: {
          profile: true,
          receivedReviews: true,
          dealsAsOwner: true,
          fraudReportsAgainst: true
        }
      },
      duplicateSignalsAsPrimary: true
    }
  });

  if (!listing) {
    return null;
  }

  const averageRating =
    listing.owner.receivedReviews.length === 0
      ? 0
      : listing.owner.receivedReviews.reduce((acc, review) => acc + review.rating, 0) / listing.owner.receivedReviews.length;

  const trust = calculateTrustScore({
    completedDeals: listing.owner.dealsAsOwner.filter((deal) => deal.status === "COMPLETED").length,
    reviews: listing.owner.receivedReviews.length,
    avgRating: averageRating,
    responseRate: Number(listing.owner.responseRate),
    responseSpeedMinutes: listing.owner.responseSpeedMinutes,
    cancellationRate: Number(listing.owner.cancellationRate),
    accountAgeDays: listing.owner.accountAgeDays,
    fraudReports: listing.owner.fraudReportsAgainst.length,
    verified: listing.owner.verificationLevel !== "UNVERIFIED"
  });

  const suspiciousPricing = listing.priceAmount ? Number(listing.priceAmount) < 40 : false;
  const fraud = calculateFraudRisk({
    suspiciousPricing,
    duplicateImageSignal: listing.duplicateSignalsAsPrimary.length > 0,
    spamSignal: /free|urgent|dm now/i.test(listing.description),
    repeatedScamSignal: listing.owner.fraudReportsAgainst.length > 2,
    abnormalActivitySignal: listing.viewCount > 20000,
    fakeAccountSignal: listing.owner.accountAgeDays < 5 && listing.owner.verificationLevel === "UNVERIFIED"
  });

  return {
    trust,
    fraud
  };
}

export async function runMatchmaking(listingId: string, signals?: UserSignals) {
  return buildMatches(listingId, signals);
}

export async function runRecommendations(signals?: UserSignals) {
  return buildRecommendations(signals);
}

export async function runHomeFeed(signals?: UserSignals) {
  return buildHomeFeed(signals);
}

export async function runNearbyIntelligence(signals?: UserSignals) {
  return buildNearbyDiscovery({
    city: signals?.location?.city,
    governorate: signals?.location?.governorate
  });
}

export async function runPlaystationIntelligence(userWishlistKeywords?: string[]) {
  return buildPlaystationIntelligence(userWishlistKeywords);
}

export async function runCollectiblesIntelligence() {
  return buildCollectiblesIntelligence();
}

export async function runMarketplaceIntelligence() {
  return buildMarketplaceInsight();
}

export async function runBusinessInsights() {
  return buildBusinessInsight();
}

export async function runNotificationIntelligence(signals?: UserSignals) {
  return buildNotifications(signals);
}

export async function runAIDashboard() {
  return buildDashboardInsight();
}

export async function runAIBrainSnapshot(signals?: UserSignals) {
  const [feed, recommendations, market, nearby, playstation, collectibles, business, dashboard] = await Promise.all([
    runHomeFeed(signals),
    runRecommendations(signals),
    runMarketplaceIntelligence(),
    runNearbyIntelligence(signals),
    runPlaystationIntelligence(signals?.recentKeywords),
    runCollectiblesIntelligence(),
    runBusinessInsights(),
    runAIDashboard()
  ]);

  return {
    provider: getLLMService().provider,
    feed,
    recommendations,
    market,
    nearby,
    playstation,
    collectibles,
    business,
    dashboard,
    llmConnectors: {
      OpenAI: "placeholder-ready",
      Gemini: "placeholder-ready",
      Claude: "placeholder-ready",
      Ollama: "placeholder-ready",
      LocalLLM: "placeholder-ready",
      Embeddings: "placeholder-ready",
      VectorDatabase: "placeholder-ready"
    }
  };
}

export function parseMode(input?: string): ListingMode {
  if (input === "RENT" || input === "SWAP" || input === "BOTH") {
    return input;
  }
  return "BOTH";
}
