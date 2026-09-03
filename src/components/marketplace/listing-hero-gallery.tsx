"use client";

import { Carousel, type CarouselPhoto } from "@/components/premium/carousel";

/**
 * Mobile-first hero gallery for the full detail page — full-bleed Carousel
 * (drag/swipe, dot pager) with the category chip and favorite-heart count
 * overlaid, matching the half-sheet quick-view's gallery treatment so the two
 * entry points to a listing feel like the same product.
 */
export function ListingHeroGallery({
  photos,
  alt,
  categoryLabel,
  favoriteCount
}: {
  photos: CarouselPhoto[];
  alt: string;
  categoryLabel: string;
  favoriteCount: number;
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
      <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/80">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s-6.7-4.35-9.3-8.1C1.1 10.4 1.6 7 4.4 5.5c2.2-1.2 4.6-.5 6.1 1.2l1.5 1.7 1.5-1.7c1.5-1.7 3.9-2.4 6.1-1.2 2.8 1.5 3.3 4.9 1.7 7.4C18.7 16.65 12 21 12 21Z" />
        </svg>
        {favoriteCount}
      </span>
    </div>
  );
}
