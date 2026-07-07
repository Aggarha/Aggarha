import type { Route } from "next";
import Link from "next/link";
import { ListingCard } from "@/components/marketplace/listing-card";
import {
  CollectibleCard,
  HeroAdsSlider,
  HeroBanner,
  MapPanel,
  NearbyCard,
  PlayStationCard,
  PremiumBadge,
  PremiumButton,
  RecommendationCard,
  SearchBar,
  SectionHeader,
  StatsCard,
  Tag
} from "@/components/premium/system";
import { runHomeFeed, runMarketplaceIntelligence, runRecommendations, runSearchIntelligence } from "@/lib/ai";
import { getCategoryTree, getHomepageShowcase } from "@/lib/marketplace/query";
import { listingCardData } from "@/lib/marketplace/serializers";

export default async function HomePage() {
  const [showcase, categoryTree, homeFeed, recommendations, marketIntelligence, searchIntelligence] = await Promise.all([
    getHomepageShowcase(),
    getCategoryTree(),
    runHomeFeed(),
    runRecommendations(),
    runMarketplaceIntelligence(),
    runSearchIntelligence("playstation swap in cairo", {
      location: {
        governorate: "Cairo",
        city: "Cairo"
      },
      favoriteCategorySlugs: ["gaming", "collectibles"],
      recentKeywords: ["playstation", "collector edition"]
    })
  ]);

  const featured = showcase.featured.map(listingCardData);
  const newest = showcase.newest.slice(0, 6).map(listingCardData);
  const collectibleShowcase = showcase.newest.filter((listing) => listing.mode !== "RENT").slice(0, 4).map(listingCardData);
  const playstationShowcase = showcase.featured.filter((listing) => listing.mode !== "RENT").slice(0, 4).map(listingCardData);
  const personalizedFeed = homeFeed.rankedListings.slice(0, 4).map(listingCardData);
  const recommendedForYou = recommendations.recommendedForYou.slice(0, 4).map(listingCardData);
  const topRented = [...featured].sort((a, b) => b.trustScore - a.trustScore).slice(0, 4);
  const topSwapped = [...collectibleShowcase, ...playstationShowcase].slice(0, 4);

  const topRenters = [
    { name: "Mina Adel", trust: 92.8, deals: 164, rating: "4.9", response: "8 min", verify: "ID + Business" },
    { name: "Nour Hossam", trust: 91.1, deals: 139, rating: "4.8", response: "11 min", verify: "ID + Email" },
    { name: "Sherif Anwar", trust: 90.5, deals: 126, rating: "4.8", response: "13 min", verify: "Pro Seller" }
  ];

  const campaignSlides = [
    { title: "Summer Rental Campaign", caption: "Premium listings with boosted visibility and verified owners." },
    { title: "Collectibles Week", caption: "Rare collectibles exchange with AI estimated value placeholders." },
    { title: "PlayStation Exchange Arena", caption: "Trade, rent, and bundle titles with AI match suggestions." },
    { title: "Reseller Spotlight", caption: "Featured reseller campaigns and top-performing inventory." }
  ];

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <HeroBanner
        title="A premium marketplace for rentals, swaps, collectibles, and gaming exchanges."
        subtitle="Aggarha blends trust-first rankings, AI-ready recommendations, and an immersive dark design language built for mobile and desktop."
      >
        <div className="flex flex-wrap items-center gap-2">
          <PremiumBadge>Recommended For You</PremiumBadge>
          <Tag>AI Smart Search</Tag>
          <Tag>Nearby Around You</Tag>
          <Tag>Verified Sellers</Tag>
        </div>
        <form action="/marketplace" className="mt-4">
          <SearchBar suggestions={searchIntelligence.trendingSearches} />
        </form>
      </HeroBanner>

      <HeroAdsSlider slides={campaignSlides} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Users" value="120K+" note="More than X users across Egypt" />
        <StatsCard label="Active Users" value="38K" note="Monthly active renters and swappers" />
        <StatsCard label="Confirmed Deals" value="74K" note="Rent + swap confirmations" />
        <StatsCard label="Most Active City" value="Cairo" note="Top geo this month" />
      </section>

      <section id="featured" className="space-y-4">
        <SectionHeader
          eyebrow="Featured Listings"
          title="Curated premium inventory"
          subtitle="Featured campaigns, seasonal placements, and trusted inventory ranked for quality."
          action={<Link href={"/marketplace?sort=featured" as Route} className="text-sm font-semibold text-[#ccff00]">View all</Link>}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionHeader eyebrow="Top Rented Products" title="Verified high-demand rentals" />
          <div className="grid gap-4 sm:grid-cols-2">
            {topRented.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <SectionHeader eyebrow="Top Swapped Products" title="Trusted swap opportunities" />
          <div className="grid gap-4 sm:grid-cols-2">
            {topSwapped.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          eyebrow="Recommendation Experience"
          title="Algorithm-ready recommendation lanes"
          subtitle="Supports trust score, verification, ratings, behavior, nearby distance, seasonality, and future AI score."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(recommendedForYou.length > 0 ? recommendedForYou : newest.slice(0, 4)).map((listing) => (
            <RecommendationCard
              key={listing.id}
              title={listing.title}
              reason="Because you viewed similar listings and nearby verified owners"
              href={`/marketplace/${listing.id}`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="Nearby Around You" title="Discover inventory near your current area" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(personalizedFeed.length > 0 ? personalizedFeed : featured.slice(0, 4)).map((listing) => (
            <NearbyCard key={listing.id} title={listing.title} distance="3.2 km" mode={listing.mode} trust={listing.trustScore} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="Map Experience" title="Nearby marketplace activity map" subtitle="Aggarha-colored pins for rentals, swaps, collectibles, gaming, cameras, electronics, cars, and event equipment." />
        <MapPanel
          title="Nearby Marketplace Map"
          layers={[
            "Nearby Rentals",
            "Nearby Swaps",
            "Nearby Collectibles",
            "Nearby Gaming",
            "Nearby Cameras",
            "Nearby Electronics",
            "Nearby Cars",
            "Nearby Musical Instruments",
            "Nearby Event Equipment"
          ]}
        />
      </section>

      <section id="playstation" className="space-y-5 rounded-[2rem] border border-[#3d4d86]/35 bg-[linear-gradient(160deg,#0c1222,#081329,#0c0f1a)] p-5 sm:p-8">
        <SectionHeader
          eyebrow="PlayStation Games Exchange"
          title="A premium gaming world inside Aggarha"
          subtitle="Trending swaps, wishlist matching, collector editions, and AI match suggestions for trusted game traders."
        />
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72">
            <div className="absolute inset-0 rounded-full bg-[#58a6ff]/25 blur-3xl" />
            <div className="absolute inset-0 rounded-full bg-[#ccff00]/12 blur-2xl" />
            <div className="relative h-full w-full [animation:discFloat_6s_ease-in-out_infinite]">
              <div className="h-full w-full rounded-full border border-white/20 bg-[conic-gradient(from_120deg,#1d2a52,#0b1224,#1d2a52)] [animation:discSpin_22s_linear_infinite]" />
              <div className="absolute inset-[22%] rounded-full border border-white/25 bg-black/45" />
              <div className="absolute inset-[45%] rounded-full bg-[#ccff00]/80" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PlayStationCard title="Trending Swaps" subtitle="Verified titles optimized for quick exchange." />
            <PlayStationCard title="Most Wanted" subtitle="Wishlist placeholder for future AI demand predictions." />
            <PlayStationCard title="Limited Editions" subtitle="Collector steelbooks and rare releases." />
            <PlayStationCard title="Top Game Traders" subtitle="Ranked by trust score, completion, and reviews." />
          </div>
        </div>
      </section>

      <section id="collectibles" className="space-y-4 rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(160deg,#111111,#171717)] p-5 sm:p-8">
        <SectionHeader
          eyebrow="Collectibles Experience"
          title="Luxury museum atmosphere for rare assets"
          subtitle="Auction-house inspired discovery with AI estimated value, rarity signals, and collector reputation placeholders."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CollectibleCard title="Rare Coins" value="EGP 18,400" rarity="Very Rare" />
          <CollectibleCard title="Vintage Cameras" value="EGP 9,600" rarity="Collector Grade" />
          <CollectibleCard title="Trading Cards" value="EGP 5,250" rarity="High Demand" />
          <CollectibleCard title="Retro Consoles" value="EGP 11,100" rarity="Limited" />
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="Popular Categories" title="Each category becomes a premium world" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoryTree.slice(0, 8).map((category: (typeof categoryTree)[number]) => (
            <div key={category.id} className="rounded-3xl border border-white/[0.06] bg-[#171717] p-5 transition hover:bg-[#202020]">
              <p className="text-xs uppercase tracking-[0.12em] text-white/58">{category.children.length > 0 ? "Parent" : "Leaf"}</p>
              <p className="mt-2 text-lg font-bold text-white">{category.name}</p>
              <p className="mt-2 text-sm text-white/65">{category.description ?? "Aggarha category experience."}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/[0.06] bg-[#171717] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-white/58">Top Renters and Traders</p>
          <div className="mt-3 space-y-3">
            {topRenters.map((user) => (
              <div key={user.name} className="rounded-2xl border border-white/[0.08] bg-[#202020] p-3 text-sm text-white/74">
                <p className="font-semibold text-white">{user.name}</p>
                <p>Trust {user.trust} · Deals {user.deals} · Rating {user.rating}</p>
                <p>{user.response} response · {user.verify}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/[0.06] bg-[#171717] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-white/58">Why Aggarha</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>Trust-led ranking and verification-first visibility.</li>
            <li>AI placeholders for smart search, matching, and pricing insights.</li>
            <li>Premium experiences for rentals, swaps, collectibles, and gaming.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/[0.06] bg-[#171717] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-white/58">Trust and Safety</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>AI Trust Insights placeholder for explainable scores.</li>
            <li>AI Fraud alerts placeholder for suspicious behavior cues.</li>
            <li>Verified reviews and owner reputation emphasis.</li>
          </ul>
          <PremiumButton className="mt-4 w-full">Become a Reseller</PremiumButton>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-white/[0.06] bg-[#171717] p-5 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-white/58">Download App</p>
          <p className="mt-2 text-xl font-bold text-white">Install Aggarha as a PWA</p>
          <p className="mt-2 text-sm text-white/66">Mobile-first, offline fallback ready, and optimized for sticky bottom interactions.</p>
        </div>
        <div className="flex flex-wrap content-start gap-2 text-xs">
          {marketIntelligence.trendingCategories.slice(0, 8).map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
          {searchIntelligence.autocomplete.slice(0, 4).map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
      </section>
    </div>
  );
}
