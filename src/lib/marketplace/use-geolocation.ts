"use client";

import { useState } from "react";

export type GeolocationStatus = "idle" | "pending" | "granted" | "denied";

/**
 * User-triggered (never auto-prompts on mount) — call `request()` from a click
 * handler so the permission prompt only appears after deliberate intent.
 */
export function useGeolocation(options?: { onSuccess?: (position: { lat: number; lng: number }) => void }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>("idle");

  const request = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("pending");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(next);
        setStatus("granted");
        options?.onSuccess?.(next);
      },
      () => setStatus("denied"),
      { timeout: 8000 }
    );
  };

  return { position, status, request };
}
