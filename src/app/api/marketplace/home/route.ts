import { NextResponse } from "next/server";
import { runHomeFeed, runMarketplaceIntelligence, runRecommendations } from "@/lib/ai";
import { getHomepageShowcase } from "@/lib/marketplace/query";

export async function GET() {
  const [data, personalizedFeed, recommendations, marketIntelligence] = await Promise.all([
    getHomepageShowcase(),
    runHomeFeed(),
    runRecommendations(),
    runMarketplaceIntelligence()
  ]);

  return NextResponse.json({
    status: "ok",
    data,
    ai: {
      personalizedFeed,
      recommendations,
      marketIntelligence
    }
  });
}
