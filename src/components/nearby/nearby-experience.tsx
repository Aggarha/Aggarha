"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ListingCard } from "@/components/marketplace/listing-card";
import { EmptyState } from "@/components/premium/system";
import { buildDemoImageUrl, buildDemoTitle, getListingLanguage } from "@/lib/marketplace/demo-content";
import { formatPrice } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";
import type { listingCardData } from "@/lib/marketplace/serializers";

type CardListing = ReturnType<typeof listingCardData>;
export type NearbyListing = CardListing & { latitude: number | null; longitude: number | null };

type NearbyStrings = {
  useMyLocation: string;
  usingYourLocation: string;
  locating: string;
  anywhere: string;
  map: string;
  list: string;
  nothingTitle: string;
  nothingDescription: string;
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function NearbyExperience({
  listings,
  locale = "en",
  nearby
}: {
  listings: NearbyListing[];
  locale?: Locale;
  nearby: NearbyStrings;
}) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "pending" | "granted" | "denied">("idle");
  const [radiusKm, setRadiusKm] = useState<number>(Infinity);
  const [mobileView, setMobileView] = useState<"map" | "list">("list");
  const [activeId, setActiveId] = useState<string | null>(null);

  const radiusOptions: Array<{ label: string; km: number }> = [
    { label: `1 ${locale === "ar" ? "كم" : "km"}`, km: 1 },
    { label: `3 ${locale === "ar" ? "كم" : "km"}`, km: 3 },
    { label: `5 ${locale === "ar" ? "كم" : "km"}`, km: 5 },
    { label: `10 ${locale === "ar" ? "كم" : "km"}`, km: 10 },
    { label: `20 ${locale === "ar" ? "كم" : "km"}`, km: 20 },
    { label: nearby.anywhere, km: Infinity }
  ];

  const positioned = useMemo(
    () =>
      listings.filter(
        (item): item is NearbyListing & { latitude: number; longitude: number } =>
          item.latitude != null && item.longitude != null
      ),
    [listings]
  );

  const center = useMemo(() => {
    if (userPos) {
      return userPos;
    }
    if (positioned.length === 0) {
      return { lat: 30.0444, lng: 31.2357 };
    }
    return {
      lat: positioned.reduce((sum, item) => sum + item.latitude, 0) / positioned.length,
      lng: positioned.reduce((sum, item) => sum + item.longitude, 0) / positioned.length
    };
  }, [userPos, positioned]);

  const ranked = useMemo(
    () =>
      positioned
        .map((item) => ({
          ...item,
          distanceKm: haversineKm(center.lat, center.lng, item.latitude, item.longitude)
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [positioned, center]
  );

  const visible = useMemo(() => ranked.filter((item) => item.distanceKm <= radiusKm), [ranked, radiusKm]);

  const bounds = useMemo(() => {
    const points = [...visible.map((item) => ({ lat: item.latitude, lng: item.longitude })), center];
    const lats = points.map((p) => p.lat);
    const lngs = points.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const padLat = (maxLat - minLat || 0.06) * 0.25;
    const padLng = (maxLng - minLng || 0.06) * 0.25;
    return { minLat: minLat - padLat, maxLat: maxLat + padLat, minLng: minLng - padLng, maxLng: maxLng + padLng };
  }, [visible, center]);

  const project = (lat: number, lng: number) => ({
    left: `${((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 100}%`,
    top: `${100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * 100}%`
  });

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("pending");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPos({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus("granted");
        setRadiusKm(10);
      },
      () => setLocationStatus("denied"),
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={requestLocation}
          disabled={locationStatus === "pending"}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 text-xs font-semibold text-white/80 transition-all duration-200 ease-[var(--ease-premium)] hover:border-[#ccff00]/40 hover:text-white disabled:opacity-60"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {locationStatus === "granted"
            ? nearby.usingYourLocation
            : locationStatus === "pending"
              ? nearby.locating
              : nearby.useMyLocation}
        </button>

        <div className="flex flex-1 gap-1.5 overflow-x-auto">
          {radiusOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setRadiusKm(option.km)}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold tabular-nums transition-all duration-200 ease-[var(--ease-premium)] ${
                radiusKm === option.km
                  ? "border-[#ccff00]/60 bg-[#ccff00]/15 text-[#ebff9d]"
                  : "border-white/12 bg-white/[0.03] text-white/60 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="ms-auto inline-flex overflow-hidden rounded-full border border-white/12 md:hidden">
          <button
            type="button"
            onClick={() => setMobileView("map")}
            className={`px-4 py-2 text-xs font-semibold ${mobileView === "map" ? "bg-[#ccff00] text-black" : "text-white/60"}`}
          >
            {nearby.map}
          </button>
          <button
            type="button"
            onClick={() => setMobileView("list")}
            className={`px-4 py-2 text-xs font-semibold ${mobileView === "list" ? "bg-[#ccff00] text-black" : "text-white/60"}`}
          >
            {nearby.list}
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState title={nearby.nothingTitle} description={nearby.nothingDescription} />
      ) : (
        <div className="grid gap-5 md:grid-cols-[1.1fr_1fr] md:items-start">
          <div className={`${mobileView === "list" ? "block" : "hidden"} space-y-3 md:block`}>
            {visible.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                onMouseLeave={() => setActiveId(null)}
                className={`rounded-3xl transition-shadow duration-300 ${
                  activeId === item.id ? "shadow-[0_0_0_2px_rgba(204,255,0,0.5)]" : ""
                }`}
              >
                <ListingCard {...item} lang={locale} />
                <p className="mt-2 px-1 text-xs tabular-nums text-white/45">
                  {item.distanceKm.toFixed(1)} {locale === "ar" ? "كم" : "km"}
                </p>
              </div>
            ))}
          </div>

          <div
            className={`${mobileView === "map" ? "block" : "hidden"} relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(204,255,0,0.08),transparent_45%),linear-gradient(180deg,#111111,#0a0a0a)] md:sticky md:top-20 md:block`}
            onClick={() => setActiveId(null)}
          >
            <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />
            <div
              style={project(center.lat, center.lng)}
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#58a6ff] shadow-[0_0_0_6px_rgba(88,166,255,0.18)]"
            />
            {visible.map((item) => {
              const isActive = activeId === item.id;
              const href = `/marketplace/${item.id}` as Route;
              const titleIsRtl = getListingLanguage(item.id) === "ar";

              return (
                <div
                  key={item.id}
                  style={project(item.latitude, item.longitude)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  onMouseEnter={() => setActiveId(item.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  <Link
                    href={href}
                    onClick={(event) => {
                      if (!isActive) {
                        event.preventDefault();
                        event.stopPropagation();
                        setActiveId(item.id);
                      }
                    }}
                    className={`block -rotate-45 rounded-[50%_50%_50%_0] border transition-all duration-200 ease-[var(--ease-premium)] ${
                      isActive
                        ? "z-10 h-4 w-4 border-black bg-[#ccff00] shadow-[0_0_0_6px_rgba(204,255,0,0.25)]"
                        : "h-2.5 w-2.5 border-black/40 bg-[#ccff00]/80 hover:h-3.5 hover:w-3.5"
                    }`}
                  />

                  {isActive ? (
                    <Link
                      href={href}
                      onClick={(event) => event.stopPropagation()}
                      className="absolute left-1/2 top-full z-20 mt-2 w-36 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[#171717] shadow-[0_12px_28px_rgba(0,0,0,0.5)] transition-all duration-200 ease-[var(--ease-premium)] hover:border-[#ccff00]/40"
                    >
                      <div className="relative h-16 w-full">
                        <Image
                          src={buildDemoImageUrl(item.id, item.categorySlug)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="144px"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-0.5 p-2">
                        <p dir={titleIsRtl ? "rtl" : "ltr"} className="truncate text-xs font-semibold text-white">
                          {buildDemoTitle(item.id, item.categorySlug)}
                        </p>
                        <p className="text-xs font-bold text-[#ccff00]">
                          {formatPrice(item.priceAmount, item.currencyCode ?? "EGP", locale)}
                        </p>
                      </div>
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
