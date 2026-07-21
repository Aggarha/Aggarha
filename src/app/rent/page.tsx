import { notFound } from "next/navigation";
import { RentRequestForm } from "@/components/marketplace/rent-request-form";
import { requireSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { prisma } from "@/lib/db";
import { toNumber } from "@/lib/marketplace/serializers";

export default async function RentPage({
  searchParams
}: {
  searchParams: Promise<{ listingId?: string }>;
}) {
  await requireSession();
  const [{ locale }, { listingId }] = await Promise.all([getLocaleAndDictionary(), searchParams]);

  if (!listingId) {
    notFound();
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      priceAmount: true,
      currencyCode: true,
      mode: true,
      minRentalDays: true,
      maxRentalDays: true
    }
  });

  if (!listing || !(listing.mode === "RENT" || listing.mode === "BOTH")) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <RentRequestForm
        listingId={listing.id}
        title={listing.title}
        imageUrl={listing.imageUrl}
        priceAmount={listing.priceAmount ? toNumber(listing.priceAmount) : null}
        currencyCode={listing.currencyCode ?? "EGP"}
        lang={locale}
      />
    </div>
  );
}
