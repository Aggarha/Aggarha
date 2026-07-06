import type { ListingMode, ListingStatus, ListingVisibility, VerificationLevel } from "@prisma/client";

export function formatPrice(amount: number | null | undefined, currencyCode = "EGP") {
  if (amount === null || amount === undefined) {
    return "Contact owner";
  }

  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(amount);
}

export function modeLabel(mode: ListingMode): string {
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
