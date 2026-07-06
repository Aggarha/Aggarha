type CalendarDate = {
  date: Date;
  status: "AVAILABLE" | "BLOCKED" | "RESERVED";
};

function addDays(base: Date, days: number): Date {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date;
}

function shortWeekday(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function AvailabilityPreview({ dates, className = "" }: { dates: CalendarDate[]; className?: string }) {
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
            ? "bg-emerald-100 text-emerald-900"
            : item.status === "RESERVED"
              ? "bg-amber-100 text-amber-900"
              : "bg-slate-200 text-slate-700";

        return (
          <div key={item.day.toISOString()} className={`rounded-xl p-2 text-center text-[11px] font-semibold ${color}`}>
            <p>{shortWeekday(item.day)}</p>
            <p>{item.day.getDate()}</p>
          </div>
        );
      })}
    </div>
  );
}
