import type en from "@/lib/i18n/dictionaries/en";

/** English is the source of truth for shape — every other locale must match it exactly. */
export type Dictionary = typeof en;
