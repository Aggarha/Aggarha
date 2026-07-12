import { NearbyExperience, type NearbyListing } from "@/components/nearby/nearby-experience";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { getHomepageShowcase } from "@/lib/marketplace/query";
import { listingCardData, toNumber } from "@/lib/marketplace/serializers";

export default async function NearbyPage() {
  const [showcase, { locale, t }] = await Promise.all([getHomepageShowcase(), getLocaleAndDictionary()]);

  const pool = [...showcase.featured, ...showcase.newest].filter(
    (listing, index, all) => all.findIndex((item) => item.id === listing.id) === index
  );

  const listings: NearbyListing[] = pool.map((listing) => ({
    ...listingCardData(listing),
    latitude: listing.location?.latitude ? toNumber(listing.location.latitude) : null,
    longitude: listing.location?.longitude ? toNumber(listing.location.longitude) : null
  }));

  const isRtl = locale === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <h1
        className={`${isRtl ? "text-right" : "text-left"} text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl`}
      >
        {t.nearby.title}
      </h1>
      <NearbyExperience listings={listings} locale={locale} nearby={t.nearby} />
    </div>
  );
}
