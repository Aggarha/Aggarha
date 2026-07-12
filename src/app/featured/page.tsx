import { ListingCard } from "@/components/marketplace/listing-card";
import { EmptyState, TextLink } from "@/components/premium/system";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { getHomepageShowcase } from "@/lib/marketplace/query";
import { listingCardData } from "@/lib/marketplace/serializers";

export default async function FeaturedPage() {
  const [showcase, { locale, t }] = await Promise.all([getHomepageShowcase(), getLocaleAndDictionary()]);
  const featured = showcase.featured.map(listingCardData);
  const isRtl = locale === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">{t.featured.title}</h1>
        <TextLink href="/marketplace?sort=featured">{t.featured.browseAll}</TextLink>
      </div>

      {featured.length === 0 ? (
        <EmptyState
          title={t.featured.noFeaturedTitle}
          description={t.featured.noFeaturedDescription}
          action={<TextLink href="/marketplace">{t.common.browseMarketplace}</TextLink>}
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((listing) => (
            <ListingCard key={listing.id} {...listing} lang={locale} />
          ))}
        </section>
      )}
    </div>
  );
}
