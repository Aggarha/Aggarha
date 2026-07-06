import type { Route } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ListingCard } from "@/components/marketplace/listing-card";
import { getCategoryTree, getHomepageShowcase } from "@/lib/marketplace/query";
import { listingCardData, toNumber } from "@/lib/marketplace/serializers";

export default async function HomePage() {
  const [showcase, categoryTree] = await Promise.all([getHomepageShowcase(), getCategoryTree()]);

  const featured = showcase.featured.map(listingCardData);
  const newest = showcase.newest.slice(0, 6).map(listingCardData);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-panel sm:p-8 lg:p-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative grid gap-7 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <Badge>Aggarha Asset Platform</Badge>
            <h1 className="text-balance text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Rent, swap, and discover trusted assets across Egypt.
            </h1>
            <p className="max-w-2xl text-pretty text-base text-slate-600 sm:text-lg">
              Built for premium discovery and reliability. Aggarha combines marketplace speed with
              trust scoring, verification, and availability-first booking architecture.
            </p>

            <form action="/marketplace" className="grid gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 sm:grid-cols-[1.3fr_1fr_auto] sm:items-center">
              <input
                type="text"
                name="keyword"
                placeholder="Search camera, car, gaming, event equipment..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-accent focus:outline-none"
              />
              <select
                name="category"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-accent focus:outline-none"
                defaultValue=""
              >
                <option value="">All categories</option>
                {showcase.topCategories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button type="submit" className="w-full sm:w-auto">
                Explore Marketplace
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">Rent</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900 ring-1 ring-amber-300">Swap</span>
              <span className="rounded-full bg-teal-700 px-3 py-1 font-semibold text-white">Rent + Swap</span>
            </div>
          </div>

          <Card className="space-y-4 border-0 bg-slate-950 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100">Trust + PWA Ready</p>
            <h2 className="text-2xl font-bold">Demo-ready on every device.</h2>
            <div className="grid gap-2 text-sm text-slate-200">
              <p>Installable PWA for desktop, Android, iPhone, and iPad.</p>
              <p>Trust score, verification levels, and listing reputation integrated.</p>
              <p>Availability calendar and booking foundations included from day one.</p>
            </div>
            <Link href={"/marketplace" as Route} className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
              Open Live Showcase
            </Link>
          </Card>
        </div>
      </section>

      <section id="categories" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Category System</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">Nested categories for asset-scale growth</h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTree.slice(0, 12).map((category: (typeof categoryTree)[number]) => (
            <Card key={category.id} className="bg-white/90">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-500">{category.children.length > 0 ? "Parent" : "Leaf"}</p>
              <p className="mt-2 text-lg font-bold text-ink">{category.name}</p>
              <p className="mt-2 text-sm text-slate-600">{category.description ?? "Asset-ready category node."}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="featured" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Featured Listings Preview</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">High-visibility assets selected by trust and relevance</h2>
          </div>
          <Link href={"/marketplace?sort=featured" as Route} className="text-sm font-semibold text-teal-700 hover:text-teal-800">
            View all featured
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card id="trust" className="space-y-4 bg-gradient-to-br from-teal-900 to-slate-950 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-100">Trust & Reputation Engine</p>
          <h3 className="text-2xl font-bold">Visibility is earned and explainable.</h3>
          <div className="grid gap-2 text-sm text-slate-100">
            <p>Inputs: verification, completed deals, ratings, reviews, response speed/rate, cancellations.</p>
            <p>Prepared: fraud reports, suspicious behavior signals, and future AI fraud scoring.</p>
            <p>Paid features stay bounded so trust and safety never become pay-to-win.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-teal-100">
            <span className="rounded-full bg-white/10 px-3 py-1">Phone</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Email</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Government ID</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Business</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Professional Seller</span>
          </div>
        </Card>

        <Card id="reseller" className="space-y-4 bg-white/95">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Reseller Subscription</p>
          <h3 className="text-2xl font-bold text-ink">Boosted exposure for serious inventory.</h3>
          <p className="text-sm text-slate-600">
            Subscription-ready architecture supports featured and boosted visibility, advanced analytics,
            and premium profile presentation without weakening trust ranking.
          </p>
          <Button className="w-full">Join Reseller Waitlist</Button>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card id="safety" className="bg-slate-100/85">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Safety & Legal</p>
          <h3 className="mt-2 text-xl font-bold text-ink">Aggarha is an asset platform, not a payment custodian.</h3>
          <p className="mt-2 text-sm text-slate-600">
            No payment processing, no custody, and no contract execution. Users discover, evaluate trust,
            and coordinate transactions externally while confirmations and reviews happen in-platform.
          </p>
        </Card>

        <Card className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Newest in marketplace</p>
          {newest.map((listing) => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}` as Route}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:border-teal-300"
            >
              <span className="line-clamp-1 text-sm font-semibold text-slate-800">{listing.title}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {toNumber(listing.trustScore).toFixed(1)}
              </span>
            </Link>
          ))}
        </Card>
      </section>
    </div>
  );
}
