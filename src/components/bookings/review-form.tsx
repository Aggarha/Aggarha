"use client";

import { useState, useTransition } from "react";
import { createReviewAction } from "@/lib/reviews/actions";
import { PremiumButton, PremiumTextarea } from "@/components/premium/system";
import type { Locale } from "@/lib/i18n/types";

const COPY = {
  en: {
    leaveReview: "Leave a review",
    alreadyReviewed: "You reviewed this booking",
    rating: "Rating",
    commentPlaceholder: "Share a few words about this booking (optional)",
    submit: "Submit review",
    submitting: "Submitting…",
    cancel: "Cancel"
  },
  ar: {
    leaveReview: "أضف تقييمًا",
    alreadyReviewed: "لقد قيّمت هذا الحجز",
    rating: "التقييم",
    commentPlaceholder: "شارك بضع كلمات عن هذا الحجز (اختياري)",
    submit: "إرسال التقييم",
    submitting: "جارٍ الإرسال…",
    cancel: "إلغاء"
  }
};

export function ReviewForm({
  bookingId,
  alreadyReviewed,
  lang = "en"
}: {
  bookingId: string;
  alreadyReviewed: boolean;
  lang?: Locale;
}) {
  const copy = COPY[lang];
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(alreadyReviewed);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (submitted) {
    return <p className="text-xs font-semibold text-white/50">{copy.alreadyReviewed}</p>;
  }

  if (!open) {
    return (
      <PremiumButton tone="secondary" type="button" onClick={() => setOpen(true)}>
        {copy.leaveReview}
      </PremiumButton>
    );
  }

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await createReviewAction({ bookingId, rating, comment: comment.trim() || undefined });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  };

  return (
    <div className="w-full space-y-3 rounded-2xl border border-white/[0.08] bg-[#141414] p-3">
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-white/60">{copy.rating}</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold transition-all duration-200 ease-[var(--ease-premium)] ${
                rating === value
                  ? "border-[#ccff00]/55 bg-[#ccff00]/14 text-[#eaff95]"
                  : "border-white/12 bg-white/[0.03] text-white/55 hover:text-white/85"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <PremiumTextarea
        rows={2}
        maxLength={500}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={copy.commentPlaceholder}
      />

      {error ? <p className="text-xs font-semibold text-[#ff9a8a]">{error}</p> : null}

      <div className="flex gap-2">
        <PremiumButton tone="primary" type="button" disabled={isPending} onClick={submit}>
          {isPending ? copy.submitting : copy.submit}
        </PremiumButton>
        <PremiumButton tone="ghost" type="button" disabled={isPending} onClick={() => setOpen(false)}>
          {copy.cancel}
        </PremiumButton>
      </div>
    </div>
  );
}
