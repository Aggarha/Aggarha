import Image from "next/image";
import Link from "next/link";
import { HorizontalListingRow } from "@/components/marketplace/horizontal-listing-row";
import { EmptyState } from "@/components/premium/system";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { runPlaystationIntelligence } from "@/lib/ai";
import { listingCardData } from "@/lib/marketplace/serializers";

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

export default async function PlaystationPage() {
  const [playstation, { locale, t }] = await Promise.all([runPlaystationIntelligence(), getLocaleAndDictionary()]);
  const isRtl = locale === "ar";

  const trending = dedupeById([...playstation.swapCandidates, ...playstation.rentalCandidates]);

  const groups = [
    { label: t.playstation.trendingGames, items: trending.map(listingCardData) },
    { label: t.playstation.bundles, items: playstation.gameBundles.map(listingCardData) },
    { label: t.playstation.accessories, items: playstation.accessories.map(listingCardData) },
    { label: t.playstation.featuredOffers, items: playstation.collectorEditions.map(listingCardData) }
  ];

  const totalMatched = groups.reduce((acc, group) => acc + group.items.length, 0);
  const hasResults = totalMatched > 0;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="animate-reveal-hero relative h-64 overflow-hidden rounded-[2rem] border border-white/10 sm:h-80">
        <Image
          src="/demo/products/ps-controller.jpg"
          alt="PlayStation"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-${isRtl ? "l" : "r"} from-black/92 via-black/55 to-transparent`}
        />
        <div
          className={`relative z-10 flex h-full max-w-lg flex-col justify-center gap-4 px-6 sm:px-12 ${isRtl ? "ms-auto text-right" : ""}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{t.playstation.eyebrow}</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">{t.playstation.title}</h1>
          <div className={`flex flex-wrap items-center gap-3 ${isRtl ? "justify-end" : ""}`}>
            <Link
              href="/marketplace?keyword=playstation"
              className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-[#ccff00] px-5 text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-[#deff57] hover:shadow-[0_10px_24px_rgba(204,255,0,0.22)] active:translate-y-0 active:scale-[0.97]"
            >
              {t.playstation.browseListings}
            </Link>
            <span className="bg-[#ccff00]/12 inline-flex items-center rounded-full border border-[#ccff00]/40 px-3 py-1.5 text-xs font-semibold tabular-nums text-[#ebff9d]">
              {totalMatched} {t.playstation.live}
            </span>
          </div>
        </div>
      </section>

      {!hasResults ? (
        <EmptyState
          title={t.playstation.noListingsTitle}
          description={t.playstation.noListingsDescription}
          action={
            <Link href="/marketplace" className="text-sm font-semibold text-[#ccff00] hover:text-[#deff57]">
              {t.common.browseMarketplace}
            </Link>
          }
        />
      ) : (
        groups
          .filter((group) => group.items.length > 0)
          .map((group) => (
            <HorizontalListingRow key={group.label} title={group.label} listings={group.items} lang={locale} />
          ))
      )}
    </div>
  );
}
