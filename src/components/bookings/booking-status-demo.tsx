"use client";

import { useState } from "react";
import Image from "next/image";
import { BookingStatusTimeline, type BookingStatus } from "@/components/bookings/booking-status-timeline";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { PremiumButton, PremiumCard } from "@/components/premium/system";
import { buildDemoImageUrl, buildDemoTitle } from "@/lib/marketplace/demo-content";
import { formatPrice } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";

type BookingView = "renter" | "owner";

const DEMO_LISTING = { id: "booking-demo-1", categorySlug: "photography", priceAmount: 350 };

const COPY = {
  en: {
    renterView: "Renter view",
    ownerView: "Owner view",
    tabs: { sent: "Sent", pending: "Pending", accepted: "Accepted", declined: "Declined" } as Record<BookingStatus, string>,
    timeline: { requestSent: "Request sent", reviewing: "Owner reviewing", accepted: "Accepted", declined: "Declined" },
    timelineOwner: { requestSent: "Request received", reviewing: "Reviewing", accepted: "Accepted", declined: "Declined" },
    sentNote: "We'll notify you as soon as the owner responds.",
    sentNoteOwner: "A new request just came in — review it below.",
    messageOwner: "Message owner",
    messageRenter: "Message renter",
    cancel: "Cancel request",
    accept: "Accept request",
    decline: "Decline request",
    viewBooking: "View booking details",
    browseSimilar: "Browse similar listings",
    sendNewRequest: "Send new request",
    days: "3 days",
    from: "From"
  },
  ar: {
    renterView: "عرض المستأجر",
    ownerView: "عرض المالك",
    tabs: { sent: "تم الإرسال", pending: "قيد الانتظار", accepted: "مقبول", declined: "مرفوض" } as Record<BookingStatus, string>,
    timeline: { requestSent: "تم إرسال الطلب", reviewing: "المالك يراجع", accepted: "مقبول", declined: "مرفوض" },
    timelineOwner: { requestSent: "تم استلام الطلب", reviewing: "قيد المراجعة", accepted: "مقبول", declined: "مرفوض" },
    sentNote: "سنخبرك فور رد المالك.",
    sentNoteOwner: "وصل طلب جديد — راجعه أدناه.",
    messageOwner: "مراسلة المالك",
    messageRenter: "مراسلة المستأجر",
    cancel: "إلغاء الطلب",
    accept: "قبول الطلب",
    decline: "رفض الطلب",
    viewBooking: "عرض تفاصيل الحجز",
    browseSimilar: "تصفح إعلانات مشابهة",
    sendNewRequest: "إرسال طلب جديد",
    days: "3 أيام",
    from: "من"
  }
};

function ListingSummary({ lang = "en" }: { lang?: Locale }) {
  const title = buildDemoTitle(DEMO_LISTING.id, DEMO_LISTING.categorySlug);
  const copy = COPY[lang];

  return (
    <div className="flex gap-3 rounded-2xl border border-white/[0.08] bg-[#141414] p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
        <Image src={buildDemoImageUrl(DEMO_LISTING.id, DEMO_LISTING.categorySlug)} alt={title} fill className="object-cover" sizes="80px" />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="line-clamp-1 text-sm font-bold text-white">{title}</p>
        <p className="text-sm font-bold text-[#ccff00]">{formatPrice(DEMO_LISTING.priceAmount, "EGP", lang)} · {copy.days}</p>
        <ListingModeBadge mode="RENT" lang={lang} />
      </div>
    </div>
  );
}

export function BookingStatusDemo({ lang = "en" }: { lang?: Locale }) {
  const [view, setView] = useState<BookingView>("renter");
  const [status, setStatus] = useState<BookingStatus>("pending");
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const statuses: BookingStatus[] = ["sent", "pending", "accepted", "declined"];
  const timelineCopy = view === "renter" ? copy.timeline : copy.timelineOwner;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-5">
      <div className="inline-flex overflow-hidden rounded-full border border-white/12">
        <button
          type="button"
          onClick={() => setView("renter")}
          className={`px-4 py-2 text-xs font-semibold transition-colors duration-200 ease-[var(--ease-premium)] ${
            view === "renter" ? "bg-[#ccff00] text-black" : "text-white/60 hover:text-white"
          }`}
        >
          {copy.renterView}
        </button>
        <button
          type="button"
          onClick={() => setView("owner")}
          className={`px-4 py-2 text-xs font-semibold transition-colors duration-200 ease-[var(--ease-premium)] ${
            view === "owner" ? "bg-[#ccff00] text-black" : "text-white/60 hover:text-white"
          }`}
        >
          {copy.ownerView}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${
              status === item
                ? "border-[#ccff00]/55 bg-[#ccff00]/14 text-[#eaff95]"
                : "border-white/12 bg-white/[0.03] text-white/55 hover:text-white/85"
            }`}
          >
            {copy.tabs[item]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PremiumCard className="space-y-4 bg-[#171717]">
          <ListingSummary lang={lang} />
        </PremiumCard>

        <PremiumCard className="space-y-4 bg-[#171717]">
          <BookingStatusTimeline status={status} t={timelineCopy} />

          {status === "sent" ? <p className="text-xs text-white/50">{view === "renter" ? copy.sentNote : copy.sentNoteOwner}</p> : null}

          <div className="flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
            {view === "renter" ? (
              <>
                {(status === "sent" || status === "pending") ? (
                  <>
                    <PremiumButton tone="secondary" type="button">
                      {copy.messageOwner}
                    </PremiumButton>
                    <PremiumButton tone="ghost" type="button">
                      {copy.cancel}
                    </PremiumButton>
                  </>
                ) : null}
                {status === "accepted" ? (
                  <>
                    <PremiumButton tone="primary" type="button">
                      {copy.viewBooking}
                    </PremiumButton>
                    <PremiumButton tone="secondary" type="button">
                      {copy.messageOwner}
                    </PremiumButton>
                  </>
                ) : null}
                {status === "declined" ? (
                  <>
                    <PremiumButton tone="primary" type="button">
                      {copy.browseSimilar}
                    </PremiumButton>
                    <PremiumButton tone="secondary" type="button">
                      {copy.sendNewRequest}
                    </PremiumButton>
                  </>
                ) : null}
              </>
            ) : (
              <>
                {(status === "sent" || status === "pending") ? (
                  <>
                    <PremiumButton tone="primary" type="button">
                      {copy.accept}
                    </PremiumButton>
                    <PremiumButton tone="ghost" type="button">
                      {copy.decline}
                    </PremiumButton>
                  </>
                ) : null}
                {status === "accepted" ? (
                  <>
                    <PremiumButton tone="primary" type="button">
                      {copy.viewBooking}
                    </PremiumButton>
                    <PremiumButton tone="secondary" type="button">
                      {copy.messageRenter}
                    </PremiumButton>
                  </>
                ) : null}
                {status === "declined" ? (
                  <PremiumButton tone="secondary" type="button">
                    {copy.messageRenter}
                  </PremiumButton>
                ) : null}
              </>
            )}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
