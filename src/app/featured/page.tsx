import { ListingCard } from "@/components/marketplace/listing-card";
import { EmptyState, SectionHeader, StatsCard, TextLink } from "@/components/premium/system";
import { getHomepageShowcase } from "@/lib/marketplace/query";
import { listingCardData } from "@/lib/marketplace/serializers";

export default async function FeaturedPage() {
  const showcase = await getHomepageShowcase();
  const featured = showcase.featured.map(listingCardData);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <SectionHeader
        level={1}
        eyebrow="Featured Listings"
        title="Curated premium inventory"
        subtitle="Featured campaigns, seasonal placements, and trusted inventory ranked for quality."
        action={<TextLink href="/marketplace?sort=featured">Search full marketplace</TextLink>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Featured Listings"
          value={`${featured.length}`}
          note="Currently boosted or promoted"
        />
        <StatsCard
          label="Modes"
          value="Rent + Swap"
          note="Mixed availability across featured inventory"
        />
        <StatsCard
          label="Ranking"
          value="Trust-first"
          note="Verification and trust score weighted"
        />
        <StatsCard label="Refresh" value="Live" note="Updated from current inventory" />
      </section>

      {featured.length === 0 ? (
        <EmptyState
          title="No featured listings yet"
          description="Check back soon as owners promote inventory."
          action={<TextLink href="/marketplace">Browse marketplace</TextLink>}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </section>
      )}
    </div>
  );
}
