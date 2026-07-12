import {
  ComingSoonTag,
  PremiumCard,
  SectionHeader,
  StatsCard,
  Tag
} from "@/components/premium/system";
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="relative space-y-4 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(150deg,#090909,#111111,#090909)] p-6 sm:p-8">
        <div className="bg-[#ccff00]/12 pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-[#4f85ff]/12 pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative space-y-4">
          <SectionHeader
            level={1}
            eyebrow="Aggarha AI Brain Dashboard"
            title="Marketplace intelligence and AI operations"
            subtitle={`Running in ${snapshot.provider} mode on deterministic heuristic engines — pricing, trust, fraud, search, and recommendations are live today.`}
          />
          <div className="flex flex-wrap gap-2 text-xs">
            <Tag>Demand Heatmap</Tag>
            <Tag>Fraud Alerts</Tag>
            <Tag>Trust Analytics</Tag>
            <Tag>Pricing Analytics</Tag>
          </div>
          <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-black/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              External model connectors
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(snapshot.llmConnectors).map((connector) => (
                <span
                  key={connector}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/60"
                >
                  {connector}
                  <ComingSoonTag />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Marketplace Health"
          value={`${snapshot.dashboard.marketplaceHealth.score}`}
        />
        <StatsCard
          label="Recommendation CTR"
          value={`${(snapshot.dashboard.recommendationStats.ctrEstimate * 100).toFixed(1)}%`}
        />
        <StatsCard
          label="Average Trust"
          value={snapshot.dashboard.trustAnalytics.averageTrust.toFixed(1)}
        />
        <StatsCard
          label="Fraud Alerts"
          value={`${snapshot.dashboard.fraudAlerts.reduce((acc, row) => acc + row.count, 0)}`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">Demand heatmap</p>
          <div className="grid gap-2 text-sm text-white/75">
            {snapshot.dashboard.demandHeatmap.slice(0, 8).map((row) => (
              <div
                key={row.city}
                className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2"
              >
                <span>{row.city}</span>
                <span>{row.score}</span>
              </div>
            ))}
          </div>
        </PremiumCard>

        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">Pricing analytics</p>
          <div className="grid gap-2 text-sm text-white/75">
            <p>
              Average rental price:{" "}
              {snapshot.dashboard.pricingAnalytics.averageRentalPrice.toFixed(2)} EGP
            </p>
            <p>
              Average swap value: {snapshot.dashboard.pricingAnalytics.averageSwapValue.toFixed(2)}{" "}
              EGP
            </p>
            <p>Best rental timing: {snapshot.market.bestRentalTiming}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {snapshot.market.trendingCategories.slice(0, 6).map((category) => (
              <span
                key={category}
                className="rounded-full border border-[#ccff00]/45 bg-[#ccff00]/15 px-3 py-1 text-[#eaff95]"
              >
                {category}
              </span>
            ))}
          </div>
        </PremiumCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">Recommendation stats</p>
          <p className="text-sm text-white/75">
            Saved from recommendations:{" "}
            {snapshot.dashboard.recommendationStats.savedFromRecommendations}
          </p>
          <p className="text-sm text-white/75">
            Recommended listings loaded: {snapshot.recommendations.recommendedForYou.length}
          </p>
        </PremiumCard>
        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">PlayStation engine</p>
          <p className="text-sm text-white/75">
            Swap candidates: {snapshot.playstation.swapCandidates.length}
          </p>
          <p className="text-sm text-white/75">
            Wishlist matches: {snapshot.playstation.wishlistMatches.length}
          </p>
        </PremiumCard>
        <PremiumCard className="space-y-3 bg-[#171717]">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">Collectibles engine</p>
          <p className="text-sm text-white/75">
            Analyzed collectibles: {snapshot.collectibles.length}
          </p>
          <p className="text-sm text-white/75">
            Growing cities: {snapshot.market.growingCities.slice(0, 3).join(", ") || "N/A"}
          </p>
        </PremiumCard>
      </section>
    </div>
  );
}
