"use client";

import { useActionState, useMemo, useState } from "react";
import Image from "next/image";
import { createBookingRequestAction } from "@/lib/bookings/actions";
import { calculateTotalDays } from "@/lib/bookings/format";
import { PremiumButton, PremiumCard, PremiumInput, PremiumTextarea } from "@/components/premium/system";
import { formatPrice } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";

const COPY = {
  en: {
    title: "Request to rent",
    startDate: "Start date",
    endDate: "End date",
    messageLabel: "Message (optional)",
    messagePlaceholder: "Add a note for the owner...",
    send: "Send rental request",
    sending: "Sending…",
    total: (price: string, days: number) => `Total: ${price} for ${days} ${days === 1 ? "day" : "days"}`,
    selectDatesPrompt: "Select a start and end date to see the total"
  },
  ar: {
    title: "طلب استئجار",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    messageLabel: "رسالة (اختياري)",
    messagePlaceholder: "أضف ملاحظة للمالك...",
    send: "إرسال طلب الاستئجار",
    sending: "جارٍ الإرسال…",
    total: (price: string, days: number) => `الإجمالي: ${price} مقابل ${days} ${days === 1 ? "يوم" : "أيام"}`,
    selectDatesPrompt: "اختر تاريخ البدء والانتهاء لرؤية الإجمالي"
  }
};

export function RentRequestForm({
  listingId,
  title,
  imageUrl,
  priceAmount,
  currencyCode,
  lang = "en"
}: {
  listingId: string;
  title: string;
  imageUrl: string | null;
  priceAmount: number | null;
  currencyCode: string;
  lang?: Locale;
}) {
  const isRtl = lang === "ar";
  const copy = COPY[lang];
  const [state, formAction, pending] = useActionState(createBookingRequestAction, undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) {
      return null;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!(end.getTime() > start.getTime())) {
      return null;
    }
    return calculateTotalDays(start, end);
  }, [startDate, endDate]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-black tracking-tight text-white">{copy.title}</h1>

      <PremiumCard className="flex items-center gap-3 bg-[#171717]">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
          {imageUrl ? <Image src={imageUrl} alt={title} fill className="object-cover" sizes="80px" /> : null}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="line-clamp-1 text-sm font-bold text-white">{title}</p>
          <p className="text-sm font-bold text-[#ccff00]">{formatPrice(priceAmount, currencyCode, lang)}</p>
        </div>
      </PremiumCard>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="listingId" value={listingId} />
        <input type="hidden" name="mode" value="RENT" />

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-white/60">{copy.startDate}</span>
            <PremiumInput
              type="date"
              name="startDate"
              required
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-white/60">{copy.endDate}</span>
            <PremiumInput
              type="date"
              name="endDate"
              required
              min={startDate || undefined}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
        </div>

        {totalDays && priceAmount ? (
          <p className="text-sm font-bold text-[#ccff00]">{copy.total(formatPrice(priceAmount * totalDays, currencyCode, lang), totalDays)}</p>
        ) : (
          <p className="text-xs text-white/50">{copy.selectDatesPrompt}</p>
        )}

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-white/60">{copy.messageLabel}</span>
          <PremiumTextarea rows={3} name="message" placeholder={copy.messagePlaceholder} />
        </label>

        {state?.error ? <p className="text-center text-xs font-semibold text-[#ff9a8a]">{state.error}</p> : null}

        <PremiumButton type="submit" tone="primary" disabled={pending} className="w-full">
          {pending ? copy.sending : copy.send}
        </PremiumButton>
      </form>
    </div>
  );
}
