/**
 * Listing photo galleries come from real `ListingPhoto` rows (uploaded via R2 —
 * see src/lib/storage/r2.ts) now that Phase 0 image upload exists. Condition/damage
 * evidence is still frontend-only demo derivation: `ListingConditionMark` has no
 * photo-upload path yet, so this module keeps deterministically deriving
 * realistic-looking, per-listing-stable demo defects from the listing's own id.
 */

import type { Locale } from "@/lib/i18n/types";

export type ListingGalleryPhoto = {
  id: string;
  url: string;
};

export type DefectType = "scratch" | "dent" | "broken_part" | "missing_part" | "wear_mark" | "other";

export type DefectSeverity = "minor" | "medium" | "major";

export type ConditionEvidenceItem = {
  id: string;
  defectType: DefectType;
  defectLabel: string;
  description: string;
  severity: DefectSeverity;
  location: string;
  photoUrl: string;
};

export type ConditionStatus = "verified_no_damage" | "damage_documented" | "photos_required";

export type ConditionReport = {
  status: ConditionStatus;
  evidence: ConditionEvidenceItem[];
};

export type ConditionBadgeVariant = "verified" | "clean" | "damage" | "required";

export type ConditionBadge = {
  variant: ConditionBadgeVariant;
  label: string;
};

export type ConditionRatingTier = "good" | "fair" | "undocumented";

export type ConditionRating = {
  tier: ConditionRatingTier;
  label: string;
  explanation: string;
};

const DEFECT_LABELS: Record<DefectType, string> = {
  scratch: "Scratch",
  dent: "Dent",
  broken_part: "Broken Part",
  missing_part: "Missing Part",
  wear_mark: "Wear Mark",
  other: "Other Defect"
};

const DEFECT_DESCRIPTIONS: Record<DefectType, string> = {
  scratch: "Light surface scratch visible under direct light. Does not affect function.",
  dent: "Small dent from prior use. Cosmetic only, does not affect function.",
  broken_part: "One component is cracked or loose. Handle with care during pickup.",
  missing_part: "An original accessory or part is missing from this unit.",
  wear_mark: "Normal wear consistent with regular, careful use.",
  other: "Minor cosmetic imperfection noted for full transparency."
};

const DEFECT_LOCATIONS = [
  "Top-left corner",
  "Bottom edge",
  "Front panel",
  "Rear housing",
  "Side grip",
  "Screen or display surface",
  "Handle",
  "Base or stand",
  "Strap or attachment point",
  "Battery compartment"
];

const DEFECT_TYPES: DefectType[] = ["scratch", "dent", "broken_part", "missing_part", "wear_mark", "other"];
const SEVERITIES: DefectSeverity[] = ["minor", "medium", "major"];

/** Stable, non-cryptographic string hash so demo data is consistent across renders for the same listing. */
function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(hash, 31) + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Real photos first (main photo pinned to the front), falling back to the listing's cover image for listings with no uploaded photos yet. */
type UploadedPhoto = { id: string; url: string; isMain: boolean; sortOrder: number };

/** Main photo first, then the owner's chosen order. */
function orderPhotos(photos: UploadedPhoto[]): UploadedPhoto[] {
  return [...photos].sort((a, b) => (a.isMain === b.isMain ? a.sortOrder - b.sortOrder : a.isMain ? -1 : 1));
}

export function buildListingGallery(listing: {
  imageUrl: string | null;
  photos: UploadedPhoto[];
}): ListingGalleryPhoto[] {
  if (listing.photos.length > 0) {
    return orderPhotos(listing.photos).map((photo) => ({ id: photo.id, url: photo.url }));
  }

  return [{ id: "cover", url: listing.imageUrl ?? "/demo/products/generic.jpg" }];
}

/**
 * Cover image for a card, or null when the owner uploaded no photos — the
 * caller then keeps its own fallback (ListingCard picks a category-specific
 * demo image, which reads better than the one generic placeholder).
 */
export function buildListingCoverUrl(listing: { photos: UploadedPhoto[] }): string | null {
  return listing.photos.length > 0 ? orderPhotos(listing.photos)[0].url : null;
}

export function buildConditionReport(listing: { id: string }): ConditionReport {
  const seed = hashSeed(listing.id);
  const bucket = seed % 4;

  // ~25% of listings: owner hasn't documented condition yet.
  if (bucket === 0) {
    return { status: "photos_required", evidence: [] };
  }

  // ~25% of listings: documented, no defects found.
  if (bucket === 1) {
    return { status: "verified_no_damage", evidence: [] };
  }

  // ~50% of listings: documented with one or more defects.
  const evidenceCount = bucket === 2 ? 1 : 2 + (seed % 2);
  const evidence: ConditionEvidenceItem[] = Array.from({ length: evidenceCount }, (_, index) => {
    const localSeed = hashSeed(`${listing.id}-defect-${index}`);
    const defectType = DEFECT_TYPES[localSeed % DEFECT_TYPES.length];
    const severity = SEVERITIES[Math.floor(localSeed / DEFECT_TYPES.length) % SEVERITIES.length];
    const location = DEFECT_LOCATIONS[Math.floor(localSeed / 100) % DEFECT_LOCATIONS.length];

    return {
      id: `${listing.id}-defect-${index}`,
      defectType,
      defectLabel: DEFECT_LABELS[defectType],
      description: DEFECT_DESCRIPTIONS[defectType],
      severity,
      location,
      photoUrl: `https://picsum.photos/seed/${listing.id}-defect-${index}/800/600?grayscale`
    };
  });

  return { status: "damage_documented", evidence };
}

export function conditionBadges(report: ConditionReport): ConditionBadge[] {
  if (report.status === "photos_required") {
    return [{ variant: "required", label: "Photos Required" }];
  }
  if (report.status === "verified_no_damage") {
    return [
      { variant: "verified", label: "Condition Verified" },
      { variant: "clean", label: "No visible damage" }
    ];
  }
  return [
    { variant: "verified", label: "Condition Verified" },
    { variant: "damage", label: "Damage Documented" }
  ];
}

const CONDITION_RATING_COPY: Record<Locale, Record<ConditionRatingTier, { label: string; explanation: string }>> = {
  en: {
    good: { label: "Good", explanation: "Fully functional with no visible damage." },
    fair: {
      label: "Fair",
      explanation: "Gently used with some documented wear — see the condition evidence below."
    },
    undocumented: {
      label: "Not yet documented",
      explanation: "The owner hasn't documented this item's condition yet."
    }
  },
  ar: {
    good: { label: "جيدة", explanation: "تعمل بشكل كامل ولا يوجد بها أي ضرر ظاهر." },
    fair: {
      label: "متوسطة",
      explanation: "مستخدمة استخدامًا خفيفًا مع بعض التآكل الموثّق — راجع أدلة الحالة أدناه."
    },
    undocumented: {
      label: "غير موثقة بعد",
      explanation: "لم يوثّق المالك حالة هذا المنتج بعد."
    }
  }
};

/** Maps the badge/defect-evidence system onto a single Good/Fair/Not-yet-documented rating + one-line explanation, matching how the reference app presents condition. No schema change — same ConditionReport data, different presentation. */
export function buildConditionRating(report: ConditionReport, lang: Locale = "en"): ConditionRating {
  const tier: ConditionRatingTier =
    report.status === "verified_no_damage" ? "good" : report.status === "damage_documented" ? "fair" : "undocumented";
  const copy = CONDITION_RATING_COPY[lang][tier];
  return { tier, label: copy.label, explanation: copy.explanation };
}
