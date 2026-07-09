import type { Route } from "next";
import Link from "next/link";
import { ListingMode } from "@prisma/client";
import { ListingCard } from "@/components/marketplace/listing-card";
import {
  EmptyState,
  FilterPanel,
  MapPanel,
  PremiumButton,
  PremiumInput,
  PremiumSelect,
  RecommendationCard,
  SectionHeader,
  StatsCard,
  Tag,
  TextLink
} from "@/components/premium/system";
import { runNearbyIntelligence, runSearchIntelligence } from "@/lib/ai";
import { parseSearchFilters, searchListings } from "@/lib/marketplace/query";
import { listingCardData } from "@/lib/marketplace/serializers";

type SearchParams = Record<string, string | string[] | undefined>;

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "nearest", label: "Nearest" },
  { value: "featured", label: "Featured" },
  { value: "most_trusted", label: "Most Trusted" },
  { value: "most_viewed", label: "Most Viewed" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" }
];

const modeOptions: Array<{ value: ListingMode; label: string }> = [
  { value: "RENT", label: "Rent" },
  { value: "SWAP", label: "Swap" },
  { value: "BOTH", label: "Rent + Swap" }
];

export default async function MarketplacePage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseSearchFilters(params);
  const [results, searchIntelligence, nearbyIntelligence] = await Promise.all([
    searchListings(filters),
    runSearchIntelligence(filters.keyword ?? "", {
      location: {
        governorate: filters.governorate,
        city: filters.city
      },
      recentKeywords: filters.keyword ? [filters.keyword] : []
    }),
    runNearbyIntelligence({
      location: {
        governorate: filters.governorate,
        city: filters.city
      }
    })
  ]);
  const cards = results.items.map(listingCardData);
  const nearbyCards = nearbyIntelligence.rentals.slice(0, 4).map(listingCardData);
  const relatedQueries = searchIntelligence.relatedSearches.slice(0, 6);
  const trendingQueries = searchIntelligence.trendingSearches.slice(0, 6);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="space-y-4 rounded-[2rem] border border-white/[0.07] bg-[#141414] p-5 sm:p-7">
        <SectionHeader
          level={1}
          eyebrow="Marketplace"
          title="Premium browsing with smart ranking"
          subtitle="Filter by category, location, price, and trust to find rentals and swaps ranked by relevance and reliability."
        />
      </section>

      <form className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <FilterPanel className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PremiumInput
            type="text"
            name="keyword"
            aria-label="Keyword"
            defaultValue={filters.keyword ?? ""}
            placeholder="Keyword"
          />
          <PremiumInput
            type="text"
            name="category"
            aria-label="Category slug"
            defaultValue={filters.category ?? ""}
            placeholder="Category slug"
          />
          <PremiumInput
            type="text"
            name="governorate"
            aria-label="Governorate"
            defaultValue={filters.governorate ?? ""}
            placeholder="Governorate"
          />
          <PremiumInput
            type="text"
            name="city"
            aria-label="City"
            defaultValue={filters.city ?? ""}
            placeholder="City"
          />
          <PremiumInput
            type="number"
            name="radius"
            aria-label="Radius in kilometers"
            defaultValue={filters.radius ?? ""}
            placeholder="Radius km"
          />
          <PremiumInput
            type="number"
            name="minPrice"
            aria-label="Minimum price"
            defaultValue={filters.minPrice ?? ""}
            placeholder="Min price"
          />
          <PremiumInput
            type="number"
            name="maxPrice"
            aria-label="Maximum price"
            defaultValue={filters.maxPrice ?? ""}
            placeholder="Max price"
          />
          <PremiumSelect name="mode" aria-label="Listing mode" defaultValue={filters.mode ?? ""}>
            <option value="">Any mode</option>
            {modeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </PremiumSelect>
          <PremiumSelect name="sort" aria-label="Sort by" defaultValue={filters.sort ?? "newest"}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </PremiumSelect>

          <label className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#121212] px-3 py-2 text-sm text-white/80 transition hover:border-white/20">
            <input
              type="checkbox"
              name="verifiedOnly"
              value="true"
              defaultChecked={filters.verifiedOnly}
            />
            Verified users only
          </label>

          <label className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#121212] px-3 py-2 text-sm text-white/80 transition hover:border-white/20">
            <input
              type="checkbox"
              name="availability"
              value="available"
              defaultChecked={filters.availability === "available"}
            />
            Available dates only
          </label>

          <label className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#121212] px-3 py-2 text-sm text-white/80 transition hover:border-white/20">
            <input
              type="checkbox"
              name="featuredOnly"
              value="true"
              defaultChecked={filters.featuredOnly}
            />
            Featured/Boosted only
          </label>

          <PremiumButton type="submit" className="w-full">
            Apply filters
          </PremiumButton>
        </FilterPanel>

        <FilterPanel className="space-y-3">
          <p className="text-xs uppercase tracking-[0.12em] text-white/55">Search Intelligence</p>
          <p className="text-sm text-white/70">Intent: {searchIntelligence.intent}</p>
          <p className="text-sm text-white/70">
            Corrected query: {searchIntelligence.correctedQuery ?? "No correction"}
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedQueries.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingQueries.map((item) => (
              <Tag key={item} className="bg-[#ccff00]/8 border-[#ccff00]/35 text-[#ebff9d]">
                {item}
              </Tag>
            ))}
          </div>
        </FilterPanel>
      </form>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Results" value={`${results.total}`} />
        <StatsCard label="Current Page" value={`${results.page}`} />
        <StatsCard label="Page Size" value={`${results.pageSize}`} />
        <StatsCard label="Page Count" value={`${results.pageCount}`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <MapPanel
          title="Listing Map"
          layers={["Approximate Location", "Nearby Rentals", "Nearby Swaps"]}
        />
        <div className="space-y-3 rounded-3xl border border-white/[0.07] bg-[#171717] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-white/60">Nearby Intelligence</p>
          <h2 className="text-xl font-black text-white">Recommended nearby alternatives</h2>
          <div className="grid gap-2 text-sm text-white/75">
            {(nearbyCards.length > 0 ? nearbyCards : cards.slice(0, 4)).map((listing) => (
              <RecommendationCard
                key={listing.id}
                title={listing.title}
                reason="AI nearby suggestions by trust, availability, and distance"
                href={`/marketplace/${listing.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {cards.length === 0 ? (
        <EmptyState
          title="No matching listings yet"
          description="Try relaxing filters or changing mode, location, and pricing bounds."
          action={<TextLink href={"/marketplace" as Route}>Clear all filters</TextLink>}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </section>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#151515] p-4">
        {results.page <= 1 ? (
          <span className="min-h-[44px] cursor-not-allowed rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white/35">
            Previous
          </span>
        ) : (
          <Link
            href={`/marketplace?page=${results.page - 1}` as Route}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-white/85 hover:border-[#ccff00]/50"
          >
            Previous
          </Link>
        )}
        <p className="text-sm text-white/65">
          Page {results.page} of {results.pageCount}
        </p>
        {results.page >= results.pageCount ? (
          <span className="min-h-[44px] cursor-not-allowed rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white/35">
            Next
          </span>
        ) : (
          <Link
            href={`/marketplace?page=${results.page + 1}` as Route}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-white/85 hover:border-[#ccff00]/50"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
