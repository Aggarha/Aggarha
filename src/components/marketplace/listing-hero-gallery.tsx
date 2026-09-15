"use client";

import { Carousel, type CarouselPhoto } from "@/components/premium/carousel";
import { FavoriteButton } from "@/components/marketplace/favorite-button";

/**
 * Mobile-first hero gallery for the full detail page — full-bleed Carousel
 * (drag/swipe, dot pager) with the category chip and the like button
 * overlaid, matching the half-sheet quick-view's gallery treatment so the two
 * entry points to a listing feel like the same product.
 */
export function ListingHeroGallery({
  photos,
  alt,
  categoryLabel,
  listingId,
  favoriteCount,
  favorited,
  favoriteLabel
}: {
  photos: CarouselPhoto[];
  alt: string;
  categoryLabel: string;
  listingId: string;
  favoriteCount: number;
  favorited: boolean;
  favoriteLabel: string;
}) {
  return (
    <div className="relative">
      <Carousel
        photos={photos}
        alt={alt}
        className="h-80 w-full rounded-[1.75rem] border border-white/10 sm:h-96 md:h-[32rem]"
        priority
      />
      <span className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/80">
        {categoryLabel}
      </span>
      <FavoriteButton
        listingId={listingId}
        initialActive={favorited}
        initialCount={favoriteCount}
        label={favoriteLabel}
        className="absolute bottom-3 right-3"
      />
    </div>
  );
}
