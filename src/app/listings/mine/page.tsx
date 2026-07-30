import type { Route } from "next";
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
    where: { ownerId: session.userId },
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
          {cards.map((listing) => (
            <ListingCard key={listing.id} {...listing} lang={locale} />
          ))}
        </section>
      )}
    </div>
  );
}
