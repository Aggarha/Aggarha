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
  const collectibleShowcase = showcase.newest.filter((listing) => listing.mode !== "RENT").slice(0, 4).map(listingCardData);
  const playstationShowcase = showcase.featured.filter((listing) => listing.mode !== "RENT").slice(0, 4).map(listingCardData);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/55 p-6 shadow-panel sm:p-8 lg:p-10">
        <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-[#ccff00]/20 blur-3xl" />
        <div className="absolute -bottom-24 left-8 h-60 w-60 rounded-full bg-[#ccff00]/10 blur-3xl" />

        <div className="relative grid gap-7 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <Badge className="border border-[#ccff00]/40 bg-[#ccff00]/15 text-[#ecff9b]">A6 Premium Marketplace</Badge>
            <h1 className="text-balance text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Stay, rent, swap, and trade premium assets across Egypt.
            </h1>
            <p className="max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
              Airbnb-inspired discovery flow redesigned for rentals and exchanges, now with a bold black + lime visual system,
              rich listing storytelling, and trust signals in every step.
            </p>

            <form action="/marketplace" className="grid gap-3 rounded-2xl border border-white/15 bg-black/50 p-3 sm:grid-cols-[1.3fr_1fr_auto] sm:items-center">
              <input
                type="text"
                name="keyword"
                placeholder="Search apartment, camera, collectibles, PlayStation games..."
                className="w-full rounded-xl border border-white/20 bg-black/60 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-[#ccff00] focus:outline-none"
              />
              <select
                name="category"
                className="w-full rounded-xl border border-white/20 bg-black/60 px-4 py-3 text-sm text-white focus:border-[#ccff00] focus:outline-none"
                defaultValue=""
              >
                <option value="">All categories</option>
                {showcase.topCategories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button type="submit" className="w-full bg-[#ccff00] text-black hover:bg-[#ddff57] sm:w-auto">
                Explore Marketplace
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white">Rent</span>
              <span className="rounded-full border border-[#ccff00]/40 bg-[#ccff00]/15 px-3 py-1 font-semibold text-[#ebff93]">Swap</span>
              <span className="rounded-full border border-[#ccff00]/40 bg-[#ccff00] px-3 py-1 font-semibold text-black">Rent + Swap</span>
            </div>
          </div>

          <Card className="space-y-4 border-white/15 bg-neutral-950/90 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ccff00]">Experience Upgrade</p>
            <h2 className="text-2xl font-bold">Premium UX on desktop and mobile.</h2>
            <div className="grid gap-2 text-sm text-white/80">
              <p>Immersive gallery and sticky booking card patterns on listing pages.</p>
              <p>Owner reputation, review quality, and nearby context surfaced immediately.</p>
              <p>Dedicated collectibles and PlayStation exchange pathways.</p>
            </div>
            <Link href={"/marketplace" as Route} className="inline-flex w-full items-center justify-center rounded-xl bg-[#ccff00] px-4 py-2.5 text-sm font-bold text-black hover:bg-[#ddff57]">
              Open Premium Showcase
            </Link>
          </Card>
        </div>
      </section>

      <section id="categories" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">Category System</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Nested categories for marketplace-scale growth</h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTree.slice(0, 12).map((category: (typeof categoryTree)[number]) => (
            <Card key={category.id} className="border-white/10 bg-black/45">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/60">{category.children.length > 0 ? "Parent" : "Leaf"}</p>
              <p className="mt-2 text-lg font-bold text-white">{category.name}</p>
              <p className="mt-2 text-sm text-white/70">{category.description ?? "Asset-ready category node."}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="featured" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">Featured Listings Preview</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">High-visibility assets selected by trust and relevance</h2>
          </div>
          <Link href={"/marketplace?sort=featured" as Route} className="text-sm font-semibold text-[#ccff00] hover:text-[#ddff57]">
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
        <Card id="trust" className="space-y-4 border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#ccff00]">Trust & Reputation Engine</p>
          <h3 className="text-2xl font-bold">Visibility is earned and explainable.</h3>
          <div className="grid gap-2 text-sm text-white/80">
            <p>Inputs: verification, completed deals, ratings, reviews, response speed/rate, cancellations.</p>
            <p>Prepared: fraud reports, suspicious behavior signals, and future AI fraud scoring.</p>
            <p>Paid features stay bounded so trust and safety never become pay-to-win.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-white/80">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Phone</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Email</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Government ID</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Business</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Professional Seller</span>
          </div>
        </Card>

        <Card id="reseller" className="space-y-4 border-white/10 bg-black/45">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">Reseller Subscription</p>
          <h3 className="text-2xl font-bold text-white">Boosted exposure for serious inventory.</h3>
          <p className="text-sm text-white/70">
            Subscription-ready architecture supports featured and boosted visibility, advanced analytics,
            and premium profile presentation without weakening trust ranking.
          </p>
          <Button className="w-full bg-[#ccff00] text-black hover:bg-[#ddff57]">Join Reseller Waitlist</Button>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card id="safety" className="border-white/10 bg-black/45">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Safety & Legal</p>
          <h3 className="mt-2 text-xl font-bold text-white">Aggarha is an asset platform, not a payment custodian.</h3>
          <p className="mt-2 text-sm text-white/70">
            No payment processing, no custody, and no contract execution. Users discover, evaluate trust,
            and coordinate transactions externally while confirmations and reviews happen in-platform.
          </p>
        </Card>

        <Card className="space-y-3 border-white/10 bg-black/45">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Newest in marketplace</p>
          {newest.map((listing) => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}` as Route}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-black/35 px-3 py-2 hover:border-[#ccff00]/40"
            >
              <span className="line-clamp-1 text-sm font-semibold text-white">{listing.title}</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-xs text-white/70">
                {toNumber(listing.trustScore).toFixed(1)}
              </span>
            </Link>
          ))}
        </Card>
      </section>

      <section id="collectibles" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">Collectibles Exchange</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Rare finds and verified swaps</h2>
          </div>
          <Link href={"/marketplace?mode=SWAP" as Route} className="text-sm font-semibold text-[#ccff00] hover:text-[#ddff57]">
            Browse swaps
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(collectibleShowcase.length > 0 ? collectibleShowcase : newest.slice(0, 4)).map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </section>

      <section id="playstation" className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">PlayStation Games Exchange</p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">Trade and rent console titles faster</h2>
          </div>
          <Link href={"/marketplace?keyword=playstation&mode=BOTH" as Route} className="text-sm font-semibold text-[#ccff00] hover:text-[#ddff57]">
            Explore PlayStation
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(playstationShowcase.length > 0 ? playstationShowcase : featured.slice(0, 4)).map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
