"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Carousel } from "@/components/premium/carousel";
import { Sheet } from "@/components/premium/sheet";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { SaveButton } from "@/components/marketplace/save-button";
import { SellerMiniCard } from "@/components/marketplace/seller-mini-card";
import { buildCategoryLabel } from "@/lib/marketplace/demo-content";
import { haversineKm } from "@/lib/marketplace/geo";
import { useGeolocation } from "@/lib/marketplace/use-geolocation";
import type { Locale } from "@/lib/i18n/types";

type QuickViewData = {
  id: string;
  title: string;
  mode: "RENT" | "SWAP" | "BOTH";
  categorySlug: string;
  categoryName: string;
  photos: Array<{ id: string; url: string }>;
  favoriteCount: number;
  favorited: boolean;
  saved: boolean;
  city: string | null;
  governorate: string | null;
  latitude: number | null;
  longitude: number | null;
  conditionRating: { tier: "good" | "fair" | "undocumented"; label: string; explanation: string };
  seller: {
    id: string;
    handle: string | null;
    name: string;
    avatarUrl: string | null;
    verificationLevel: string;
    location: string | null;
  };
};

const COPY = {
  en: {
    loadError: "Couldn't load this listing.",
    retry: "Retry",
    messageHeading: (name: string) => `Message ${name}`,
    messagePlaceholder: "Hey, is this item still available?",
    startChat: (name: string) => `Start a chat with ${name}`,
    comingSoon: "Coming soon",
    viewFullDetails: "View full details",
    rent: "Rent",
    swap: "Swap",
    viewProfile: "View profile",
    like: "Like",
    save: "Save",
    unsave: "Saved",
    kmAway: (km: number) => `${km < 1 ? "<1" : km.toFixed(0)} km away`
  },
  ar: {
    loadError: "تعذر تحميل هذا الإعلان.",
    retry: "إعادة المحاولة",
    messageHeading: (name: string) => `مراسلة ${name}`,
    messagePlaceholder: "مرحبًا، هل هذا المنتج لا يزال متاحًا؟",
    startChat: (name: string) => `ابدأ محادثة مع ${name}`,
    comingSoon: "قريبًا",
    viewFullDetails: "عرض كل التفاصيل",
    rent: "إيجار",
    swap: "تبادل",
    viewProfile: "عرض الملف الشخصي",
    like: "إعجاب",
    save: "حفظ",
    unsave: "محفوظ",
    kmAway: (km: number) => `${km < 1 ? "أقل من 1" : km.toFixed(0)} كم`
  }
};

export function ListingQuickView({
  listingId,
  open,
  onClose,
  lang = "en"
}: {
  listingId: string;
  open: boolean;
  onClose: () => void;
  lang?: Locale;
}) {
  const copy = COPY[lang];
  const isRtl = lang === "ar";
  const [data, setData] = useState<QuickViewData | null>(null);
  const [error, setError] = useState(false);
  const geolocation = useGeolocation();

  const loadState: "loading" | "ready" | "error" = error ? "error" : data ? "ready" : "loading";

  useEffect(() => {
    if (!open || data || error) return;
    let cancelled = false;

    fetch(`/api/marketplace/listings/${listingId}/quick-view`)
      .then((response) => {
        if (!response.ok) throw new Error("request failed");
        return response.json();
      })
      .then((json: { data: QuickViewData }) => {
        if (!cancelled) setData(json.data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [open, listingId, data, error]);

  const retry = () => setError(false);

  useEffect(() => {
    if (open) geolocation.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- request geolocation once per open, not on every geolocation identity change
  }, [open]);

  const distanceKm =
    geolocation.position && data?.latitude != null && data?.longitude != null
      ? haversineKm(geolocation.position.lat, geolocation.position.lng, data.latitude, data.longitude)
      : null;

  const primaryAction =
    data?.mode === "RENT"
      ? { href: `/rent?listingId=${data.id}` as Route, label: copy.rent }
      : { href: `/swap-proposal?listingId=${data?.id}` as Route, label: copy.swap };

  return (
    <Sheet open={open} onClose={onClose}>
      <div dir={isRtl ? "rtl" : "ltr"} className="flex flex-col">
        {loadState === "loading" ? (
          <div className="space-y-4 p-4">
            <div className="skeleton-shimmer h-64 w-full rounded-2xl" />
            <div className="skeleton-shimmer h-16 w-full rounded-2xl" />
            <div className="skeleton-shimmer h-11 w-full rounded-2xl" />
          </div>
        ) : loadState === "error" || !data ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-sm text-white/60">{copy.loadError}</p>
            <button
              type="button"
              onClick={retry}
              className="min-h-[44px] rounded-2xl border border-white/15 px-5 text-sm font-semibold text-white"
            >
              {copy.retry}
            </button>
          </div>
        ) : (
          <>
            <div className="relative">
              <Carousel photos={data.photos} alt={data.title} className="h-64 w-full sm:h-72" priority />
              <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white/80">
                {buildCategoryLabel(data.categorySlug, data.categoryName, lang)}
              </span>
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <SaveButton
                  listingId={data.id}
                  initialActive={data.saved}
                  saveLabel={copy.save}
                  savedLabel={copy.unsave}
                />
                <FavoriteButton
                  listingId={data.id}
                  initialActive={data.favorited}
                  initialCount={data.favoriteCount}
                  label={copy.like}
                />
              </div>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <h2 className="text-lg font-bold leading-snug text-white">{data.title}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/55">
                  {[data.city, data.governorate].filter(Boolean).join(", ")}
                  {distanceKm !== null ? <span>· {copy.kmAway(distanceKm)}</span> : null}
                </p>
              </div>

              <SellerMiniCard
                name={data.seller.name}
                location={data.seller.location ?? ""}
                avatarUrl={data.seller.avatarUrl}
                verificationLevel={data.seller.verificationLevel}
                lang={lang}
                viewProfileLabel={copy.viewProfile}
                comingSoonTitle={copy.comingSoon}
                profileHandle={data.seller.handle}
              />

              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">{copy.messageHeading(data.seller.name)}</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    title={copy.comingSoon}
                    placeholder={copy.messagePlaceholder}
                    className="min-h-[44px] flex-1 rounded-2xl border border-white/12 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/35"
                  />
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title={copy.comingSoon}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ccff00]/20 text-[#ccff00]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3 11.5 21 3l-8.5 18-2.3-7.2L3 11.5Z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-white/45">{copy.startChat(data.seller.name)}</p>
              </div>

              <Link
                href={`/marketplace/${data.id}` as Route}
                className="flex min-h-[44px] items-center justify-center gap-1 text-xs font-semibold text-white/55 transition-colors duration-200 ease-[var(--ease-premium)] hover:text-white"
              >
                {copy.viewFullDetails}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Link>
            </div>

            <div className="sticky bottom-0 flex items-center gap-3 border-t border-white/[0.08] bg-[#161616] p-3">
              <button
                type="button"
                disabled
                aria-disabled="true"
                title={copy.comingSoon}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/55"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
                </svg>
              </button>
              <Link
                href={primaryAction.href}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#ccff00] text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-[#deff57] active:translate-y-0 active:scale-[0.97]"
              >
                {primaryAction.label}
              </Link>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
