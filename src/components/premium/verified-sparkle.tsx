import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/types";

/**
 * Aggarha's signature trust mark — "Handover": two arcs chasing each other
 * into a ring that never quite closes, drawn from scratch (not a star-rating
 * glyph, checkmark, bookmark, medal, or ribbon, and not sourced from any icon
 * library). The object goes out and comes back — the only marketplace where
 * that's literally true. Same shape everywhere; only the color changes
 * between the verified and premium tiers. Presentation-only, derived from
 * the existing verificationLevel enum — no new backend field.
 */
const PREMIUM_LEVELS = new Set(["BUSINESS_VERIFIED", "PROFESSIONAL_SELLER"]);
const VERIFIED_LEVELS = new Set(["PHONE_VERIFIED", "EMAIL_VERIFIED", "ID_VERIFIED"]);

const LABELS: Record<Locale, { verified: string; premium: string }> = {
  en: { verified: "Verified User", premium: "Premium Verified User" },
  ar: { verified: "مستخدم موثق", premium: "مستخدم موثق مميز" }
};

export function VerifiedSparkle({
  level,
  lang = "en",
  className
}: {
  level: string;
  lang?: Locale;
  className?: string;
}) {
  const normalized = level.toUpperCase();
  const isPremium = PREMIUM_LEVELS.has(normalized);
  const isVerified = VERIFIED_LEVELS.has(normalized);

  if (!isPremium && !isVerified) {
    return null;
  }

  const color = isPremium ? "#ff8a1f" : "#ccff00";
  const label = isPremium ? LABELS[lang].premium : LABELS[lang].verified;

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 translate-y-[1px] items-center align-middle transition-[filter] duration-300 ease-[var(--ease-premium)] hover:brightness-125",
        className
      )}
      style={{ filter: `drop-shadow(0 0 2.5px ${color}80)` }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 9.1A8.5 8.5 0 0 1 20 9.1" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M20 14.9A8.5 8.5 0 0 1 4 14.9" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="20" cy="9.1" r="2.5" fill={color} />
        <circle cx="4" cy="14.9" r="2.5" fill={color} />
      </svg>
    </span>
  );
}
