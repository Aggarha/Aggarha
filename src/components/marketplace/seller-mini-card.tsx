import Image from "next/image";
import { VerifiedSparkle } from "@/components/premium/verified-sparkle";
import type { Locale } from "@/lib/i18n/types";

/**
 * Compact avatar + name + location + chevron, distinct from the stats-heavy
 * OwnerCard (response rate, trust score, completed rentals) used on the full
 * detail page's Owner section. This is the quick-glance identity strip for
 * the half-sheet and the full page's hero — no seller profile page exists
 * yet, so the chevron is a visual affordance only (disabled, "Coming Soon"),
 * matching the existing convention already used for the message button.
 */
export function SellerMiniCard({
  name,
  location,
  avatarUrl,
  verificationLevel,
  lang = "en",
  viewProfileLabel,
  comingSoonTitle
}: {
  name: string;
  location: string;
  avatarUrl?: string | null;
  verificationLevel: string;
  lang?: Locale;
  viewProfileLabel: string;
  comingSoonTitle: string;
}) {
  const isRtl = lang === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#191919] p-3"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#242424]">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} fill unoptimized className="object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-full w-full p-2.5 text-white/35" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor" />
          </svg>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="inline-flex items-center gap-1.5 truncate text-sm font-bold text-white">
          {name}
          <VerifiedSparkle level={verificationLevel} lang={lang} />
        </p>
        <p className="truncate text-xs text-white/55">{location}</p>
      </div>

      <button
        type="button"
        disabled
        aria-disabled="true"
        title={comingSoonTitle}
        aria-label={viewProfileLabel}
        className="flex h-11 w-11 shrink-0 items-center justify-center text-white/40"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={isRtl ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
        </svg>
      </button>
    </div>
  );
}
