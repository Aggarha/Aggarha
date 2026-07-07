import { ListingMode } from "@prisma/client";
import type { PricingInsight } from "@/lib/ai/types";

export function estimatePricing(input: {
  mode: ListingMode;
  trustScore: number;
  level: number;
  views: number;
  categoryFactor?: number;
}): PricingInsight {
  const categoryFactor = input.categoryFactor ?? 1;
  const trustBoost = 1 + input.trustScore / 250;
  const levelBoost = 1 + input.level / 40;
  const popularityBoost = 1 + Math.min(0.4, input.views / 5000);
  const modeBase = input.mode === "RENT" ? 240 : input.mode === "SWAP" ? 1300 : 890;

  const marketValue = Math.round(modeBase * categoryFactor * trustBoost * levelBoost);
  const rentalValue = Math.round((marketValue * 0.13 + 80) * popularityBoost);
  const swapValue = Math.round(marketValue * 1.02);
  const popularity = Math.min(100, Math.round(input.views / 20 + input.trustScore));

  return {
    rentalValue,
    swapValue,
    marketValue,
    priceConfidence: Math.min(0.97, 0.58 + input.trustScore / 200),
    demandLevel: popularity > 72 ? "high" : popularity > 45 ? "medium" : "low",
    expectedRentalDurationDays: popularity > 70 ? 5 : popularity > 45 ? 9 : 14,
    expectedPopularity: popularity,
    trendDirection: popularity > 70 ? "up" : popularity < 35 ? "down" : "stable"
  };
}
