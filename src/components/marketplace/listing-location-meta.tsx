"use client";

import { useEffect } from "react";
import { haversineKm } from "@/lib/marketplace/geo";
import { useGeolocation } from "@/lib/marketplace/use-geolocation";
import type { Locale } from "@/lib/i18n/types";

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
  lang = "en",
  kmAwayLabel
}: {
  locationLine: string;
  latitude: number | null;
  longitude: number | null;
  lang?: Locale;
  kmAwayLabel: (km: number) => string;
}) {
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
      {distanceKm !== null ? <span> · {kmAwayLabel(distanceKm)}</span> : null}
    </p>
  );
}
