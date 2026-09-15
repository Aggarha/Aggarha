"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { ListingQuickView } from "@/components/marketplace/listing-quick-view";
import { VerifiedSparkle } from "@/components/premium/verified-sparkle";
import {
  buildDemoImageUrl,
  buildLocationLabel,
  isArabicText,
  isSponsoredListing
} from "@/lib/marketplace/demo-content";
import { formatPrice } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";

type ListingCardProps = {
  id: string;
  title: string;
  mode: "RENT" | "SWAP" | "BOTH";
  status: string;
  visibility: string;
  imageUrl: string | null;
  categorySlug: string;
  priceAmount: number | null;
  currencyCode: string | null;
  city: string;
  governorate: string;
  trustScore: number;
  level: number;
  verificationLevel: string;
  ownerName: string;
  viewCount: number;
  /** Interface language — chrome only (badges, price format, direction of UI text). Defaults to English. */
  lang?: Locale;
  /**
   * Opt-in, real signal (visibility === FEATURED/BOOSTED) — not the
   * hash-fabricated `isSponsoredListing` flag. When true, replaces the
   * Sponsored badge slot with an honest "Featured" badge for cards that
   * actually qualify. Defaults to false everywhere except /featured.
   */
  featuredBadge?: boolean;
  /**
   * Denser tile for two-column grids (profile tabs). Shortens the image and
   * tightens type so a card still reads at half the marketplace width.
   */
  compact?: boolean;
  /** Shows a heart + count over the image, as the profile grid does. */
  favoriteCount?: number;
};

const COPY = {
  ar: { sponsored: "إعلان ممول", featured: "مميز" },
  en: { sponsored: "Sponsored", featured: "Featured" }
};

/**
 * Image-first, whole-card-is-the-link — no separate CTA button. Matches
 * Airbnb/Pinterest/Facebook Marketplace card conventions rather than a
 * dashboard "row with an action button" pattern, and lets the photo occupy
 * most of the card instead of competing with a button for vertical space.
 *
 * Two independent language axes: `lang` is the INTERFACE language (badges,
 * price formatting, chrome direction) and defaults to English. The listing's
 * own title always renders in its own content language — a fixed property
 * of the listing, unaffected by which interface language is selected.
 *
 * A plain tap/click opens the quick-view half-sheet instead of navigating —
 * matches the reference app, where the card is a preview trigger and the
 * full page is one deliberate step further ("View full details" inside the
 * sheet). The href is still real underneath, so ctrl/cmd/middle-click and
 * "open in new tab" keep working exactly like a normal link — only an
 * unmodified primary-button click is intercepted.
 */
export function ListingCard(props: ListingCardProps) {
  const lang = props.lang ?? "en";
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const title = props.title;
  const contentIsRtl = isArabicText(title);

  const image = props.imageUrl ?? buildDemoImageUrl(props.id, props.categorySlug);
  const isFeatured = Boolean(props.featuredBadge) && (props.visibility === "FEATURED" || props.visibility === "BOOSTED");
  const sponsored = !props.featuredBadge && isSponsoredListing(props.id, props.verificationLevel);
  const textDir = isRtl ? "rtl" : "ltr";
  const textAlign = isRtl ? "text-right" : "text-left";
  const compact = Boolean(props.compact);
  const imageHeightClass = compact ? "h-44 sm:h-52" : "h-72 sm:h-80";
  const bodyClass = compact ? "space-y-1 p-2.5" : "space-y-1 p-3.5";
  const titleClass = compact ? "text-sm" : "text-base";
  const priceClass = compact ? "text-[13px]" : "text-sm";

  return (
    <>
      <Link
        href={`/marketplace/${props.id}` as import("next").Route}
        onClick={(event) => {
          if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
            return;
          }
          event.preventDefault();
          setQuickViewOpen(true);
        }}
        className="group block overflow-hidden rounded-3xl border border-white/[0.07] bg-[#171717] shadow-panel transition-all duration-300 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-[#ccff00]/40 hover:bg-[#1b1b1b] hover:shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
      >
        <div className={`relative w-full overflow-hidden bg-neutral-900 ${imageHeightClass}`}>
          <Image
            src={image}
            alt={title}
            fill
            unoptimized={props.imageUrl !== null}
            className="object-cover transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-[1.045]"
            sizes={compact ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" : "(max-width: 1024px) 100vw, 25vw"}
          />
          {isFeatured ? (
            <div className="absolute right-3 top-3">
              <span
                dir={textDir}
                className="inline-flex items-center gap-1 rounded-full border border-[#ccff00]/50 bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-[#ccff00]"
              >
                {copy.featured}
              </span>
            </div>
          ) : sponsored ? (
            <div className="absolute right-3 top-3">
              <span
                dir={textDir}
                className="inline-flex items-center gap-1 rounded-full border border-[#ffd27a]/45 bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-[#ffd27a]"
              >
                {copy.sponsored}
              </span>
            </div>
          ) : null}
          {typeof props.favoriteCount === "number" ? (
            <span className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white/85">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21s-6.7-4.35-9.3-8.1C1.1 10.4 1.6 7 4.4 5.5c2.2-1.2 4.6-.5 6.1 1.2l1.5 1.7 1.5-1.7c1.5-1.7 3.9-2.4 6.1-1.2 2.8 1.5 3.3 4.9 1.7 7.4C18.7 16.65 12 21 12 21Z" />
              </svg>
              <span className="tabular-nums">{props.favoriteCount}</span>
            </span>
          ) : null}
        </div>

        <div className={bodyClass}>
          <div className={isRtl ? "flex justify-end" : "flex justify-start"}>
            <ListingModeBadge mode={props.mode} lang={lang} />
          </div>

          <h3
            dir={contentIsRtl ? "rtl" : "ltr"}
            className={`line-clamp-1 ${contentIsRtl ? "text-right" : "text-left"} ${titleClass} font-bold leading-snug text-white`}
          >
            {title}
          </h3>

          <p className={`${priceClass} font-bold text-[#ccff00]`}>
            {formatPrice(props.priceAmount, props.currencyCode ?? "EGP", lang)}
          </p>

          <p dir={textDir} className={`${textAlign} flex items-center gap-1 text-xs text-white/50`}>
            <span className="truncate">
              {buildLocationLabel(props.city, lang)}, {buildLocationLabel(props.governorate, lang, "governorate")} ·{" "}
              {props.ownerName}
            </span>
            <VerifiedSparkle level={props.verificationLevel} lang={lang} className="shrink-0" />
          </p>
        </div>
      </Link>
      <ListingQuickView listingId={props.id} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} lang={lang} />
    </>
  );
}
