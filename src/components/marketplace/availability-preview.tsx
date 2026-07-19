import type { Locale } from "@/lib/i18n/types";

type CalendarDate = {
  date: Date;
  status: "AVAILABLE" | "BLOCKED" | "RESERVED";
};

function addDays(base: Date, days: number): Date {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date;
}

function shortWeekday(date: Date, locale: Locale): string {
  return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { weekday: "short" });
}

export function AvailabilityPreview({
  dates,
  lang = "en",
  className = "",
  onToggle
}: {
  dates: CalendarDate[];
  lang?: Locale;
  className?: string;
  /** When provided, each day becomes a toggle button instead of a static cell. */
  onToggle?: (date: Date) => void;
}) {
  const upcoming = Array.from({ length: 10 }, (_, index) => {
    const day = addDays(new Date(), index);
    day.setHours(0, 0, 0, 0);
    const existing = dates.find((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === day.getTime();
    });

    return {
      day,
      status: existing?.status ?? "AVAILABLE"
    };
  });

  return (
    <div className={`grid grid-cols-5 gap-2 ${className}`}>
      {upcoming.map((item) => {
        const color =
          item.status === "AVAILABLE"
            ? "border border-[#ccff00]/40 bg-[#ccff00]/14 text-[#eaff95]"
            : item.status === "RESERVED"
              ? "border border-amber-300/45 bg-amber-300/16 text-amber-200"
              : "border border-white/12 bg-white/8 text-white/65";

        const cellClass = `rounded-xl p-2 text-center text-[11px] font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${color} ${
          onToggle ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.96]" : ""
        }`;
        const content = (
          <>
            <p>{shortWeekday(item.day, lang)}</p>
            <p className="tabular-nums">{item.day.getDate()}</p>
          </>
        );

        return onToggle ? (
          <button key={item.day.toISOString()} type="button" onClick={() => onToggle(item.day)} className={cellClass}>
            {content}
          </button>
        ) : (
          <div key={item.day.toISOString()} className={cellClass}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
