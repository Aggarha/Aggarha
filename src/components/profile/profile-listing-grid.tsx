import { ListingCard } from "@/components/marketplace/listing-card";
import { EmptyState } from "@/components/premium/system";
import type { ProfileListingCard } from "@/lib/profile/serializers";
import type { Locale } from "@/lib/i18n/types";

/**
 * Two columns on phones — the reference app's density, and it keeps the like
 * count and menu readable without a third column squeezing the title.
 * ListingCard already opens the Module 1 quick-view half-sheet on tap, so
 * tiles here behave exactly like tiles in the marketplace.
 */
export function ProfileListingGrid({
  listings,
  lang,
  emptyTitle,
  emptyDescription,
  emptyAction
}: {
  listings: ProfileListingCard[];
  lang: Locale;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: React.ReactNode;
}) {
  if (listings.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} {...listing} lang={lang} compact />
      ))}
    </div>
  );
}
