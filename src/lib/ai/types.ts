import type { Listing, ListingMode } from "@prisma/client";

export type AIProvider = "OPENAI" | "GEMINI" | "CLAUDE" | "OLLAMA" | "LOCAL";

export type UserSignals = {
  userId?: string;
  location?: {
    governorate?: string;
    city?: string;
  };
  viewedListingIds?: string[];
  favoriteCategorySlugs?: string[];
  recentKeywords?: string[];
};

export type SearchIntent =
  | "rent-intent"
  | "swap-intent"
  | "price-intent"
  | "location-intent"
  | "collectibles-intent"
  | "gaming-intent"
  | "generic-intent";

export type IntelligentSearchResult = {
  normalizedQuery: string;
  intent: SearchIntent;
  autocomplete: string[];
  suggestions: string[];
  relatedSearches: string[];
  trendingSearches: string[];
  predictedCategory?: string;
  predictedBrand?: string;
  predictedProduct?: string;
  correctedQuery?: string;
  nearbySuggestions: string[];
  personalizedHints: string[];
};

export type ListingAssistantInput = {
  seedTitle?: string;
  userNotes?: string;
  mode: ListingMode;
  categoryHint?: string;
  city?: string;
  governorate?: string;
};

export type ListingAssistantOutput = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  specifications: Array<{ key: string; value: string }>;
  rentalPriceSuggestion: number;
  swapValueSuggestion: number;
  estimatedDemand: "low" | "medium" | "high";
  seo: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
  };
  imageCaptions: string[];
  missingInformation: string[];
};

export type ImageInsight = {
  productType: string;
  condition: "poor" | "fair" | "good" | "excellent";
  color: string;
  brand?: string;
  model?: string;
  accessories: string[];
  damage: string[];
  scratches: boolean;
  missingParts: string[];
  estimatedQualityScore: number;
  moderationFlag: "clean" | "review-needed";
};

export type PricingInsight = {
  rentalValue: number;
  swapValue: number;
  marketValue: number;
  priceConfidence: number;
  demandLevel: "low" | "medium" | "high";
  expectedRentalDurationDays: number;
  expectedPopularity: number;
  trendDirection: "down" | "stable" | "up";
};

export type MatchInsight = {
  listingSuggestions: Listing[];
  userSuggestions: Array<{ userId: string; reason: string }>;
  potentialSwaps: Array<{ listingId: string; reason: string }>;
  nearbyAlternatives: Listing[];
  betterDeals: Listing[];
  upgradeSuggestions: string[];
  multiWaySwapIdeas: string[];
  chainSwapIdeas: string[];
};

export type AIListingCardCandidate = Listing & {
  owner: {
    trustScore: unknown;
    level: number;
    verificationLevel: string;
  };
  location: {
    city: string;
    governorate: string;
  } | null;
};

export type RecommendationInsight = {
  becauseViewed: AIListingCardCandidate[];
  becauseRented: AIListingCardCandidate[];
  becauseSwapped: AIListingCardCandidate[];
  trendingNearby: AIListingCardCandidate[];
  similarPeopleRented: AIListingCardCandidate[];
  similarPeopleSwapped: AIListingCardCandidate[];
  recommendedForYou: AIListingCardCandidate[];
};

export type HomeFeedInsight = {
  rankedListings: AIListingCardCandidate[];
  reasoning: string[];
  seasonality: string;
  demandSignal: string;
};

export type TrustInsight = {
  aiTrustScore: number;
  confidence: number;
  factors: Array<{ name: string; weight: number; value: number }>;
  notes: string[];
};

export type FraudInsight = {
  fraudProbability: number;
  severity: "low" | "medium" | "high";
  flags: string[];
  moderationActions: string[];
};

export type MarketplaceInsight = {
  highDemandProducts: string[];
  lowDemandProducts: string[];
  bestRentalTiming: string;
  bestSwapOpportunities: string[];
  trendingCategories: string[];
  growingCities: string[];
  marketActivity: string;
};

export type BusinessInsight = {
  forecastRevenue: number;
  expectedDemand: string;
  bestPricingRange: [number, number];
  bestPostingTime: string;
  bestLocations: string[];
  topProfitableCategories: string[];
};

export type NotificationInsight = {
  userId?: string;
  notifications: Array<{
    type:
      | "better-swap"
      | "price-drop"
      | "nearby-listing"
      | "trending-item"
      | "fraud-alert"
      | "recommended-listing"
      | "potential-customer";
    title: string;
    body: string;
    priority: "low" | "medium" | "high";
  }>;
};

export type DashboardInsight = {
  marketplaceHealth: {
    score: number;
    summary: string;
  };
  demandHeatmap: Array<{ city: string; score: number }>;
  fraudAlerts: Array<{ label: string; count: number }>;
  recommendationStats: {
    ctrEstimate: number;
    savedFromRecommendations: number;
  };
  trustAnalytics: {
    averageTrust: number;
    topVerifiedRate: number;
  };
  pricingAnalytics: {
    averageRentalPrice: number;
    averageSwapValue: number;
  };
};
