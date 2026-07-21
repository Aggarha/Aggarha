"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookingStatusTimeline, type BookingStatus } from "@/components/bookings/booking-status-timeline";
import { ListingModeBadge } from "@/components/marketplace/listing-mode-badge";
import { EmptyState, PremiumButton, PremiumCard } from "@/components/premium/system";
import { cancelBookingAction, respondToBookingAction } from "@/lib/bookings/actions";
import { formatPrice } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";

type BookingView = "renter" | "owner";

export type BookingRecord = {
  id: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "CANCELED" | "COMPLETED" | "EXPIRED";
  mode: "RENT" | "SWAP";
  requestedAt: string;
  totalDays: number | null;
  listing: {
    id: string;
    title: string;
    imageUrl: string | null;
    priceAmount: number | null;
    currencyCode: string;
    mode: "RENT" | "SWAP" | "BOTH";
  };
  offeredListingTitles: string[];
};

const SENT_WINDOW_MINUTES = 15;

function uiStatusFor(booking: BookingRecord): BookingStatus | null {
  if (booking.status === "REQUESTED") {
    const ageMinutes = (Date.now() - new Date(booking.requestedAt).getTime()) / 60000;
    return ageMinutes <= SENT_WINDOW_MINUTES ? "sent" : "pending";
  }
  if (booking.status === "APPROVED") return "accepted";
  if (booking.status === "REJECTED") return "declined";
  return null;
}

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
    days: (n: number) => `${n} ${n === 1 ? "day" : "days"}`,
    swap: "Swap",
    offering: "Offering",
    emptyTitle: "Nothing here yet",
    emptyDescription: "No requests in this state right now."
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
    days: (n: number) => `${n} ${n === 1 ? "يوم" : "أيام"}`,
    swap: "تبادل",
    offering: "العرض",
    emptyTitle: "لا يوجد شيء هنا بعد",
    emptyDescription: "لا توجد طلبات بهذه الحالة حاليًا."
  }
};

