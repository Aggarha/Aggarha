"use client";

import { useEffect } from "react";
import { haversineKm } from "@/lib/marketplace/geo";
import { useGeolocation } from "@/lib/marketplace/use-geolocation";
import type { Locale } from "@/lib/i18n/types";

// Functions can't cross the server→client boundary, so this formatter lives here
// rather than being passed down from the server-side i18n dictionary (same pattern
// as the kmAway formatter in listing-quick-view.tsx).
const COPY = {
  en: { kmAway: (km: number) => `${km < 1 ? "<1" : km.toFixed(0)} km away` },
  ar: { kmAway: (km: number) => `${km < 1 ? "أقل من 1" : km.toFixed(0)} كم` }
};

/**
 * Location line + live distance for the full detail page. Requests geolocation
 * on mount (same as the half-sheet quick-view) rather than waiting for a click
 * — a viewer already navigated to this page specifically for this listing, so
 * the extra context is worth the permission prompt.
 */
export function ListingLocationMeta({
  locationLine,
  latitude,
  longitude,
  lang = "en"
}: {
  locationLine: string;
  latitude: number | null;
  longitude: number | null;
  lang?: Locale;
}) {
  const copy = COPY[lang];
  const geolocation = useGeolocation();

  useEffect(() => {
    geolocation.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- request geolocation once on mount, not on every geolocation identity change
  }, []);

  const distanceKm =
    geolocation.position && latitude != null && longitude != null
      ? haversineKm(geolocation.position.lat, geolocation.position.lng, latitude, longitude)
      : null;

  return (
    <p dir={lang === "ar" ? "rtl" : "ltr"} className="text-sm text-white/55">
      {locationLine}
      {distanceKm !== null ? <span> · {copy.kmAway(distanceKm)}</span> : null}
    </p>
  );
}
