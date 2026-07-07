import { PremiumCard, SectionHeader, StatsCard, Tag } from "@/components/premium/system";
import { runAIBrainSnapshot } from "@/lib/ai";

export default async function AIDashboardPage() {
  const snapshot = await runAIBrainSnapshot({
    location: {
      governorate: "Cairo",
      city: "Cairo"
    },
    favoriteCategorySlugs: ["gaming", "collectibles", "electronics"],
    recentKeywords: ["playstation", "camera rental", "swap deals"]
  });

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-white/[0.08] bg-[#151515] p-6">
        <SectionHeader eyebrow="Aggarha AI Brain Dashboard" title="Marketplace intelligence and AI operations" />
        <p className="text-sm text-white/70">
          Provider mode: {snapshot.provider}. External LLM connectors are prepared via placeholders for OpenAI, Gemini, Claude,
          Ollama, local LLMs, embeddings, and vector databases.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Tag>Demand Heatmap</Tag>
          <Tag>Fraud Alerts</Tag>
          <Tag>Trust Analytics</Tag>
          <Tag>Pricing Analytics</Tag>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Marketplace Health" value={`${snapshot.dashboard.marketplaceHealth.score}`} />
        <StatsCard label="Recommendation CTR" value={`${(snapshot.dashboard.recommendationStats.ctrEstimate * 100).toFixed(1)}%`} />
        <StatsCard label="Average Trust" value={snapshot.dashboard.trustAnalytics.averageTrust.toFixed(1)} />
        <StatsCard label="Fraud Alerts" value={`${snapshot.dashboard.fraudAlerts.reduce((acc, row) => acc + row.count, 0)}`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">Demand heatmap</p>
          <div className="grid gap-2 text-sm text-white/75">
            {snapshot.dashboard.demandHeatmap.slice(0, 8).map((row) => (
              <div key={row.city} className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                <span>{row.city}</span>
                <span>{row.score}</span>
              </div>
            ))}
          </div>
        </PremiumCard>

        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">Pricing analytics</p>
          <div className="grid gap-2 text-sm text-white/75">
            <p>Average rental price: {snapshot.dashboard.pricingAnalytics.averageRentalPrice.toFixed(2)} EGP</p>
            <p>Average swap value: {snapshot.dashboard.pricingAnalytics.averageSwapValue.toFixed(2)} EGP</p>
            <p>Best rental timing: {snapshot.market.bestRentalTiming}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {snapshot.market.trendingCategories.slice(0, 6).map((category) => (
              <span key={category} className="rounded-full border border-[#ccff00]/45 bg-[#ccff00]/15 px-3 py-1 text-[#eaff95]">
                {category}
              </span>
            ))}
          </div>
        </PremiumCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">Recommendation stats</p>
          <p className="text-sm text-white/75">Saved from recommendations: {snapshot.dashboard.recommendationStats.savedFromRecommendations}</p>
          <p className="text-sm text-white/75">Recommended listings loaded: {snapshot.recommendations.recommendedForYou.length}</p>
        </PremiumCard>
        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">PlayStation engine</p>
          <p className="text-sm text-white/75">Swap candidates: {snapshot.playstation.swapCandidates.length}</p>
          <p className="text-sm text-white/75">Wishlist matches: {snapshot.playstation.wishlistMatches.length}</p>
        </PremiumCard>
        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">Collectibles engine</p>
          <p className="text-sm text-white/75">Analyzed collectibles: {snapshot.collectibles.length}</p>
          <p className="text-sm text-white/75">Growing cities: {snapshot.market.growingCities.slice(0, 3).join(", ") || "N/A"}</p>
        </PremiumCard>
      </section>
    </div>
  );
}
