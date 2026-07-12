/**
 * Frontend-only demo derivation for listing photo galleries and condition/damage
 * evidence. There is no schema support yet for multi-angle photos or condition
 * evidence (Listing only has a single `imageUrl` column) — see docs/DATABASE_ARCHITECTURE.md.
 * This module deterministically derives realistic-looking, per-listing-stable demo
 * data from the listing's own id, so the UI can be built and reviewed before the
 * real upload/storage feature exists.
 */

export type PhotoAngle = "main" | "front" | "back" | "left" | "right" | "closeup" | "accessories";

export type ListingPhoto = {
  angle: PhotoAngle;
  label: string;
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

const ANGLE_LABELS: Record<Exclude<PhotoAngle, "main">, string> = {
  front: "Front View",
  back: "Back View",
  left: "Left Side",
  right: "Right Side",
  closeup: "Close-up Detail",
  accessories: "Included Accessories"
};

const ANGLE_ORDER: Array<Exclude<PhotoAngle, "main">> = ["front", "back", "left", "right", "closeup", "accessories"];

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

export function buildListingGallery(listing: { id: string; imageUrl: string | null }): ListingPhoto[] {
  const main: ListingPhoto = {
    angle: "main",
    label: "Main Photo",
    url: listing.imageUrl ?? `https://picsum.photos/seed/${listing.id}-main/1200/800`
  };

  const angles = ANGLE_ORDER.map((angle) => ({
    angle,
    label: ANGLE_LABELS[angle],
    url: `https://picsum.photos/seed/${listing.id}-${angle}/1200/800`
  }));

  return [main, ...angles];
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
