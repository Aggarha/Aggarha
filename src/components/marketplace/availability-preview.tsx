"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/types";

type CalendarStatus = "AVAILABLE" | "BLOCKED" | "RESERVED";

type CalendarDate = {
  date: Date;
  status: CalendarStatus;
};

type DayCell =
  | { type: "pad" }
  | { type: "day"; date: Date; status: CalendarStatus; isToday: boolean; isPast: boolean };

const MAX_MONTHS_AHEAD = 6;

const COPY = {
  en: {
    available: "Available",
    reserved: "Reserved",
    blocked: "Blocked",
    prevMonth: "Previous month",
    nextMonth: "Next month"
  },
  ar: {
    available: "متاح",
    reserved: "محجوز",
    blocked: "محجوب",
    prevMonth: "الشهر السابق",
    nextMonth: "الشهر التالي"
  }
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

/**
 * `dates` entries are always UTC-midnight-normalized calendar days (whether freshly parsed
 * from a "YYYY-MM-DD" key client-side, or read back from the DB — see add-listing-wizard.tsx
 * and createListingAction). Grid cells, by contrast, are LOCAL dates (`new Date(y, m, d)`), so
 * they represent the same calendar day differently depending on the viewer's timezone. Comparing
 * raw timestamps (as this used to do via a local startOfDay on both sides) silently shifts the
 * match by a day for any non-UTC timezone. Comparing the UTC-extracted key against the
 * local-extracted key instead recovers the intended calendar day on both sides correctly,
 * regardless of the viewer's timezone.
 */
function utcDateKey(date: Date): string {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function monthLabel(year: number, month: number, lang: Locale): string {
  return new Date(year, month, 1).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "long",
    year: "numeric"
  });
}

/** Jan 1, 2023 was a Sunday — a stable Sun-Sat reference week for generating weekday labels. */
function weekdayLabels(lang: Locale): string[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(2023, 0, 1 + index);
    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { weekday: "short" });
  });
}

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export function AvailabilityCalendar({
  dates,
  lang = "en",
  className = "",
  onToggle
}: {
  dates: CalendarDate[];
  lang?: Locale;
  className?: string;
  /** When provided, in-month non-past days become toggle buttons. */
  onToggle?: (date: Date) => void;
}) {
  const today = startOfDay(new Date());
  const [viewed, setViewed] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const monthsAhead = (viewed.year - today.getFullYear()) * 12 + (viewed.month - today.getMonth());
  const canGoPrev = monthsAhead > 0;
  const canGoNext = monthsAhead < MAX_MONTHS_AHEAD;

  const goPrev = () => {
    if (!canGoPrev) return;
    setViewed((current) => {
      const month = current.month === 0 ? 11 : current.month - 1;
      const year = current.month === 0 ? current.year - 1 : current.year;
      return { year, month };
    });
  };

  const goNext = () => {
    if (!canGoNext) return;
    setViewed((current) => {
      const month = current.month === 11 ? 0 : current.month + 1;
      const year = current.month === 11 ? current.year + 1 : current.year;
      return { year, month };
    });
  };

  const firstWeekday = new Date(viewed.year, viewed.month, 1).getDay();
  const totalDays = new Date(viewed.year, viewed.month + 1, 0).getDate();
  const trailing = (7 - ((firstWeekday + totalDays) % 7)) % 7;

  const cells: DayCell[] = [
    ...Array.from({ length: firstWeekday }, () => ({ type: "pad" as const })),
    ...Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(viewed.year, viewed.month, index + 1);
      const existing = dates.find((item) => utcDateKey(new Date(item.date)) === localDateKey(date));
      return {
        type: "day" as const,
        date,
        status: existing?.status ?? ("AVAILABLE" as CalendarStatus),
        isToday: date.getTime() === today.getTime(),
        isPast: date.getTime() < today.getTime()
      };
    }),
    ...Array.from({ length: trailing }, () => ({ type: "pad" as const }))
  ];

  const copy = COPY[lang];
  const weekdays = weekdayLabels(lang);

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label={copy.prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors duration-200 ease-[var(--ease-premium)] hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/70"
        >
          <ChevronIcon direction="prev" />
        </button>
        <p className="text-sm font-bold text-white">{monthLabel(viewed.year, viewed.month, lang)}</p>
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label={copy.nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors duration-200 ease-[var(--ease-premium)] hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/70"
        >
          <ChevronIcon direction="next" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wide text-white/40 sm:gap-1.5">
        {weekdays.map((label) => (
          <p key={label}>{label}</p>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((cell, index) => {
          if (cell.type === "pad") {
            return <div key={`pad-${index}`} />;
          }

          const color =
            cell.status === "AVAILABLE"
              ? "border border-[#ccff00]/40 bg-[#ccff00]/14 text-[#eaff95]"
              : cell.status === "RESERVED"
                ? "border border-amber-400/70 bg-amber-400/35 text-amber-100"
                : "border border-white/12 bg-white/8 text-white/65";

          const interactive = Boolean(onToggle) && !cell.isPast;
          const todayRing = cell.isToday ? "shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.85)]" : "";
          const pastTreatment = cell.isPast ? "opacity-35" : "";

          const cellClass = `rounded-lg p-1.5 text-center text-[11px] font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${color} ${todayRing} ${pastTreatment} ${
            interactive ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.96]" : ""
          }`;

          const content = <p className="tabular-nums">{cell.date.getDate()}</p>;

          return interactive ? (
            <button key={cell.date.toISOString()} type="button" onClick={() => onToggle?.(cell.date)} className={cellClass}>
              {content}
            </button>
          ) : (
            <div key={cell.date.toISOString()} className={cellClass}>
              {content}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-white/50">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-[#ccff00]/40 bg-[#ccff00]/14" />
          {copy.available}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-amber-400/70 bg-amber-400/35" />
          {copy.reserved}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-white/12 bg-white/8" />
          {copy.blocked}
        </span>
      </div>
    </div>
  );
}
