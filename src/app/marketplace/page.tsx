import type { Route } from "next";
import Link from "next/link";
import { ListingMode } from "@prisma/client";
import { ListingCard } from "@/components/marketplace/listing-card";
import {
  EmptyState,
  FilterPanel,
  PremiumButton,
  PremiumInput,
  PremiumSelect,
  TextLink
} from "@/components/premium/system";
import { buildCategoryLabel } from "@/lib/marketplace/demo-content";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { getCategoryTree, parseSearchFilters, searchListings } from "@/lib/marketplace/query";
import { listingCardData } from "@/lib/marketplace/serializers";

type SearchParams = Record<string, string | string[] | undefined>;
type CategoryNode = Awaited<ReturnType<typeof getCategoryTree>>[number];

function ChevronIcon({ direction, isRtl }: { direction: "prev" | "next"; isRtl: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={isRtl ? "scale-x-[-1]" : undefined}
    >
      <path d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

function flattenCategories(nodes: CategoryNode[]): Array<{ slug: string; name: string }> {
  const flat: Array<{ slug: string; name: string }> = [];
  for (const node of nodes) {
    flat.push({ slug: node.slug, name: node.name });
    if (node.children.length > 0) {
      flat.push(...flattenCategories(node.children as CategoryNode[]));
    }
  }
  return flat;
}

export default async function MarketplacePage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseSearchFilters(params);
  const [results, categoryTree, { locale, t }] = await Promise.all([
    searchListings(filters),
    getCategoryTree(),
    getLocaleAndDictionary()
  ]);
  const cards = results.items.map(listingCardData);
  const categories = flattenCategories(categoryTree);
  const isRtl = locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  const sortOptions: Array<{ value: string; label: string }> = [
    { value: "newest", label: t.marketplace.sort.newest },
    { value: "nearest", label: t.marketplace.sort.nearest },
    { value: "featured", label: t.marketplace.sort.featured },
    { value: "most_trusted", label: t.marketplace.sort.mostTrusted },
    { value: "most_viewed", label: t.marketplace.sort.mostViewed },
    { value: "price_low", label: t.marketplace.sort.priceLow },
    { value: "price_high", label: t.marketplace.sort.priceHigh }
  ];

  const modeOptions: Array<{ value: ListingMode; label: string }> = [
    { value: "RENT", label: t.common.rent },
    { value: "SWAP", label: t.common.swap },
    { value: "BOTH", label: t.common.rentSwap }
  ];

  return (
    <div dir={dir} className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-14 pt-4 sm:px-6 lg:px-8">
      <form className="sticky top-14 z-30 -mx-4 space-y-2 bg-black/85 px-4 pb-3 pt-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <FilterPanel className="bg-[#141414] p-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center">
            <PremiumInput
              type="text"
              name="keyword"
              aria-label={t.marketplace.searchPlaceholder}
              defaultValue={filters.keyword ?? ""}
              placeholder={t.marketplace.searchPlaceholder}
            />
            <PremiumSelect name="category" aria-label={t.marketplace.allCategories} defaultValue={filters.category ?? ""}>
              <option value="">{t.marketplace.allCategories}</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {buildCategoryLabel(category.slug, category.name, locale)}
                </option>
              ))}
            </PremiumSelect>
            <PremiumInput
              type="text"
              name="city"
              aria-label={t.marketplace.locationPlaceholder}
              defaultValue={filters.city ?? ""}
              placeholder={t.marketplace.locationPlaceholder}
            />
            <PremiumButton type="submit" tone="primary" className="w-full lg:w-auto">
              {t.marketplace.search}
            </PremiumButton>
          </div>

          <details className="group mt-2 rounded-2xl border border-white/[0.06] bg-[#121212]">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white/75 transition-colors duration-200 ease-[var(--ease-premium)] hover:text-white [&::-webkit-details-marker]:hidden">
              {t.marketplace.advancedFilters}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-white/50 transition-transform duration-200 group-open:rotate-180"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="grid gap-3 border-t border-white/[0.06] p-4 sm:grid-cols-2 lg:grid-cols-3">
              <PremiumInput
                type="text"
                name="governorate"
                aria-label={t.marketplace.governorate}
                defaultValue={filters.governorate ?? ""}
                placeholder={t.marketplace.governorate}
              />
              <PremiumInput
                type="number"
                name="radius"
                aria-label={t.marketplace.radiusKm}
                defaultValue={filters.radius ?? ""}
                placeholder={t.marketplace.radiusKm}
              />
              <PremiumSelect name="mode" aria-label={t.marketplace.anyMode} defaultValue={filters.mode ?? ""}>
                <option value="">{t.marketplace.anyMode}</option>
                {modeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </PremiumSelect>
              <PremiumInput
                type="number"
                name="minPrice"
                aria-label={t.marketplace.minPrice}
                defaultValue={filters.minPrice ?? ""}
                placeholder={t.marketplace.minPrice}
              />
              <PremiumInput
                type="number"
                name="maxPrice"
                aria-label={t.marketplace.maxPrice}
                defaultValue={filters.maxPrice ?? ""}
                placeholder={t.marketplace.maxPrice}
              />
              <PremiumSelect name="sort" aria-label={t.marketplace.sort.newest} defaultValue={filters.sort ?? "newest"}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </PremiumSelect>

              <label className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#171717] px-3 py-2 text-sm text-white/80 transition hover:border-white/20">
                <input type="checkbox" name="verifiedOnly" value="true" defaultChecked={filters.verifiedOnly} />
                {t.marketplace.verifiedOnly}
              </label>
              <label className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#171717] px-3 py-2 text-sm text-white/80 transition hover:border-white/20">
                <input
                  type="checkbox"
                  name="availability"
                  value="available"
                  defaultChecked={filters.availability === "available"}
                />
                {t.marketplace.availableOnly}
              </label>
              <label className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#171717] px-3 py-2 text-sm text-white/80 transition hover:border-white/20">
                <input type="checkbox" name="featuredOnly" value="true" defaultChecked={filters.featuredOnly} />
                {t.marketplace.featuredOnly}
              </label>
            </div>
          </details>
        </FilterPanel>
      </form>

      {cards.length === 0 ? (
        <EmptyState
          title={t.marketplace.noResultsTitle}
          description={t.marketplace.noResultsDescription}
          action={<TextLink href={"/marketplace" as Route}>{t.marketplace.clearFilters}</TextLink>}
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {cards.map((listing) => (
            <ListingCard key={listing.id} {...listing} lang={locale} />
          ))}
        </section>
      )}

      {results.pageCount > 1 ? (
        <div className="flex items-center justify-center gap-4">
          {results.page <= 1 ? (
            <span className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full text-white/25">
              <ChevronIcon direction="prev" isRtl={isRtl} />
            </span>
          ) : (
            <Link
              href={`/marketplace?page=${results.page - 1}` as Route}
              aria-label="Previous page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/75 transition-all duration-200 ease-[var(--ease-premium)] hover:border-[#ccff00]/50 hover:text-white active:scale-95"
            >
              <ChevronIcon direction="prev" isRtl={isRtl} />
            </Link>
          )}
          <p className="text-xs font-medium tabular-nums text-white/45">
            {results.page} / {results.pageCount}
          </p>
          {results.page >= results.pageCount ? (
            <span className="inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full text-white/25">
              <ChevronIcon direction="next" isRtl={isRtl} />
            </span>
          ) : (
            <Link
              href={`/marketplace?page=${results.page + 1}` as Route}
              aria-label="Next page"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/75 transition-all duration-200 ease-[var(--ease-premium)] hover:border-[#ccff00]/50 hover:text-white active:scale-95"
            >
              <ChevronIcon direction="next" isRtl={isRtl} />
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}
