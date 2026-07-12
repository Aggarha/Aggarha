import type { ListingMode, ListingStatus, ListingVisibility, VerificationLevel } from "@prisma/client";
import type { Locale } from "@/lib/i18n/types";

export function formatPrice(amount: number | null | undefined, currencyCode = "EGP", locale: Locale = "en") {
  if (amount === null || amount === undefined) {
    return locale === "ar" ? "تواصل مع المالك" : "Contact owner";
  }

  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(amount);
}

export function modeLabel(mode: ListingMode, locale: Locale = "en"): string {
  if (locale === "ar") {
    if (mode === "RENT") return "إيجار";
    if (mode === "SWAP") return "تبديل";
    return "إيجار + تبديل";
  }

  if (mode === "RENT") {
    return "Rent";
  }
  if (mode === "SWAP") {
    return "Swap";
  }
  return "Rent + Swap";
}

export function listingStatusLabel(status: ListingStatus): string {
  return status
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function listingVisibilityLabel(visibility: ListingVisibility): string {
  return visibility
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function verificationLabel(level: VerificationLevel): string {
  return level
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
