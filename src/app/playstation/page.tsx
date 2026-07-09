import { ListingCard } from "@/components/marketplace/listing-card";
import {
  EmptyState,
  PlayStationCard,
  PlaystationDisc,
  SectionHeader,
  Tag,
  TextLink
} from "@/components/premium/system";
import { runPlaystationIntelligence } from "@/lib/ai";
import { listingCardData } from "@/lib/marketplace/serializers";

export default async function PlaystationPage() {
  const playstation = await runPlaystationIntelligence();

  const groups = [
    { label: "Trending Swaps", items: playstation.swapCandidates },
    { label: "Rental Candidates", items: playstation.rentalCandidates },
    { label: "Collector Editions", items: playstation.collectorEditions },
    { label: "Game Bundles", items: playstation.gameBundles },
    { label: "Accessories", items: playstation.accessories }
  ];

  const totalMatched = groups.reduce((acc, group) => acc + group.items.length, 0);
  const hasResults = totalMatched > 0;

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="relative space-y-8 overflow-hidden rounded-[2rem] border border-[#3d4d86]/35 bg-[linear-gradient(160deg,#080d18,#0b1630,#0a0f1d)] p-5 sm:p-10">
        <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-[#58a6ff]/20 blur-3xl" />
        <div className="bg-[#ccff00]/12 pointer-events-none absolute -right-16 bottom-4 h-52 w-52 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <SectionHeader
              level={1}
              eyebrow="PlayStation Games Exchange"
              title="A premium gaming world inside Aggarha"
              subtitle="Trending swaps, wishlist matching, collector editions, and AI match suggestions for trusted game traders."
            />
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#ccff00]/12 rounded-full border border-[#ccff00]/40 px-3 py-1 text-xs font-semibold text-[#ebff9d]">
                {totalMatched} live matches
              </span>
              <TextLink href="/marketplace?keyword=playstation">
                Search full marketplace &rarr;
              </TextLink>
            </div>
            <div className="flex flex-wrap gap-2">
              {playstation.futureReleaseRecommendations.map((tip) => (
                <Tag key={tip}>{tip}</Tag>
              ))}
            </div>
          </div>
          <PlaystationDisc caption="Trade · Rent · Collect" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {groups.map((group) => (
            <PlayStationCard
              key={group.label}
              title={group.label}
              subtitle={`${group.items.length} listings matched`}
            />
          ))}
        </div>
      </section>

      {!hasResults ? (
        <EmptyState
          title="No PlayStation listings yet"
          description="Check back soon as more traders list titles and bundles."
          action={<TextLink href="/marketplace">Browse marketplace</TextLink>}
        />
      ) : (
        groups
          .filter((group) => group.items.length > 0)
          .map((group) => (
            <section key={group.label} className="space-y-4">
              <SectionHeader eyebrow="PlayStation Exchange" title={group.label} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {group.items.map((listing) => (
                  <ListingCard key={listing.id} {...listingCardData(listing)} />
                ))}
              </div>
            </section>
          ))
      )}
    </div>
  );
}
