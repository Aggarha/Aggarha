import { EmptyState } from "@/components/premium/system";
import { resolveDisplayName } from "@/lib/profile/identity";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/types";

type StatusTone = "pending" | "accepted" | "declined" | "neutral";

const TONE_CLASS: Record<StatusTone, string> = {
  pending: "border-[#fbbf24]/25 bg-[#fbbf24]/[0.08] text-[#fbbf24]",
  accepted: "border-[#34d399]/25 bg-[#34d399]/[0.08] text-[#34d399]",
  declined: "border-[#f87171]/25 bg-[#f87171]/[0.08] text-[#f87171]",
  neutral: "border-white/[0.1] text-white/60"
};

export function statusTone(status: string): StatusTone {
  if (status === "REQUESTED") return "pending";
  if (status === "APPROVED" || status === "COMPLETED") return "accepted";
  if (status === "REJECTED" || status === "CANCELED" || status === "EXPIRED") return "declined";
  return "neutral";
}

export function StatusChip({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold", TONE_CLASS[tone])}>
      {label}
    </span>
  );
}

function formatRange(start: Date | null, end: Date | null, lang: Locale): string | null {
  if (!start) return null;
  const locale = lang === "ar" ? "ar-EG" : "en-US";
  const fmt = (d: Date) => d.toLocaleDateString(locale, { month: "short", day: "numeric" });
  return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

export function BookingList({
  bookings,
  lang,
  statusLabel,
  emptyTitle,
  emptyDescription
}: {
  bookings: Array<{
    id: string;
    status: string;
    mode: string;
    startDate: Date | null;
    endDate: Date | null;
    listing: { id: string; title: string };
  }>;
  lang: Locale;
  statusLabel: (status: string) => string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (bookings.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {bookings.map((booking) => (
        <li
          key={booking.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#171717] px-4 py-3.5"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{booking.listing.title}</p>
            <p className="mt-0.5 truncate text-xs text-white/50">
              {formatRange(booking.startDate, booking.endDate, lang) ?? booking.mode}
            </p>
          </div>
          <StatusChip label={statusLabel(booking.status)} tone={statusTone(booking.status)} />
        </li>
      ))}
    </ul>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="shrink-0 text-xs font-bold text-[#ccff00]" aria-label={`${rating} / 5`}>
      {"★".repeat(Math.max(0, Math.min(5, rating)))}
      <span className="text-white/20">{"★".repeat(Math.max(0, 5 - rating))}</span>
    </span>
  );
}

export function ReviewList({
  reviews,
  lang,
  emptyTitle,
  emptyDescription
}: {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    reviewer: { profile: { displayName: string | null } | null };
  }>;
  lang: Locale;
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (reviews.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-2xl border border-white/[0.08] bg-[#171717] px-4 py-3.5">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-semibold text-white">
              {resolveDisplayName(review.reviewer.profile, lang)}
            </p>
            <Stars rating={review.rating} />
          </div>
          {review.comment ? (
            <p className="mt-1.5 text-sm leading-relaxed text-white/70">{review.comment}</p>
          ) : null}
          <p className="mt-1.5 text-xs text-white/40">
            {review.createdAt.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </p>
        </li>
      ))}
    </ul>
  );
}

export { formatRange };
