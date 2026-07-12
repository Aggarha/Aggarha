import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/types";

/**
 * Aggarha's signature trust mark — a custom four-point sparkle/diamond,
 * drawn from scratch (not a star-rating glyph, bookmark, medal, or ribbon,
 * and not sourced from any icon library). Same shape everywhere; only the
 * color changes between the verified and premium tiers. Presentation-only,
 * derived from the existing verificationLevel enum — no new backend field.
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
      <svg width="14" height="14" viewBox="0 0 24 24" fill={color} aria-hidden="true">
        <path d="M12 1 C12.6 7.2 14.6 9.4 23 12 C14.6 14.6 12.6 16.8 12 23 C11.4 16.8 9.4 14.6 1 12 C9.4 9.4 11.4 7.2 12 1 Z" />
      </svg>
    </span>
  );
}
