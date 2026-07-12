import type { Route } from "next";
import Link from "next/link";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Reveal } from "@/components/premium/reveal";
import type { Locale } from "@/lib/i18n/types";
import type { listingCardData } from "@/lib/marketplace/serializers";

type CardListing = ReturnType<typeof listingCardData>;

const COPY = {
  en: { seeAll: "See All" },
  ar: { seeAll: "عرض الكل" }
};

function ChevronIcon({ isRtl }: { isRtl: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={isRtl ? "scale-x-[-1]" : undefined}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function HorizontalListingRow({
  title,
  listings,
  lang = "en",
  seeAllHref
}: {
  title: string;
  listings: CardListing[];
  lang?: Locale;
  seeAllHref?: Route | string;
}) {
  if (listings.length === 0) {
    return null;
  }

  const isRtl = lang === "ar";
  const copy = COPY[lang];

  return (
    <Reveal className="space-y-4">
      <div dir={isRtl ? "rtl" : "ltr"} className="flex items-baseline justify-between gap-3">
        <h2 className={`${isRtl ? "text-right" : "text-left"} text-xl font-bold leading-snug tracking-tight text-white`}>
          {title}
        </h2>
        {seeAllHref ? (
          <Link
            href={seeAllHref as Route}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#ccff00] transition-colors duration-200 ease-[var(--ease-premium)] hover:text-[#deff57]"
          >
            {copy.seeAll}
            <ChevronIcon isRtl={isRtl} />
          </Link>
        ) : null}
      </div>
      <div className="flex snap-x gap-4 overflow-x-auto pb-2">
        {listings.map((listing) => (
          <div key={listing.id} className="w-64 shrink-0 snap-start sm:w-72">
            <ListingCard {...listing} lang={lang} />
          </div>
        ))}
      </div>
    </Reveal>
  );
}
