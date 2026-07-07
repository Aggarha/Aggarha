import Image from "next/image";
import { notFound } from "next/navigation";
import { AvailabilityPreview } from "@/components/marketplace/availability-preview";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { ListingCard } from "@/components/marketplace/listing-card";
import {
  MapPanel,
  OwnerCard,
  PremiumBadge,
  PremiumCalendar,
  PremiumCard,
  RecommendationCard,
  ReviewCard,
  SectionHeader,
  StickyBookingCard,
  Tag,
  TooltipHint
} from "@/components/premium/system";
import {
  runCollectiblesIntelligence,
  runMatchmaking,
  runNearbyIntelligence,
  runPlaystationIntelligence,
  runPricingForListing,
  runTrustAndFraudForListing
} from "@/lib/ai";
import { formatPrice, listingStatusLabel, listingVisibilityLabel } from "@/lib/marketplace/format";
import { getListingDetails, getHomepageShowcase } from "@/lib/marketplace/query";
import { toNumber } from "@/lib/marketplace/serializers";

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [listing, showcase] = await Promise.all([getListingDetails(id), getHomepageShowcase()]);

  if (!listing) {
    notFound();
  }

  const [pricing, trustFraud, matching, nearby, playstation, collectibles] = await Promise.all([
    runPricingForListing(listing.id),
    runTrustAndFraudForListing(listing.id),
    runMatchmaking(listing.id, {
      location: {
        governorate: listing.location?.governorate,
        city: listing.location?.city
      }
    }),
    runNearbyIntelligence({
      location: {
        governorate: listing.location?.governorate,
        city: listing.location?.city
      }
    }),
    runPlaystationIntelligence([listing.title]),
    runCollectiblesIntelligence()
  ]);

  const gallery = [
    listing.imageUrl ?? "https://picsum.photos/seed/aggarha-detail-main/1200/800",
    "https://picsum.photos/seed/aggarha-detail-alt-1/1200/800",
    "https://picsum.photos/seed/aggarha-detail-alt-2/1200/800",
    "https://picsum.photos/seed/aggarha-detail-alt-3/1200/800",
    "https://picsum.photos/seed/aggarha-detail-alt-4/1200/800"
  ];

  const locationLine = listing.location
    ? `${listing.location.district ?? "District"}, ${listing.location.city}, ${listing.location.governorate}, ${listing.location.country}`
    : "Location to be confirmed";

  const averageRating = listing.reviews.length === 0 ? 0 : listing.reviews.reduce((acc, item) => acc + item.rating, 0) / listing.reviews.length;
  const reviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: listing.reviews.filter((review) => review.rating === rating).length
  }));
  const relatedListings = showcase.featured.filter((item) => item.id !== listing.id).slice(0, 4).map((item) => ({
    id: item.id,
    title: item.title
  }));
  const ownerListings = showcase.newest.filter((item) => item.id !== listing.id).slice(0, 4).map((item) => ({
    id: item.id,
    title: item.title
  }));

  const calendarDays = Array.from({ length: 14 }).map((_, index) => {
    const day = new Date();
    day.setDate(day.getDate() + index);
    const key = day.toLocaleDateString("en-US", { weekday: "short" });
    const date = day.getDate().toString();
    if (index % 6 === 0) {
      return { day: key, date, state: "reserved" as const };
    }
    if (index % 5 === 0) {
      return { day: key, date, state: "blocked" as const };
    }
    if (index % 7 === 0) {
      return { day: key, date, state: "cooldown" as const };
    }
    return { day: key, date, state: "available" as const };
  });

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="space-y-4 rounded-[2rem] border border-white/[0.08] bg-[#121212] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <ListingModeBadge mode={listing.mode} />
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/85">
              {listingStatusLabel(listing.status)}
            </span>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/85">
              {listingVisibilityLabel(listing.visibility)}
            </span>
            <PremiumBadge>AI Similar Listings</PremiumBadge>
            <PremiumBadge>AI Trust Insights</PremiumBadge>
          </div>
          <p className="text-sm text-white/70">{locationLine}</p>
        </div>
        <h1 className="text-3xl font-black text-white sm:text-4xl">{listing.title}</h1>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 md:col-span-2 md:h-[28rem]">
            <Image
              src={gallery[0]}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              unoptimized
            />
            <div className="absolute bottom-3 right-3">
              <button type="button" className="rounded-xl border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-white/85">Open Fullscreen Gallery</button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:col-span-2 md:grid-cols-2">
            {gallery.slice(1).map((item, index) => (
              <div key={item} className="relative h-32 overflow-hidden rounded-2xl border border-white/10 sm:h-48 md:h-[13.6rem]">
                <Image
                  src={item}
                  alt={`${listing.title} preview ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-5">
          <PremiumCard className="space-y-4 bg-[#171717]">
            <p className="text-sm text-white/80">{listing.description}</p>

            <div className="grid gap-2 text-sm text-white/70">
              <p>Views: {listing.viewCount}</p>
              <p>Favorites: {Math.max(18, Math.round(listing.viewCount * 0.12))}</p>
              <p>
                Min {listing.minRentalDays ?? 1} days · Max {listing.maxRentalDays ?? 30} days · Prep {listing.preparationDays ?? 0} day(s)
              </p>
              <p>Condition: Excellent · Category: {listing.category.name}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Exchange lanes</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-[#ccff00]/50 bg-[#ccff00]/15 px-3 py-1 text-[#eaff95]">Collectibles Exchange</span>
                <span className="rounded-full border border-[#ccff00]/50 bg-[#ccff00]/15 px-3 py-1 text-[#eaff95]">PlayStation Games Exchange</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/80">Rental Requests</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/80">Swap Value Placeholder</span>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="space-y-3 bg-[#171717]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Availability Calendar</p>
          <AvailabilityPreview
            dates={listing.availabilityDates.map((entry) => ({
              date: entry.date,
              status: entry.status
            }))}
          />
          <PremiumCalendar days={calendarDays} />
          <p className="text-xs text-white/55">Available · Reserved · Blocked · Owner Blocked · Cooldown · Booking Requests · Approval</p>
        </PremiumCard>

          <OwnerCard
            name={listing.owner.profile?.displayName ?? listing.owner.profile?.handle ?? "Verified Owner"}
            level={listing.owner.level}
            trust={toNumber(listing.owner.trustScore)}
            badge={listing.owner.verificationLevel}
            stats={[
              { label: "Response Rate", value: "97%" },
              { label: "Avg Response", value: "11 min" },
              { label: "Completed Rentals", value: `${listing.bookings.filter((booking) => booking.status === "COMPLETED").length}` },
              { label: "Completed Swaps", value: `${Math.max(9, Math.floor(listing.viewCount / 23))}` },
              { label: "Member Since", value: "2021" },
              { label: "Achievements", value: "Top Trader" }
            ]}
          />

          <PremiumCard className="space-y-4 bg-[#171717]">
            <SectionHeader eyebrow="Reviews" title="Professional review experience" subtitle="Overall rating, distribution, and quality dimensions for rental and swap reliability." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.08] bg-[#202020] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-white/55">Overall Rating</p>
                <p className="mt-1 text-3xl font-black text-white">{averageRating === 0 ? "N/A" : averageRating.toFixed(1)}</p>
                <p className="text-xs text-white/55">{listing.reviews.length} reviews</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-[#202020] p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.12em] text-white/55">Rating Distribution</p>
                <div className="mt-2 grid gap-2 text-xs text-white/75">
                  {reviewDistribution.map((row) => (
                    <div key={row.rating} className="flex items-center gap-2">
                      <span className="w-7">{row.rating}★</span>
                      <div className="h-2 flex-1 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-[#ccff00]" style={{ width: `${Math.min(100, row.count * 28)}%` }} />
                      </div>
                      <span>{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Tag>Communication</Tag>
              <Tag>Condition</Tag>
              <Tag>Accuracy</Tag>
              <Tag>Value</Tag>
              <Tag>Response</Tag>
              <Tag>Reliability</Tag>
              <Tag>Rental Experience</Tag>
              <Tag>Swap Experience</Tag>
              <Tag>Verified Reviews</Tag>
              <Tag>Photo Reviews</Tag>
              <Tag>Helpful Reviews</Tag>
              <Tag>Newest</Tag>
              <Tag>Oldest</Tag>
            </div>
            <div className="grid gap-2">
              {listing.reviews.length === 0 ? (
                <p className="text-sm text-white/65">No reviews yet.</p>
              ) : (
                listing.reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    author={review.reviewer.profile?.displayName ?? review.reviewer.profile?.handle ?? "Reviewer"}
                    rating={review.rating}
                    body={review.comment ?? "No comment provided."}
                    meta="Verified review"
                  />
                ))
              )}
            </div>
          </PremiumCard>

          <PremiumCard className="space-y-3 bg-[#171717]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Nearby + map preview</p>
            <div className="grid gap-2 text-sm text-white/70">
              <p>{locationLine}</p>
              <p>Nearby suggestions are ranked by trust score, mode compatibility, and availability.</p>
              <p>AI nearby pool: {nearby.rentals.length + nearby.swaps.length} candidates in your area context.</p>
            </div>
            <MapPanel
              title={`Listing map in ${listing.location?.city ?? "local area"}`}
              layers={[
                "Nearby Rentals",
                "Nearby Swaps",
                "Nearby Collectibles",
                "Nearby Gaming",
                "Nearby Cameras",
                "Nearby Electronics",
                "Nearby Cars",
                "Nearby Musical Instruments",
                "Nearby Event Equipment"
              ]}
            />
          </PremiumCard>

          <PremiumCard className="space-y-3 bg-[#171717]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">AI matching engine</p>
            <div className="grid gap-2 text-sm text-white/75">
              <p>Listing matches: {matching.listingSuggestions.length}</p>
              <p>Nearby alternatives: {matching.nearbyAlternatives.length}</p>
              <p>Potential swaps: {matching.potentialSwaps.length}</p>
            </div>
            <div className="grid gap-2 text-xs text-white/80">
              {matching.multiWaySwapIdeas.slice(0, 2).map((idea) => (
                <p key={idea} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                  {idea}
                </p>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard className="space-y-3 bg-[#171717]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Domain engines</p>
            <div className="grid gap-2 text-sm text-white/75">
              <p>PlayStation swap/rent candidates: {playstation.swapCandidates.length + playstation.rentalCandidates.length}</p>
              <p>Collectibles trend rows: {collectibles.length}</p>
            </div>
          </PremiumCard>

          <PremiumCard className="space-y-3 bg-[#171717]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Booking pipeline</p>
            <div className="grid gap-2 text-sm text-white/70">
            <p>Upcoming reservations: {listing.bookings.filter((booking) => booking.status === "APPROVED").length}</p>
            <p>Pending requests: {listing.bookings.filter((booking) => booking.status === "REQUESTED").length}</p>
            <p>Past reservations: {listing.bookings.filter((booking) => booking.status === "COMPLETED").length}</p>
            <p>Total booking history: {listing.bookings.length}</p>
          </div>
        </PremiumCard>
        </div>

        <div className="lg:sticky lg:top-24">
          <StickyBookingCard
            price={formatPrice(
              pricing?.rentalValue ?? (listing.priceAmount ? toNumber(listing.priceAmount) : null),
              listing.currencyCode ?? "EGP"
            )}
            primaryLabel="Request Booking"
            secondaryLabel="Propose Exchange"
            details={[
              `Reviews: ${listing.reviews.length}`,
              `Visibility: ${listingVisibilityLabel(listing.visibility)}`,
              `Status: ${listingStatusLabel(listing.status)}`,
              `AI swap value: ${pricing ? formatPrice(pricing.swapValue, listing.currencyCode ?? "EGP") : "N/A"}`,
              `Price confidence: ${pricing ? `${Math.round(pricing.priceConfidence * 100)}%` : "N/A"}`,
              `Demand signal: ${pricing?.demandLevel ?? "N/A"}`,
              `AI trust score: ${trustFraud?.trust.aiTrustScore ?? "N/A"}`,
              `Fraud probability: ${trustFraud ? `${Math.round(trustFraud.fraud.fraudProbability * 100)}%` : "N/A"}`
            ]}
          />
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <TooltipHint text="AI Estimated Value" />
            <TooltipHint text="AI Match" />
            <TooltipHint text="AI Nearby Suggestions" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="Related Lanes" title="Related listings, owner inventory, nearby, and recently viewed" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {relatedListings.map((item) => (
            <RecommendationCard key={item.id} title={item.title} reason="Related Listings" href={`/marketplace/${item.id}`} />
          ))}
          {ownerListings.map((item) => (
            <RecommendationCard key={item.id} title={item.title} reason="More From This Owner" href={`/marketplace/${item.id}`} />
          ))}
          {showcase.newest.slice(0, 2).map((item) => (
            <RecommendationCard key={item.id} title={item.title} reason="Recently Viewed Placeholder" href={`/marketplace/${item.id}`} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader eyebrow="Nearby Listings" title={`Nearby in ${listing.location?.city ?? "your area"}`} subtitle={`AI suggested nearby listings: ${nearby.rentals.length + nearby.swaps.length}`} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {showcase.featured.slice(0, 4).map((item) => (
            <ListingCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              mode={item.mode}
              status={item.status}
              visibility={item.visibility}
              imageUrl={item.imageUrl}
              priceAmount={item.priceAmount ? toNumber(item.priceAmount) : null}
              currencyCode={item.currencyCode}
              city={item.location?.city ?? "City"}
              governorate={item.location?.governorate ?? "Governorate"}
              trustScore={item.trustScoreSnapshot ? toNumber(item.trustScoreSnapshot) : toNumber(item.owner.trustScore)}
              level={item.ownerLevelSnapshot ?? item.owner.level}
              verificationLevel={item.owner.verificationLevel}
              viewCount={item.viewCount}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
