"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleSavedListingAction } from "@/lib/marketplace/actions";
import { cn } from "@/lib/cn";

/**
 * The bookmark is the write side of the Saved tab — the quieter counterpart to
 * the heart. No count is shown: how many people liked an item is public
 * signal, how many filed it away for later is not.
 */
export function SaveButton({
  listingId,
  initialActive,
  saveLabel,
  savedLabel,
  className
}: {
  listingId: string;
  initialActive: boolean;
  saveLabel: string;
  savedLabel: string;
  className?: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    const previous = active;
    setActive(!previous);

    startTransition(async () => {
      const result = await toggleSavedListingAction(listingId);
      if ("error" in result) {
        setActive(previous);
        if (result.error === "unauthorized") {
          router.push(`/login?next=${encodeURIComponent(`/marketplace/${listingId}`)}`);
        }
        return;
      }
      setActive(result.active);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={active}
      aria-label={active ? savedLabel : saveLabel}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/70 backdrop-blur transition-colors duration-200 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 disabled:opacity-70",
        active ? "text-[#ccff00]" : "text-white/85 hover:text-white",
        className
      )}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 3h12a1 1 0 0 1 1 1v16.2a.6.6 0 0 1-.94.5L12 16.8l-6.06 3.9A.6.6 0 0 1 5 20.2V4a1 1 0 0 1 1-1Z" />
      </svg>
    </button>
  );
}
