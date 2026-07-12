import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { HorizontalListingRow } from "@/components/marketplace/horizontal-listing-row";
import { ListingCard } from "@/components/marketplace/listing-card";
import { SponsoredBillboard } from "@/components/marketplace/sponsored-billboard";
import { Reveal } from "@/components/premium/reveal";
import {
  buildCategoryImageUrl,
  buildCategoryLabel,
  buildDemoImageUrl,
  buildDemoTitle,
  getListingLanguage,
  isSponsoredListing
} from "@/lib/marketplace/demo-content";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { getHomepageShowcase } from "@/lib/marketplace/query";
import { listingCardData } from "@/lib/marketplace/serializers";

type CardListing = ReturnType<typeof listingCardData>;

export default async function HomePage() {
  const [showcase, { locale, t }] = await Promise.all([getHomepageShowcase(), getLocaleAndDictionary()]);

  const pool = [...showcase.featured, ...showcase.newest]
    .filter((listing, index, all) => all.findIndex((item) => item.id === listing.id) === index)
    .map(listingCardData);

  const usedIds = new Set<string>();
  const take = (items: CardListing[], count: number) => {
    const picked = items.filter((item) => !usedIds.has(item.id)).slice(0, count);
    picked.forEach((item) => usedIds.add(item.id));
    return picked;
  };

  const billboardListings = take(
    [...pool]
      .filter((item) => item.verificationLevel !== "UNVERIFIED")
      .sort((a, b) => b.viewCount - a.viewCount),
    5
  );

  const billboardSlides = billboardListings.map((listing) => ({
    id: listing.id,
    title: buildDemoTitle(listing.id, listing.categorySlug),
    titleLang: getListingLanguage(listing.id),
    imageUrl: buildDemoImageUrl(listing.id, listing.categorySlug),
    city: listing.city,
    governorate: listing.governorate
  }));

  const topRented = take(
    [...pool]
      .filter((item) => item.mode === "RENT" || item.mode === "BOTH")
      .sort((a, b) => b.viewCount - a.viewCount),
    6
  );

  const topSwapped = take(
    [...pool]
      .filter((item) => item.mode === "SWAP" || item.mode === "BOTH")
      .sort((a, b) => b.viewCount - a.viewCount),
    6
  );

  const sponsoredListings = take(
    [...pool].filter((item) => isSponsoredListing(item.id, item.verificationLevel)),
    8
  );

  const categoryTiles = showcase.topCategories.slice(0, 8).map((category) => ({
    slug: category.slug,
    label: buildCategoryLabel(category.slug, category.name, locale),
    imageUrl: buildCategoryImageUrl(category.slug)
  }));

  const isRtl = locale === "ar";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <SponsoredBillboard slides={billboardSlides} lang={locale} />

      <HorizontalListingRow title={t.home.topRented} listings={topRented} lang={locale} />
      <HorizontalListingRow title={t.home.topSwapped} listings={topSwapped} lang={locale} />

      {sponsoredListings.length > 0 ? (
        <Reveal className="space-y-4">
          <h2
            dir={isRtl ? "rtl" : "ltr"}
            className={`${isRtl ? "text-right" : "text-left"} text-xl font-bold leading-snug tracking-tight text-white`}
          >
            {t.home.sponsoredListings}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sponsoredListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} lang={locale} />
            ))}
          </div>
        </Reveal>
      ) : null}

      {categoryTiles.length > 0 ? (
        <Reveal className="space-y-4">
          <h2
            dir={isRtl ? "rtl" : "ltr"}
            className={`${isRtl ? "text-right" : "text-left"} text-xl font-bold leading-snug tracking-tight text-white`}
          >
            {t.home.popularCategories}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categoryTiles.map((category) => (
              <Link
                key={category.slug}
                href={`/marketplace?category=${category.slug}` as Route}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.07] transition-all duration-300 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-[#ccff00]/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
              >
                <Image
                  src={category.imageUrl}
                  alt={category.label}
                  fill
                  className="object-cover transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                <p
                  dir={isRtl ? "rtl" : "ltr"}
                  className={`absolute inset-x-0 bottom-0 p-3 ${isRtl ? "text-right" : "text-left"} text-sm font-bold text-white`}
                >
                  {category.label}
                </p>
              </Link>
            ))}
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
