import type { Route } from "next";
import { ListingStatus, ListingVisibility } from "@prisma/client";
import { ListingOwnerActions } from "@/components/listings/listing-owner-actions";
import { ListingCard } from "@/components/marketplace/listing-card";
import { EmptyState, TextLink } from "@/components/premium/system";
import { requireSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { prisma } from "@/lib/db";
import { listingCardData } from "@/lib/marketplace/serializers";

export default async function MyListingsPage() {
  const session = await requireSession();
  const { locale, t } = await getLocaleAndDictionary();

  const listings = await prisma.listing.findMany({
    // Archived listings are kept only for booking history; they are gone from the owner's view.
    where: { ownerId: session.userId, status: { not: ListingStatus.ARCHIVED } },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      location: true,
      owner: {
        select: {
          id: true,
          verificationLevel: true,
          trustScore: true,
          level: true,
          profile: { select: { displayName: true } }
        }
      }
    }
  });

  const cards = listings.map(listingCardData);
  const isRtl = locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <div dir={dir} className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <h1 className="text-xl font-bold text-white">{t.myListings.title}</h1>

      {cards.length === 0 ? (
        <EmptyState
          title={t.myListings.noListingsTitle}
          description={t.myListings.noListingsDescription}
          action={<TextLink href={"/listings/new" as Route}>{t.myListings.listItem}</TextLink>}
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {cards.map((listing) => {
            const paused = listing.visibility === ListingVisibility.HIDDEN;
            return (
              <div key={listing.id} className="flex flex-col gap-2">
                <div className={paused ? "relative opacity-60" : "relative"}>
                  {paused ? (
                    <span className="absolute start-3 top-3 z-10 rounded-full border border-white/15 bg-black/75 px-2.5 py-1 text-[11px] font-bold text-white">
                      {isRtl ? "متوقف مؤقتًا" : "Paused"}
                    </span>
                  ) : null}
                  <ListingCard {...listing} lang={locale} />
                </div>
                <ListingOwnerActions listingId={listing.id} paused={paused} lang={locale} />
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