function ListingSummary({ booking, lang = "en" }: { booking: BookingRecord; lang?: Locale }) {
  const copy = COPY[lang];

  return (
    <div className="flex gap-3 rounded-2xl border border-white/[0.08] bg-[#141414] p-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
        {booking.listing.imageUrl ? (
          <Image src={booking.listing.imageUrl} alt={booking.listing.title} fill className="object-cover" sizes="80px" />
        ) : null}
      </div>
      <div className="min-w-0 space-y-1">
        <p className="line-clamp-1 text-sm font-bold text-white">{booking.listing.title}</p>
        <p className="text-sm font-bold text-[#ccff00]">
          {formatPrice(booking.listing.priceAmount, booking.listing.currencyCode, lang)}
          {booking.mode === "RENT" && booking.totalDays ? ` · ${copy.days(booking.totalDays)}` : ""}
        </p>
        <ListingModeBadge mode={booking.mode} lang={lang} />
        {booking.mode === "SWAP" && booking.offeredListingTitles.length > 0 ? (
          <p className="line-clamp-1 text-xs text-white/50">
            {copy.offering}: {booking.offeredListingTitles.join(" · ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function BookingStatusDemo({
  lang = "en",
  renterBookings,
  ownerBookings
}: {
  lang?: Locale;
  renterBookings: BookingRecord[];
  ownerBookings: BookingRecord[];
}) {
  const [view, setView] = useState<BookingView>("renter");
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActionPending, startTransition] = useTransition();
  const router = useRouter();
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const statuses: BookingStatus[] = ["sent", "pending", "accepted", "declined"];
  const timelineCopy = view === "renter" ? copy.timeline : copy.timelineOwner;

  const bookings = view === "renter" ? renterBookings : ownerBookings;
  const grouped: Record<BookingStatus, BookingRecord[]> = { sent: [], pending: [], accepted: [], declined: [] };
  for (const booking of bookings) {
    const uiStatus = uiStatusFor(booking);
    if (uiStatus) {
      grouped[uiStatus].push(booking);
    }
  }
  const current = grouped[status][0] ?? null;

  const runAction = (action: () => Promise<{ error: string } | { ok: true }>, nextStatus?: BookingStatus) => {
    setActionError(null);
    startTransition(async () => {
      const result = await action();
      if ("error" in result) {
        setActionError(result.error);
        return;
      }
      if (nextStatus) {
        setStatus(nextStatus);
      }
      router.refresh();
    });
  };

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
            {copy.tabs[item]} {grouped[item].length > 0 ? `(${grouped[item].length})` : ""}
          </button>
        ))}
      </div>

      {!current ? (
        <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <PremiumCard className="space-y-4 bg-[#171717]">
            <ListingSummary booking={current} lang={lang} />
          </PremiumCard>

          <PremiumCard className="space-y-4 bg-[#171717]">
            <BookingStatusTimeline status={status} t={timelineCopy} />

            {status === "sent" ? <p className="text-xs text-white/50">{view === "renter" ? copy.sentNote : copy.sentNoteOwner}</p> : null}
            {actionError ? <p className="text-xs font-semibold text-[#ff9a8a]">{actionError}</p> : null}

            <div className="flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
              {view === "renter" ? (
                <>
                  {status === "sent" || status === "pending" ? (
                    <>
                      <PremiumButton tone="secondary" type="button" disabled aria-disabled="true">
                        {copy.messageOwner}
                      </PremiumButton>
                      <PremiumButton
                        tone="ghost"
                        type="button"
                        disabled={isActionPending}
                        onClick={() => runAction(() => cancelBookingAction({ bookingId: current.id }))}
                      >
                        {copy.cancel}
                      </PremiumButton>
                    </>
                  ) : null}
                  {status === "accepted" ? (
                    <>
                      <PremiumButton tone="primary" type="button" disabled aria-disabled="true">
                        {copy.viewBooking}
                      </PremiumButton>
                      <PremiumButton tone="secondary" type="button" disabled aria-disabled="true">
                        {copy.messageOwner}
                      </PremiumButton>
                    </>
                  ) : null}
                  {status === "declined" ? (
                    <>
                      <PremiumButton tone="primary" type="button" disabled aria-disabled="true">
                        {copy.browseSimilar}
                      </PremiumButton>
                      <PremiumButton tone="secondary" type="button" disabled aria-disabled="true">
                        {copy.sendNewRequest}
                      </PremiumButton>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  {status === "sent" || status === "pending" ? (
                    <>
                      <PremiumButton
                        tone="primary"
                        type="button"
                        disabled={isActionPending}
                        onClick={() => runAction(() => respondToBookingAction({ bookingId: current.id, decision: "APPROVE" }), "accepted")}
                      >
                        {copy.accept}
                      </PremiumButton>
                      <PremiumButton
                        tone="ghost"
                        type="button"
                        disabled={isActionPending}
                        onClick={() => runAction(() => respondToBookingAction({ bookingId: current.id, decision: "REJECT" }), "declined")}
                      >
                        {copy.decline}
                      </PremiumButton>
                    </>
                  ) : null}
                  {status === "accepted" ? (
                    <>
                      <PremiumButton tone="primary" type="button" disabled aria-disabled="true">
                        {copy.viewBooking}
                      </PremiumButton>
                      <PremiumButton tone="secondary" type="button" disabled aria-disabled="true">
                        {copy.messageRenter}
                      </PremiumButton>
                    </>
                  ) : null}
                  {status === "declined" ? (
                    <PremiumButton tone="secondary" type="button" disabled aria-disabled="true">
                      {copy.messageRenter}
                    </PremiumButton>
                  ) : null}
                </>
              )}
            </div>
          </PremiumCard>
        </div>
      )}
    </div>
  );
}
