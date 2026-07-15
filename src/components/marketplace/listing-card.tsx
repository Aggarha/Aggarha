import Image from "next/image";
import Link from "next/link";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { VerifiedSparkle } from "@/components/premium/verified-sparkle";
import {
  buildDemoImageUrl,
  buildDemoTitle,
  buildLocationLabel,
  getListingLanguage,
  isSponsoredListing
} from "@/lib/marketplace/demo-content";
import { formatPrice } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";

type ListingCardProps = {
  id: string;
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
 */
export function ListingCard(props: ListingCardProps) {
  const lang = props.lang ?? "en";
  const isRtl = lang === "ar";
  const copy = COPY[lang];

  const contentLang = getListingLanguage(props.id);
  const contentIsRtl = contentLang === "ar";
  const title = buildDemoTitle(props.id, props.categorySlug);

  const demoImage = buildDemoImageUrl(props.id, props.categorySlug);
  const isFeatured = Boolean(props.featuredBadge) && (props.visibility === "FEATURED" || props.visibility === "BOOSTED");
  const sponsored = !props.featuredBadge && isSponsoredListing(props.id, props.verificationLevel);
  const textDir = isRtl ? "rtl" : "ltr";
  const textAlign = isRtl ? "text-right" : "text-left";

  return (
    <Link
      href={`/marketplace/${props.id}` as import("next").Route}
      className="group block overflow-hidden rounded-3xl border border-white/[0.07] bg-[#171717] shadow-panel transition-all duration-300 ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-[#ccff00]/40 hover:bg-[#1b1b1b] hover:shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
    >
      <div className="relative h-72 w-full overflow-hidden bg-neutral-900 sm:h-80">
        <Image
          src={demoImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-[1.045]"
          sizes="(max-width: 1024px) 100vw, 25vw"
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
      </div>

      <div className="space-y-1 p-3.5">
        <div className={isRtl ? "flex justify-end" : "flex justify-start"}>
          <ListingModeBadge mode={props.mode} lang={lang} />
        </div>

        <h3
          dir={contentIsRtl ? "rtl" : "ltr"}
          className={`line-clamp-1 ${contentIsRtl ? "text-right" : "text-left"} text-base font-bold leading-snug text-white`}
        >
          {title}
        </h3>

        <p className="text-sm font-bold text-[#ccff00]">
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
  );
}
