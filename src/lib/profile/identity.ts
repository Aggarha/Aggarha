import type { Locale } from "@/lib/i18n/types";

/**
 * Fallback for a User row with no Profile — possible through data drift or a
 * future OAuth path that creates the account before the profile. Deliberately
 * a neutral label rather than a generated human name: a fabricated name on a
 * real account is what the profile page exists to stop showing.
 */
const MISSING_NAME: Record<Locale, string> = {
  ar: "عضو أجرها",
  en: "Aggarha member"
};

type NameSource = { displayName?: string | null } | null | undefined;

/**
 * The single owner-name resolver for every surface — cards, quick-view sheet,
 * detail page, profile page. Before this existed each surface fabricated a
 * name by hashing the owner id, so a card and the profile it linked to showed
 * two different people.
 */
export function resolveDisplayName(profile: NameSource, lang: Locale = "en"): string {
  const name = profile?.displayName?.trim();
  return name && name.length > 0 ? name : MISSING_NAME[lang];
}

/** Up to two letters for the avatar placeholder, skipping the non-name fallback. */
export function buildInitials(name: string): string {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return "?";
  }

  const letters = parts.length === 1 ? [parts[0][0]] : [parts[0][0], parts[parts.length - 1][0]];
  return letters.join("").toLocaleUpperCase();
}

/** Profiles are addressed by handle, never by user id — handles are shareable and stable. */
export function buildProfilePath(handle: string): string {
  return `/u/${encodeURIComponent(handle)}`;
}
