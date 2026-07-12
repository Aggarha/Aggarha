import { ListingCard } from "@/components/marketplace/listing-card";
import { Reveal } from "@/components/premium/reveal";
import type { Locale } from "@/lib/i18n/types";
import type { listingCardData } from "@/lib/marketplace/serializers";

type CardListing = ReturnType<typeof listingCardData>;

export function HorizontalListingRow({
  title,
  listings,
  lang = "en"
}: {
  title: string;
  listings: CardListing[];
  lang?: Locale;
}) {
  if (listings.length === 0) {
    return null;
  }

  const isRtl = lang === "ar";

  return (
    <Reveal className="space-y-4">
      <h2
        dir={isRtl ? "rtl" : "ltr"}
        className={`${isRtl ? "text-right" : "text-left"} text-xl font-bold leading-snug tracking-tight text-white`}
      >
        {title}
      </h2>
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
