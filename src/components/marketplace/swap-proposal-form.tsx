"use client";

import { useState } from "react";
import Image from "next/image";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { PremiumButton, PremiumCard, PremiumTextarea } from "@/components/premium/system";
import { buildDemoImageUrl, buildDemoTitle } from "@/lib/marketplace/demo-content";
import { formatPrice } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";

type SwapMode = "RENT" | "SWAP" | "BOTH";
type OwnListing = { id: string; categorySlug: string; mode: SwapMode; priceAmount: number | null };

const TARGET_LISTING = { id: "swap-target-1", categorySlug: "gaming-consoles" };

const OWN_LISTINGS: OwnListing[] = [
  { id: "own-listing-1", categorySlug: "photography", mode: "SWAP", priceAmount: null },
  { id: "own-listing-2", categorySlug: "camping", mode: "BOTH", priceAmount: 220 },
  { id: "own-listing-3", categorySlug: "musical-instruments", mode: "SWAP", priceAmount: null },
  { id: "own-listing-4", categorySlug: "sports", mode: "SWAP", priceAmount: null }
];

const COPY = {
  en: {
    proposeSwap: "Propose a swap",
    youWant: "The listing you want",
    yourListings: "Pick listings to offer",
    yourListingsHint: "Select one or more of your listings to exchange for this item.",
    messageLabel: "Message (optional)",
    messagePlaceholder: "Add a note for the owner about your offer...",
    send: "Send swap proposal",
    offeringCount: (n: number) => `Offering ${n} ${n === 1 ? "item" : "items"}`,
    offeringNone: "Select at least one listing to offer"
  },
  ar: {
    proposeSwap: "اقترح تبادلاً",
    youWant: "الإعلان الذي تريده",
    yourListings: "اختر إعلانات لعرضها",
    yourListingsHint: "اختر واحداً أو أكثر من إعلاناتك لتبادلها مقابل هذا المنتج.",
    messageLabel: "رسالة (اختياري)",
    messagePlaceholder: "أضف ملاحظة للمالك حول عرضك...",
    send: "إرسال عرض التبادل",
    offeringCount: (n: number) => `عرض ${n} ${n === 1 ? "عنصر" : "عناصر"}`,
    offeringNone: "اختر إعلاناً واحداً على الأقل لعرضه"
  }
};

export function SwapProposalForm({ lang = "en" }: { lang?: Locale }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const targetTitle = buildDemoTitle(TARGET_LISTING.id, TARGET_LISTING.categorySlug);

  const toggleListing = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const selectedTitles = OWN_LISTINGS.filter((listing) => selectedIds.includes(listing.id)).map((listing) =>
    buildDemoTitle(listing.id, listing.categorySlug)
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-black tracking-tight text-white">{copy.proposeSwap}</h1>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{copy.youWant}</p>
        <PremiumCard className="flex items-center gap-3 bg-[#171717]">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
            <Image
              src={buildDemoImageUrl(TARGET_LISTING.id, TARGET_LISTING.categorySlug)}
              alt={targetTitle}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="line-clamp-1 text-sm font-bold text-white">{targetTitle}</p>
            <ListingModeBadge mode="SWAP" lang={lang} />
          </div>
        </PremiumCard>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{copy.yourListings}</p>
          <p className="mt-1 text-sm text-white/55">{copy.yourListingsHint}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {OWN_LISTINGS.map((listing) => {
            const isSelected = selectedIds.includes(listing.id);
            const title = buildDemoTitle(listing.id, listing.categorySlug);

            return (
              <button
                key={listing.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleListing(listing.id)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-start transition-all duration-200 ease-[var(--ease-premium)] ${
                  isSelected
                    ? "border-[#ccff00]/55 bg-[#ccff00]/[0.06] shadow-[0_0_0_1px_rgba(204,255,0,0.35)]"
                    : "border-white/[0.08] bg-[#171717] hover:border-white/20"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ease-[var(--ease-premium)] ${
                    isSelected ? "border-[#ccff00] bg-[#ccff00] text-black" : "border-white/25 bg-transparent text-transparent"
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>

                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <Image src={buildDemoImageUrl(listing.id, listing.categorySlug)} alt={title} fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="line-clamp-1 text-sm font-semibold text-white">{title}</p>
                  <div className="flex items-center gap-2">
                    <ListingModeBadge mode={listing.mode} lang={lang} />
                    {listing.priceAmount ? (
                      <span className="text-xs font-semibold text-[#ccff00]">
                        {formatPrice(listing.priceAmount, "EGP", lang)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-white/60">{copy.messageLabel}</span>
        <PremiumTextarea rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={copy.messagePlaceholder} />
      </label>

      <div className="space-y-2">
        <p className={`text-xs font-semibold ${selectedIds.length > 0 ? "text-[#eaff95]" : "text-white/45"}`}>
          {selectedIds.length > 0 ? copy.offeringCount(selectedIds.length) : copy.offeringNone}
        </p>
        {selectedTitles.length > 0 ? (
          <p className="line-clamp-2 text-xs text-white/55">{selectedTitles.join(" · ")}</p>
        ) : null}
      </div>

      <PremiumButton type="button" tone="primary" disabled={selectedIds.length === 0} className="w-full">
        {copy.send}
      </PremiumButton>
    </div>
  );
}
