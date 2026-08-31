/**
 * Listing photo galleries come from real `ListingPhoto` rows (uploaded via R2 —
 * see src/lib/storage/r2.ts) now that Phase 0 image upload exists. Condition/damage
 * evidence is still frontend-only demo derivation: `ListingConditionMark` has no
 * photo-upload path yet, so this module keeps deterministically deriving
 * realistic-looking, per-listing-stable demo defects from the listing's own id.
 */

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
export function buildListingGallery(listing: {
  imageUrl: string | null;
  photos: Array<{ id: string; url: string; isMain: boolean; sortOrder: number }>;
}): ListingGalleryPhoto[] {
  if (listing.photos.length > 0) {
    return [...listing.photos]
      .sort((a, b) => (a.isMain === b.isMain ? a.sortOrder - b.sortOrder : a.isMain ? -1 : 1))
      .map((photo) => ({ id: photo.id, url: photo.url }));
  }

  return [{ id: "cover", url: listing.imageUrl ?? "/demo/products/generic.jpg" }];
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
