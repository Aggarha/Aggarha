"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { deleteListingAction, setListingPausedAction } from "@/lib/listings/actions";
import type { Locale } from "@/lib/i18n/types";

const COPY = {
  en: {
    edit: "Edit",
    pause: "Pause",
    resume: "Activate",
    delete: "Delete",
    confirmDelete: "Delete this listing? If it has bookings it will be archived instead, so the booking history is kept.",
    archived: "This listing has bookings, so it was archived instead of deleted."
  },
  ar: {
    edit: "تعديل",
    pause: "إيقاف مؤقت",
    resume: "تفعيل",
    delete: "حذف",
    confirmDelete: "هل تريد حذف هذا الإعلان؟ إذا كان عليه حجوزات فسيتم أرشفته بدلًا من حذفه للحفاظ على سجل الحجوزات.",
    archived: "هذا الإعلان عليه حجوزات، لذلك تمت أرشفته بدلًا من حذفه."
  }
};

const buttonClass =
  "inline-flex min-h-[36px] flex-1 items-center justify-center rounded-xl border px-3 text-xs font-semibold transition-all duration-200 ease-[var(--ease-premium)] disabled:cursor-not-allowed disabled:opacity-55";

/** Owner controls under each card on My Listings: edit, pause/activate and delete. */
export function ListingOwnerActions({ listingId, paused, lang = "en" }: { listingId: string; paused: boolean; lang?: Locale }) {
  const copy = COPY[lang];
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const togglePause = () => {
    setError(null);
    startTransition(async () => {
      const result = await setListingPausedAction(listingId, !paused);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const remove = () => {
    if (!window.confirm(copy.confirmDelete)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteListingAction(listingId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      if (result.outcome === "archived") {
        window.alert(copy.archived);
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <Link
          href={`/listings/${listingId}/edit` as Route}
          className={`${buttonClass} border-white/10 bg-[#1b1b1b] text-white hover:bg-[#202020]`}
        >
          {copy.edit}
        </Link>
        <button
          type="button"
          onClick={togglePause}
          disabled={isPending}
          className={`${buttonClass} ${
            paused
              ? "border-[#ccff00]/40 bg-[#ccff00]/10 text-[#eaff95] hover:bg-[#ccff00]/15"
              : "border-white/10 bg-[#1b1b1b] text-white/80 hover:bg-[#202020]"
          }`}
        >
          {paused ? copy.resume : copy.pause}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={isPending}
          className={`${buttonClass} border-[#ff9a8a]/30 bg-[#ff9a8a]/10 text-[#ffbcb0] hover:bg-[#ff9a8a]/15`}
        >
          {copy.delete}
        </button>
      </div>
      {error ? <p className="text-xs font-semibold text-[#ff9a8a]">{error}</p> : null}
    </div>
  );
}
