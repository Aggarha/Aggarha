import { BookingStatusDemo } from "@/components/bookings/booking-status-demo";
import { requireSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { prisma } from "@/lib/db";
import { toNumber } from "@/lib/marketplace/serializers";

const bookingInclude = {
  listing: {
    select: { id: true, title: true, imageUrl: true, priceAmount: true, currencyCode: true, mode: true }
  },
  offeredListings: { include: { listing: { select: { id: true, title: true } } } },
  owner: { select: { phone: true, email: true } },
  requester: { select: { phone: true, email: true } }
} as const;

function serializeBooking(booking: {
  id: string;
  status: string;
  mode: string;
  requestedAt: Date;
  totalDays: number | null;
  listing: { id: string; title: string; imageUrl: string | null; priceAmount: unknown; currencyCode: string | null; mode: string };
  offeredListings: { listing: { id: string; title: string } }[];
  owner: { phone: string | null; email: string | null };
  requester: { phone: string | null; email: string | null };
}) {
  return {
    id: booking.id,
    status: booking.status as "REQUESTED" | "APPROVED" | "REJECTED" | "CANCELED" | "COMPLETED" | "EXPIRED",
    mode: booking.mode as "RENT" | "SWAP",
    requestedAt: booking.requestedAt.toISOString(),
    totalDays: booking.totalDays,
    listing: {
      id: booking.listing.id,
      title: booking.listing.title,
      imageUrl: booking.listing.imageUrl,
      priceAmount: booking.listing.priceAmount ? toNumber(booking.listing.priceAmount) : null,
      currencyCode: booking.listing.currencyCode ?? "EGP",
      mode: booking.listing.mode as "RENT" | "SWAP" | "BOTH"
    },
    offeredListingTitles: booking.offeredListings.map((offer) => offer.listing.title),
    ownerContact: { phone: booking.owner.phone, email: booking.owner.email },
    renterContact: { phone: booking.requester.phone, email: booking.requester.email }
  };
}

export default async function BookingsPage() {
  const session = await requireSession();
  const { locale } = await getLocaleAndDictionary();

  const [renterBookings, ownerBookings] = await Promise.all([
    prisma.booking.findMany({
      where: { requesterId: session.userId },
      include: bookingInclude,
      orderBy: { requestedAt: "desc" }
    }),
    prisma.booking.findMany({
      where: { ownerId: session.userId },
      include: bookingInclude,
      orderBy: { requestedAt: "desc" }
    })
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BookingStatusDemo
        lang={locale}
        renterBookings={renterBookings.map(serializeBooking)}
        ownerBookings={ownerBookings.map(serializeBooking)}
      />
    </div>
  );
}
