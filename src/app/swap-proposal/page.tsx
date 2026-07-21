import { notFound } from "next/navigation";
import { SwapProposalForm } from "@/components/marketplace/swap-proposal-form";
import { requireSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { prisma } from "@/lib/db";
import { toNumber } from "@/lib/marketplace/serializers";

export default async function SwapProposalPage({
  searchParams
}: {
  searchParams: Promise<{ listingId?: string }>;
}) {
  const session = await requireSession();
  const [{ locale }, { listingId }] = await Promise.all([getLocaleAndDictionary(), searchParams]);

  if (!listingId) {
    notFound();
  }

  const [targetListing, ownListings] = await Promise.all([
    prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, title: true, imageUrl: true, mode: true }
    }),
    prisma.listing.findMany({
      where: {
        ownerId: session.userId,
        id: { not: listingId },
        mode: { in: ["SWAP", "BOTH"] },
        status: "PUBLISHED"
      },
      select: { id: true, title: true, imageUrl: true, mode: true, priceAmount: true, currencyCode: true }
    })
  ]);

  if (!targetListing || !(targetListing.mode === "SWAP" || targetListing.mode === "BOTH")) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <SwapProposalForm
        lang={locale}
        targetListing={{ id: targetListing.id, title: targetListing.title, imageUrl: targetListing.imageUrl }}
        ownListings={ownListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          imageUrl: listing.imageUrl,
          mode: listing.mode,
          priceAmount: listing.priceAmount ? toNumber(listing.priceAmount) : null,
          currencyCode: listing.currencyCode ?? "EGP"
        }))}
      />
    </div>
  );
}
