import { ListingCard } from "@/components/marketplace/listing-card";
import {
  CollectibleCard,
  EmptyState,
  MuseumSpotlight,
  SectionHeader,
  TextLink
} from "@/components/premium/system";
import { runCollectiblesIntelligence } from "@/lib/ai";
import { getHomepageShowcase } from "@/lib/marketplace/query";
import { listingCardData } from "@/lib/marketplace/serializers";

function rarityLabel(score: number): string {
  if (score >= 80) return "Very Rare";
  if (score >= 60) return "Rare";
  if (score >= 40) return "Collector Grade";
  return "Common";
}

export default async function CollectiblesPage() {
  const [collectibles, showcase] = await Promise.all([
    runCollectiblesIntelligence(),
    getHomepageShowcase()
  ]);
  const relatedListings = showcase.newest
    .filter((listing) => listing.mode !== "RENT")
    .slice(0, 8)
    .map(listingCardData);
  const spotlight = [...collectibles].sort((a, b) => b.rarityScore - a.rarityScore)[0];

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="relative space-y-6 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(165deg,#0f0f0f,#151515,#101010)] p-5 sm:p-10">
        <div className="pointer-events-none absolute left-8 top-6 h-28 w-28 rounded-full bg-[#ccff00]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-6 right-6 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <SectionHeader
            level={1}
            eyebrow="Collectibles Experience"
            title="Luxury museum atmosphere for rare assets"
            subtitle="Auction-house inspired discovery with AI-estimated value, rarity signals, and collector-grade curation."
            action={
              <TextLink href="/marketplace?keyword=collector">
                Search full marketplace &rarr;
              </TextLink>
            }
          />
          {spotlight ? (
            <MuseumSpotlight
              title={spotlight.title}
              caption={`Estimated value EGP ${spotlight.estimatedValue.toLocaleString()} · ${rarityLabel(spotlight.rarityScore)}`}
            />
          ) : (
            <MuseumSpotlight
              title="Awaiting first spotlight piece"
              caption="Rare and collector-grade listings will appear here."
            />
          )}
        </div>
      </section>

      {collectibles.length === 0 ? (
        <EmptyState
          title="No collectibles intelligence yet"
          description="Check back soon as more rare inventory is listed."
          action={<TextLink href="/marketplace">Browse marketplace</TextLink>}
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {collectibles.map((item) => (
            <CollectibleCard
              key={item.listingId}
              title={item.title}
              value={`EGP ${item.estimatedValue.toLocaleString()}`}
              rarity={rarityLabel(item.rarityScore)}
            />
          ))}
        </section>
      )}

      {relatedListings.length > 0 ? (
        <section className="space-y-4">
          <SectionHeader
            eyebrow="Related Listings"
            title="Swap and collectible-friendly inventory"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
