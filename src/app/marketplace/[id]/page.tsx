import Image from "next/image";
import { notFound } from "next/navigation";
import { AvailabilityPreview } from "@/components/marketplace/availability-preview";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { VerificationBadge } from "@/components/marketplace/verification-badge";
import { Card } from "@/components/ui/card";
import { formatPrice, listingStatusLabel, listingVisibilityLabel } from "@/lib/marketplace/format";
import { getListingDetails } from "@/lib/marketplace/query";
import { toNumber } from "@/lib/marketplace/serializers";

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingDetails(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden p-0">
          <div className="relative h-72 w-full sm:h-96">
            <Image
              src={listing.imageUrl ?? "https://picsum.photos/seed/aggarha-detail/1200/800"}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <ListingModeBadge mode={listing.mode} />
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {listingStatusLabel(listing.status)}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {listingVisibilityLabel(listing.visibility)}
            </span>
          </div>

          <h1 className="text-3xl font-black text-ink">{listing.title}</h1>
          <p className="text-sm text-slate-600">{listing.description}</p>

          <p className="text-2xl font-bold text-slate-900">
            {formatPrice(listing.priceAmount ? toNumber(listing.priceAmount) : null, listing.currencyCode ?? "EGP")}
          </p>

          <div className="grid gap-2 text-sm text-slate-600">
            <p>
              {listing.location
                ? `${listing.location.district ?? "District"}, ${listing.location.city}, ${listing.location.governorate}, ${listing.location.country}`
                : "Location to be confirmed"}
            </p>
            <p>Views: {listing.viewCount}</p>
            <p>
              Min {listing.minRentalDays ?? 1} days · Max {listing.maxRentalDays ?? 30} days · Prep {listing.preparationDays ?? 0} day(s)
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {listing.owner.profile?.displayName ?? listing.owner.profile?.handle ?? "Verified Owner"}
              </p>
              <p className="text-xs text-slate-500">
                Trust {toNumber(listing.owner.trustScore).toFixed(1)} · Level {listing.owner.level}
              </p>
            </div>
            <VerificationBadge level={listing.owner.verificationLevel} />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Availability calendar preview</p>
          <AvailabilityPreview
            dates={listing.availabilityDates.map((entry) => ({
              date: entry.date,
              status: entry.status
            }))}
          />
          <p className="text-xs text-slate-500">Green: available · Amber: reserved · Gray: blocked</p>
        </Card>

        <Card className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Booking pipeline</p>
          <div className="grid gap-2 text-sm text-slate-600">
            <p>Upcoming reservations: {listing.bookings.filter((booking) => booking.status === "APPROVED").length}</p>
            <p>Pending requests: {listing.bookings.filter((booking) => booking.status === "REQUESTED").length}</p>
            <p>Past reservations: {listing.bookings.filter((booking) => booking.status === "COMPLETED").length}</p>
            <p>Total booking history: {listing.bookings.length}</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Trust score preview</p>
          <div className="grid gap-2 text-sm text-slate-600">
            <p>Trust score snapshot: {(listing.trustScoreSnapshot ? toNumber(listing.trustScoreSnapshot) : toNumber(listing.owner.trustScore)).toFixed(1)}</p>
            <p>Owner level snapshot: {listing.ownerLevelSnapshot ?? listing.owner.level}</p>
            <p>Verification: {listing.owner.verificationLevel}</p>
            <p>Reviews: {listing.reviews.length}</p>
          </div>
        </Card>

        <Card className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Recent reviews</p>
          <div className="grid gap-2">
            {listing.reviews.length === 0 ? (
              <p className="text-sm text-slate-500">No reviews yet.</p>
            ) : (
              listing.reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">
                    {review.reviewer.profile?.displayName ?? review.reviewer.profile?.handle ?? "Reviewer"} · {review.rating}/5
                  </p>
                  <p className="mt-1">{review.comment ?? "No comment provided."}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
