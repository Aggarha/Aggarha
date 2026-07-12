import { CollectibleShowcaseCard } from "@/components/marketplace/collectible-showcase-card";
import { HorizontalListingRow } from "@/components/marketplace/horizontal-listing-row";
import { EmptyState, MuseumSpotlight, TextLink } from "@/components/premium/system";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { runCollectiblesIntelligence } from "@/lib/ai";
import { getHomepageShowcase } from "@/lib/marketplace/query";
import { listingCardData } from "@/lib/marketplace/serializers";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

function rarityLabel(score: number, t: Dictionary): string {
  if (score >= 80) return t.collectibles.rarity.veryRare;
  if (score >= 60) return t.collectibles.rarity.rare;
  if (score >= 40) return t.collectibles.rarity.collectorGrade;
  return t.collectibles.rarity.common;
}

export default async function CollectiblesPage() {
  const [collectibles, showcase, { locale, t }] = await Promise.all([
    runCollectiblesIntelligence(),
    getHomepageShowcase(),
    getLocaleAndDictionary()
  ]);
  const relatedListings = showcase.newest
    .filter((listing) => listing.mode !== "RENT")
    .slice(0, 8)
    .map(listingCardData);
  const spotlight = [...collectibles].sort((a, b) => b.rarityScore - a.rarityScore)[0];
  const isRtl = locale === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="animate-reveal-hero relative overflow-hidden rounded-[2rem] border border-[#d4af37]/20 bg-[linear-gradient(165deg,#12100c,#0a0908,#100e0a)] p-6 sm:p-10">
        <div className="pointer-events-none absolute left-8 top-6 h-28 w-28 rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-6 right-6 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/25 to-transparent" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">{t.collectibles.title}</h1>
          {spotlight ? (
            <MuseumSpotlight
              eyebrow={t.collectibles.spotlight}
              title={spotlight.title}
              caption={`EGP ${spotlight.estimatedValue.toLocaleString()} · ${rarityLabel(spotlight.rarityScore, t)}`}
            />
          ) : (
            <MuseumSpotlight
              eyebrow={t.collectibles.spotlight}
              title={t.collectibles.awaitingFirstPiece}
              caption={t.collectibles.rareFindsAppear}
            />
          )}
        </div>
      </section>

      {collectibles.length === 0 ? (
        <EmptyState
          title={t.collectibles.noFindsTitle}
          description={t.collectibles.noFindsDescription}
          action={<TextLink href="/marketplace">{t.common.browseMarketplace}</TextLink>}
        />
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {collectibles.map((item) => (
            <CollectibleShowcaseCard
              key={item.listingId}
              listingId={item.listingId}
              title={item.title}
              value={`EGP ${item.estimatedValue.toLocaleString()}`}
              rarity={rarityLabel(item.rarityScore, t)}
            />
          ))}
        </section>
      )}

      <HorizontalListingRow title={t.collectibles.moreToExplore} listings={relatedListings} lang={locale} />
    </div>
  );
}
