import Image from "next/image";
import { notFound } from "next/navigation";
import { AvailabilityPreview } from "@/components/marketplace/availability-preview";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { VerificationBadge } from "@/components/marketplace/verification-badge";
import { Card } from "@/components/ui/card";
import {
  runCollectiblesIntelligence,
  runMatchmaking,
  runNearbyIntelligence,
  runPlaystationIntelligence,
  runPricingForListing,
  runTrustAndFraudForListing
} from "@/lib/ai";
import { formatPrice, listingStatusLabel, listingVisibilityLabel } from "@/lib/marketplace/format";
import { getListingDetails } from "@/lib/marketplace/query";
import { toNumber } from "@/lib/marketplace/serializers";

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingDetails(id);

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

  const trustScore = (listing.trustScoreSnapshot ? toNumber(listing.trustScoreSnapshot) : toNumber(listing.owner.trustScore)).toFixed(1);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="space-y-4 rounded-3xl border border-white/10 bg-black/55 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <ListingModeBadge mode={listing.mode} />
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/85">
              {listingStatusLabel(listing.status)}
            </span>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/85">
              {listingVisibilityLabel(listing.visibility)}
            </span>
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
          <Card className="space-y-4 border-white/10 bg-black/45">
            <p className="text-sm text-white/80">{listing.description}</p>

            <div className="grid gap-2 text-sm text-white/70">
              <p>Views: {listing.viewCount}</p>
              <p>
                Min {listing.minRentalDays ?? 1} days · Max {listing.maxRentalDays ?? 30} days · Prep {listing.preparationDays ?? 0} day(s)
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Exchange lanes</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-[#ccff00]/50 bg-[#ccff00]/15 px-3 py-1 text-[#eaff95]">Collectibles Exchange</span>
                <span className="rounded-full border border-[#ccff00]/50 bg-[#ccff00]/15 px-3 py-1 text-[#eaff95]">PlayStation Games Exchange</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/80">Rental Requests</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-3 border-white/10 bg-black/45">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Availability calendar preview</p>
          <AvailabilityPreview
            dates={listing.availabilityDates.map((entry) => ({
              date: entry.date,
              status: entry.status
            }))}
          />
          <p className="text-xs text-white/55">Green: available · Amber: reserved · Gray: blocked</p>
        </Card>

          <Card className="space-y-3 border-white/10 bg-black/45">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Owner profile</p>
            <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 p-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  {listing.owner.profile?.displayName ?? listing.owner.profile?.handle ?? "Verified Owner"}
                </p>
                <p className="text-xs text-white/60">
                  Trust {toNumber(listing.owner.trustScore).toFixed(1)} · Level {listing.owner.level}
                </p>
              </div>
              <VerificationBadge level={listing.owner.verificationLevel} />
            </div>
            <div className="grid gap-2 text-sm text-white/70">
              <p>Snapshot trust at listing publish: {trustScore}</p>
              <p>Owner level snapshot: {listing.ownerLevelSnapshot ?? listing.owner.level}</p>
              <p>Verification: {listing.owner.verificationLevel}</p>
            </div>
          </Card>

          <Card className="space-y-3 border-white/10 bg-black/45">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Recent reviews</p>
            <div className="grid gap-2">
              {listing.reviews.length === 0 ? (
                <p className="text-sm text-white/65">No reviews yet.</p>
              ) : (
                listing.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white/75">
                    <p className="font-semibold text-white">
                      {review.reviewer.profile?.displayName ?? review.reviewer.profile?.handle ?? "Reviewer"} · {review.rating}/5
                    </p>
                    <p className="mt-1">{review.comment ?? "No comment provided."}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="space-y-3 border-white/10 bg-black/45">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Nearby + map preview</p>
            <div className="grid gap-2 text-sm text-white/70">
              <p>{locationLine}</p>
              <p>Nearby suggestions are ranked by trust score, mode compatibility, and availability.</p>
              <p>AI nearby pool: {nearby.rentals.length + nearby.swaps.length} candidates in your area context.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-[#ccff00]/45 bg-[#ccff00]/10 p-4 text-sm text-[#eaff95]">
              Map preview placeholder for {listing.location?.city ?? "local area"}.
            </div>
          </Card>

          <Card className="space-y-3 border-white/10 bg-black/45">
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
          </Card>

          <Card className="space-y-3 border-white/10 bg-black/45">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Domain engines</p>
            <div className="grid gap-2 text-sm text-white/75">
              <p>PlayStation swap/rent candidates: {playstation.swapCandidates.length + playstation.rentalCandidates.length}</p>
              <p>Collectibles trend rows: {collectibles.length}</p>
            </div>
          </Card>

          <Card className="space-y-3 border-white/10 bg-black/45">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Booking pipeline</p>
            <div className="grid gap-2 text-sm text-white/70">
            <p>Upcoming reservations: {listing.bookings.filter((booking) => booking.status === "APPROVED").length}</p>
            <p>Pending requests: {listing.bookings.filter((booking) => booking.status === "REQUESTED").length}</p>
            <p>Past reservations: {listing.bookings.filter((booking) => booking.status === "COMPLETED").length}</p>
            <p>Total booking history: {listing.bookings.length}</p>
          </div>
        </Card>
        </div>

        <div className="lg:sticky lg:top-24">
          <Card className="space-y-4 border-white/15 bg-neutral-950/95">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ccff00]">Book or Exchange</p>
            <p className="text-3xl font-black text-[#ccff00]">
              {formatPrice(
                pricing?.rentalValue ?? (listing.priceAmount ? toNumber(listing.priceAmount) : null),
                listing.currencyCode ?? "EGP"
              )}
            </p>
            <p className="text-sm text-white/70">Average review score: {listing.reviews.length === 0 ? "N/A" : (listing.reviews.reduce((acc, item) => acc + item.rating, 0) / listing.reviews.length).toFixed(1)} / 5</p>
            <div className="grid gap-2 text-xs text-white/65">
              <p>Reviews: {listing.reviews.length}</p>
              <p>Visibility: {listingVisibilityLabel(listing.visibility)}</p>
              <p>Status: {listingStatusLabel(listing.status)}</p>
              <p>AI swap value: {pricing ? formatPrice(pricing.swapValue, listing.currencyCode ?? "EGP") : "N/A"}</p>
              <p>Price confidence: {pricing ? `${Math.round(pricing.priceConfidence * 100)}%` : "N/A"}</p>
              <p>Demand signal: {pricing?.demandLevel ?? "N/A"}</p>
              <p>AI trust score: {trustFraud?.trust.aiTrustScore ?? "N/A"}</p>
              <p>Fraud probability: {trustFraud ? `${Math.round(trustFraud.fraud.fraudProbability * 100)}%` : "N/A"}</p>
            </div>
            <button type="button" className="w-full rounded-xl bg-[#ccff00] px-4 py-3 text-sm font-bold text-black hover:bg-[#ddff57]">
              Request Booking
            </button>
            <button type="button" className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-sm font-semibold text-white hover:border-[#ccff00]/50">
              Propose Exchange
            </button>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-black/45">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Nearby in {listing.location?.city ?? "the area"}</p>
          <p className="mt-2 text-sm text-white/70">Explore trusted alternatives in the same city and governorate for faster pickup or swap coordination.</p>
          <p className="mt-2 text-xs text-white/60">AI suggested nearby listings: {nearby.rentals.length + nearby.swaps.length}</p>
        </Card>
        <Card className="border-white/10 bg-black/45">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Premium listing quality</p>
          <p className="mt-2 text-sm text-white/70">This detail page is optimized for mobile-first browsing with sticky conversion actions on desktop.</p>
          <p className="mt-2 text-xs text-white/60">Chain swap paths discovered: {matching.chainSwapIdeas.length}</p>
        </Card>
      </section>
    </div>
  );
}
