import type { Route } from "next";
import Link from "next/link";
import { ListingMode } from "@prisma/client";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Card } from "@/components/ui/card";
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

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filters = parseSearchFilters(params);
  const results = await searchListings(filters);
  const cards = results.items.map(listingCardData);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-black text-ink sm:text-4xl">Browse marketplace</h1>
        <p className="text-sm text-slate-600">
          Search by keyword, category, location, trust level, verification, availability, and mode.
        </p>
      </section>

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          name="keyword"
          defaultValue={filters.keyword ?? ""}
          placeholder="Keyword"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          name="category"
          defaultValue={filters.category ?? ""}
          placeholder="Category slug"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          name="governorate"
          defaultValue={filters.governorate ?? ""}
          placeholder="Governorate"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          name="city"
          defaultValue={filters.city ?? ""}
          placeholder="City"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <input
          type="number"
          name="radius"
          defaultValue={filters.radius ?? ""}
          placeholder="Radius km"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <input
          type="number"
          name="minPrice"
          defaultValue={filters.minPrice ?? ""}
          placeholder="Min price"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <input
          type="number"
          name="maxPrice"
          defaultValue={filters.maxPrice ?? ""}
          placeholder="Max price"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <select
          name="mode"
          defaultValue={filters.mode ?? ""}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        >
          <option value="">Any mode</option>
          {modeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={filters.sort ?? "newest"}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" name="verifiedOnly" value="true" defaultChecked={filters.verifiedOnly} />
          Verified users only
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" name="availability" value="available" defaultChecked={filters.availability === "available"} />
          Available dates only
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" name="featuredOnly" value="true" defaultChecked={filters.featuredOnly} />
          Featured/Boosted only
        </label>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Apply filters
        </button>
      </form>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Results</p>
          <p className="mt-1 text-2xl font-black text-ink">{results.total}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Current page</p>
          <p className="mt-1 text-2xl font-black text-ink">{results.page}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Page size</p>
          <p className="mt-1 text-2xl font-black text-ink">{results.pageSize}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Page count</p>
          <p className="mt-1 text-2xl font-black text-ink">{results.pageCount}</p>
        </Card>
      </section>

      {cards.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">No listings match this filter set yet. Try relaxing the filters.</p>
        </Card>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </section>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <Link
          href={`/marketplace?page=${Math.max(1, results.page - 1)}` as Route}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          Previous
        </Link>
        <p className="text-sm text-slate-500">
          Page {results.page} of {results.pageCount}
        </p>
        <Link
          href={`/marketplace?page=${Math.min(results.pageCount, results.page + 1)}` as Route}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
