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
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
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

      <div className="[animation:revealUp_.9s_ease_.08s_both]">
        <HeroAdsSlider slides={campaignSlides} />
      </div>

      <section className="grid gap-4 [animation:revealUp_.9s_ease_.12s_both] sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Users" value="120K+" note="More than X users across Egypt" />
        <StatsCard label="Active Users" value="38K" note="Monthly active renters and swappers" />
        <StatsCard label="Confirmed Deals" value="74K" note="Rent + swap confirmations" />
        <StatsCard label="Most Active City" value="Cairo" note="Top geo this month" />
      </section>

      <section id="featured" className="space-y-4 [animation:revealUp_.9s_ease_.16s_both]">
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

      <section className="grid gap-6 [animation:revealUp_.9s_ease_.2s_both] lg:grid-cols-2">
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

      <section className="space-y-4 [animation:revealUp_.9s_ease_.24s_both]">
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

      <section className="space-y-4 [animation:revealUp_.9s_ease_.28s_both]">
        <SectionHeader eyebrow="Nearby Around You" title="Discover inventory near your current area" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(personalizedFeed.length > 0 ? personalizedFeed : featured.slice(0, 4)).map((listing) => (
            <NearbyCard key={listing.id} title={listing.title} distance="3.2 km" mode={listing.mode} trust={listing.trustScore} />
          ))}
        </div>
      </section>

      <section className="space-y-4 [animation:revealUp_.9s_ease_.32s_both]">
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

      <section id="playstation" className="relative space-y-6 overflow-hidden rounded-[2rem] border border-[#3d4d86]/35 bg-[linear-gradient(160deg,#080d18,#0b1630,#0a0f1d)] p-5 [animation:revealUp_.95s_ease_.36s_both] sm:p-8">
        <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-[#58a6ff]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-4 h-52 w-52 rounded-full bg-[#ccff00]/12 blur-3xl" />
        <SectionHeader
          eyebrow="PlayStation Games Exchange"
          title="A premium gaming world inside Aggarha"
          subtitle="Trending swaps, wishlist matching, collector editions, and AI match suggestions for trusted game traders."
        />
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
            <div className="absolute inset-0 rounded-full bg-[#58a6ff]/20 blur-3xl" />
            <div className="absolute inset-0 rounded-full bg-[#ccff00]/10 blur-[72px]" />
            <div className="absolute inset-4 rounded-full border border-white/10" />
            <div className="absolute inset-0 [transform:perspective(1000px)_rotateX(12deg)] [animation:discFloat_6s_ease-in-out_infinite] motion-safe:[transform-style:preserve-3d]">
              <div className="relative h-full w-full">
                <div className="h-full w-full rounded-full border border-white/25 bg-[conic-gradient(from_120deg,#243768,#0b1224,#24467a,#0e1a36,#243768)] shadow-[0_20px_80px_rgba(0,0,0,0.55)] [animation:discSpin_20s_linear_infinite]" />
                <div className="absolute inset-[17%] rounded-full border border-white/20 bg-black/50 backdrop-blur" />
                <div className="absolute inset-[43%] rounded-full bg-[#ccff00]/85 shadow-[0_0_0_10px_rgba(204,255,0,0.12)]" />
                <div className="pointer-events-none absolute -left-8 top-0 h-14 w-36 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-sm [animation:discSweep_5.8s_linear_infinite]" />
              </div>
            </div>
            <div className="pointer-events-none absolute left-[16%] top-[68%] h-1.5 w-1.5 rounded-full bg-[#ccff00]/90 [animation:particleRise_2.8s_ease-in-out_infinite]" />
            <div className="pointer-events-none absolute left-[24%] top-[74%] h-1 w-1 rounded-full bg-[#58a6ff]/90 [animation:particleRise_3.2s_ease-in-out_.4s_infinite]" />
            <div className="pointer-events-none absolute left-[63%] top-[72%] h-1.5 w-1.5 rounded-full bg-white/90 [animation:particleRise_3s_ease-in-out_.7s_infinite]" />
            <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-4 py-1 text-[11px] uppercase tracking-[0.16em] text-white/70">
              Limited Edition Exchange
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PlayStationCard title="Trending Swaps" subtitle="Verified titles optimized for quick exchange." />
            <PlayStationCard title="Most Wanted" subtitle="Wishlist placeholder for future AI demand predictions." />
            <PlayStationCard title="Limited Editions" subtitle="Collector steelbooks and rare releases." />
            <PlayStationCard title="Top Game Traders" subtitle="Ranked by trust score, completion, and reviews." />
          </div>
        </div>
      </section>

      <section id="collectibles" className="relative space-y-5 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(165deg,#0f0f0f,#151515,#101010)] p-5 [animation:revealUp_.95s_ease_.42s_both] sm:p-8">
        <div className="pointer-events-none absolute left-8 top-6 h-28 w-28 rounded-full bg-[#ccff00]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-6 right-6 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
        <SectionHeader
          eyebrow="Collectibles Experience"
          title="Luxury museum atmosphere for rare assets"
          subtitle="Auction-house inspired discovery with AI estimated value, rarity signals, and collector reputation placeholders."
        />
        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <div className="relative min-h-[16rem] overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(150deg,#151515,#0f0f0f)] p-5 sm:min-h-[20rem] sm:p-6">
            <div className="absolute left-1/2 top-5 h-10 w-32 -translate-x-1/2 rounded-full bg-white/20 blur-xl" />
            <div className="absolute left-1/2 top-10 h-[68%] w-[62%] -translate-x-1/2 rounded-[2rem] border border-white/10 bg-[linear-gradient(170deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] backdrop-blur-sm" />
            <div className="absolute bottom-[17%] left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#d5d5d5,#6d6d6d)] shadow-[0_16px_50px_rgba(0,0,0,0.55)] [animation:discFloat_6.2s_ease-in-out_infinite]" />
            <div className="absolute bottom-5 left-1/2 h-4 w-40 -translate-x-1/2 rounded-full bg-black/55 blur-md" />
            <div className="relative z-10 max-w-xs rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[#ccff00]">Museum Spotlight</p>
              <p className="mt-2 text-lg font-bold text-white">Royal Mint Coin Set</p>
              <p className="mt-1 text-sm text-white/65">Premium glass showcase with AI rarity placeholder and collector trend signal.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
            <CollectibleCard title="Rare Coins" value="EGP 18,400" rarity="Very Rare" />
            <CollectibleCard title="Vintage Cameras" value="EGP 9,600" rarity="Collector Grade" />
            <CollectibleCard title="Trading Cards" value="EGP 5,250" rarity="High Demand" />
            <CollectibleCard title="Retro Consoles" value="EGP 11,100" rarity="Limited" />
          </div>
        </div>
      </section>

      <section className="space-y-4 [animation:revealUp_.95s_ease_.46s_both]">
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

      <section className="grid gap-5 [animation:revealUp_.95s_ease_.5s_both] lg:grid-cols-3">
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

      <section className="grid gap-4 rounded-3xl border border-white/[0.06] bg-[#141414] p-5 [animation:revealUp_.95s_ease_.54s_both] sm:grid-cols-2">
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
