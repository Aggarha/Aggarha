import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilityCalendar } from "@/components/marketplace/availability-preview";
import { ConditionDamageReport } from "@/components/marketplace/condition-report";
import { ListingHeroGallery } from "@/components/marketplace/listing-hero-gallery";
import { ListingLocationMeta } from "@/components/marketplace/listing-location-meta";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { ListingCard } from "@/components/marketplace/listing-card";
import { SellerMiniCard } from "@/components/marketplace/seller-mini-card";
import { OwnerCard, PremiumCard, ReviewCard } from "@/components/premium/system";
import { runPricingForListing } from "@/lib/ai";
import { buildConditionRating, buildConditionReport, buildListingGallery } from "@/lib/marketplace/condition-evidence";
import {
  buildCategoryLabel,
  buildLocationLabel,
  isArabicText
} from "@/lib/marketplace/demo-content";
import { resolveDisplayName } from "@/lib/profile/identity";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { formatPrice } from "@/lib/marketplace/format";
import { getListingDetails, getHomepageShowcase } from "@/lib/marketplace/query";
import { toNumber } from "@/lib/marketplace/serializers";

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [listing, showcase, { locale, t }] = await Promise.all([
    getListingDetails(id),
    getHomepageShowcase(),
    getLocaleAndDictionary()
  ]);

  if (!listing) {
    notFound();
  }

  const pricing = await runPricingForListing(listing.id);
  const isRtl = locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  const gallery = buildListingGallery(listing);
  const conditionReport = buildConditionReport(listing);
  const conditionRating = buildConditionRating(conditionReport, locale);
  const ownerName = resolveDisplayName(listing.owner.profile, locale);
  const uploadDateLabel = listing.createdAt.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const title = listing.title;
  const description = listing.description;
  const titleDir = isArabicText(title) ? "rtl" : "ltr";
  const descriptionDir = isArabicText(description) ? "rtl" : "ltr";

  const locationLine = listing.location
    ? `${buildLocationLabel(listing.location.city, locale)}, ${buildLocationLabel(listing.location.governorate, locale, "governorate")}`
    : t.marketplace.locationPlaceholder;

  const averageRating =
    listing.reviews.length === 0
      ? 0
      : listing.reviews.reduce((acc, item) => acc + item.rating, 0) / listing.reviews.length;
  const reviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: listing.reviews.filter((review) => review.rating === rating).length
  }));

  const relatedListings = showcase.featured.filter((item) => item.id !== listing.id).slice(0, 4);

  const availableDaysCount = listing.availabilityDates.filter((entry) => entry.status === "AVAILABLE").length;

  const price = formatPrice(
    pricing?.rentalValue ?? (listing.priceAmount ? toNumber(listing.priceAmount) : null),
    listing.currencyCode ?? "EGP",
    locale
  );

  const canRent = listing.mode === "RENT" || listing.mode === "BOTH";
  const canSwap = listing.mode === "SWAP" || listing.mode === "BOTH";

  const categoryLabel = buildCategoryLabel(listing.category.slug, listing.category.name, locale);

  return (
    <div
      dir={dir}
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-16"
    >
      {/* Fold: gallery, title, price, condition, seller, primary actions */}
      <section className="space-y-5 rounded-[2rem] border border-white/[0.08] bg-[#121212] p-4 sm:p-6">
        <ListingHeroGallery
          photos={gallery}
          alt={title}
          categoryLabel={categoryLabel}
          favoriteCount={listing._count.favorites}
        />

        <div className="space-y-2">
          <ListingModeBadge mode={listing.mode} lang={locale} />
          <h1
            dir={titleDir}
            className={`break-words ${titleDir === "rtl" ? "text-right" : "text-left"} text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl`}
          >
            {title}
          </h1>
          <ListingLocationMeta
            locationLine={locationLine}
            latitude={listing.location?.latitude != null ? toNumber(listing.location.latitude) : null}
            longitude={listing.location?.longitude != null ? toNumber(listing.location.longitude) : null}
            lang={locale}
          />
          <p className="text-xs text-white/40">{t.listingDetail.listedOn(uploadDateLabel)}</p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/[0.08] pt-5">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-[#ccff00] sm:text-3xl">{price}</p>
            <p className="text-xs font-semibold text-white/55">
              {t.listingDetail.condition}: {conditionRating.label}
            </p>
          </div>
          <div className="hidden flex-wrap gap-2 md:flex">
            {canRent ? (
              <Link
                href={`/rent?listingId=${listing.id}` as Route}
                className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-[#ccff00] px-6 text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-[#deff57] active:translate-y-0 active:scale-[0.97]"
              >
                {t.common.rent}
              </Link>
            ) : null}
            {canSwap ? (
              <Link
                href={`/swap-proposal?listingId=${listing.id}` as Route}
                className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-6 text-sm font-bold text-white transition-all duration-200 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0 active:scale-[0.97]"
              >
                {t.common.swap}
              </Link>
            ) : null}
          </div>
        </div>

        <SellerMiniCard
          name={ownerName}
          location={locationLine}
          avatarUrl={listing.owner.profile?.avatarUrl ?? null}
          verificationLevel={listing.owner.verificationLevel}
          lang={locale}
          viewProfileLabel={t.listingDetail.viewProfile}
          comingSoonTitle={t.nav.comingSoon}
          profileHandle={listing.owner.profile?.handle ?? null}
        />
      </section>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-white">{t.listingDetail.overview}</h2>
        <PremiumCard className="space-y-3 bg-[#171717]">
          <p dir={descriptionDir} className={`text-sm text-white/80 ${descriptionDir === "rtl" ? "text-right" : "text-left"}`}>
            {description}
          </p>
          <p className="text-xs text-white/50">
            {buildCategoryLabel(listing.category.slug, listing.category.name, locale)} · {listing.minRentalDays ?? 1}–
            {listing.maxRentalDays ?? 30} {locale === "ar" ? "يوم" : "days"}
          </p>
          {listing.mode !== "RENT" && listing.swapPreferences ? (
            <p className="text-xs font-semibold text-[#ffb877]">{t.listingDetail.swapPreferences(listing.swapPreferences)}</p>
          ) : null}
        </PremiumCard>
        <ConditionDamageReport report={conditionReport} listingTitle={title} />
      </section>

      {/* Availability */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-white">{t.listingDetail.availability}</h2>
        <PremiumCard className="space-y-3 bg-[#171717]">
          <AvailabilityCalendar
            dates={listing.availabilityDates.map((entry) => ({
              date: entry.date,
              status: entry.status
            }))}
            lang={locale}
          />
          <p className="text-xs text-white/50">
            {availableDaysCount > 0 ? t.listingDetail.openDates(availableDaysCount) : t.listingDetail.checkCalendar}
          </p>
        </PremiumCard>
      </section>

      {/* Owner */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-white">{t.listingDetail.owner}</h2>
        <OwnerCard
          name={ownerName}
          level={listing.owner.level}
          trust={toNumber(listing.owner.trustScore)}
          verificationLevel={listing.owner.verificationLevel}
          lang={locale}
          stats={[
            {
              label: t.listingDetail.responseRate,
              value: `${toNumber(listing.owner.responseRate).toFixed(0)}%`
            },
            {
              label: t.listingDetail.avgResponse,
              value:
                listing.owner.responseSpeedMinutes > 0
                  ? `${listing.owner.responseSpeedMinutes} ${locale === "ar" ? "دقيقة" : "min"}`
                  : t.nav.comingSoon
            },
            {
              label: t.listingDetail.completedRentals,
              value: `${listing.bookings.filter((booking) => booking.status === "COMPLETED").length}`
            },
            { label: t.listingDetail.memberSince, value: `${listing.owner.createdAt.getFullYear()}` }
          ]}
          messageLabel={t.listingDetail.message}
          comingSoonTitle={t.nav.comingSoon}
        />
      </section>

      {/* Reviews */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-white">{t.listingDetail.reviews}</h2>
        <PremiumCard className="space-y-4 bg-[#171717]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-[#202020] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-white/55">{t.listingDetail.overallRating}</p>
              <p className="mt-1 text-3xl font-black text-white">
                {averageRating === 0 ? "N/A" : averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-white/55">{t.listingDetail.reviewsCount(listing.reviews.length)}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-[#202020] p-4 sm:col-span-2">
              <div className="grid gap-2 text-xs text-white/75">
                {reviewDistribution.map((row) => (
                  <div key={row.rating} className="flex items-center gap-2">
                    <span className="w-7 tabular-nums">{row.rating}★</span>
                    <div className="h-2 flex-1 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-[#ccff00]"
                        style={{ width: `${Math.min(100, row.count * 28)}%` }}
                      />
                    </div>
                    <span className="tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            {listing.reviews.length === 0 ? (
              <p className="text-sm text-white/65">{t.listingDetail.noReviews}</p>
            ) : (
              listing.reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  author={resolveDisplayName(review.reviewer.profile, locale)}
                  verificationLevel={review.reviewer.verificationLevel}
                  lang={locale}
                  rating={review.rating}
                  body={review.comment ?? ""}
                  meta={review.createdAt.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                />
              ))
            )}
          </div>
        </PremiumCard>
      </section>

      {/* Related Listings */}
      {relatedListings.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white">{t.listingDetail.relatedListings}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedListings.map((item) => (
              <ListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                mode={item.mode}
                status={item.status}
                visibility={item.visibility}
                imageUrl={item.imageUrl}
                categorySlug={item.category.slug}
                priceAmount={item.priceAmount ? toNumber(item.priceAmount) : null}
                currencyCode={item.currencyCode}
                city={item.location?.city ?? "City"}
                governorate={item.location?.governorate ?? "Governorate"}
                trustScore={
                  item.trustScoreSnapshot ? toNumber(item.trustScoreSnapshot) : toNumber(item.owner.trustScore)
                }
                level={item.ownerLevelSnapshot ?? item.owner.level}
                verificationLevel={item.owner.verificationLevel}
                ownerName={resolveDisplayName(item.owner.profile, locale)}
                viewCount={item.viewCount}
                lang={locale}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Sticky mobile action bar — desktop already has Rent/Swap in the fold above */}
      {canRent || canSwap ? (
        <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 mx-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#121212]/95 p-2 backdrop-blur md:hidden">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title={t.nav.comingSoon}
            aria-label={t.listingDetail.startChat}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 text-white/55"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
            </svg>
          </button>
          <Link
            href={(canSwap ? `/swap-proposal?listingId=${listing.id}` : `/rent?listingId=${listing.id}`) as Route}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#ccff00] text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-[#deff57] active:translate-y-0 active:scale-[0.97]"
          >
            {canSwap ? t.common.swap : t.common.rent}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
