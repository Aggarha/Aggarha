"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFavoriteAction } from "@/lib/marketplace/actions";
import { cn } from "@/lib/cn";

/**
 * The heart used to be a static count over the gallery. It is now the write
 * side of the Liked tab: tapping it adds or removes a Favorite row, and the
 * count moves optimistically before the server confirms.
 */
export function FavoriteButton({
  listingId,
  initialActive,
  initialCount,
  label,
  className
}: {
  listingId: string;
  initialActive: boolean;
  initialCount: number;
  label: string;
  className?: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    const previous = { active, count };
    setActive(!active);
    setCount((value) => value + (active ? -1 : 1));

    startTransition(async () => {
      const result = await toggleFavoriteAction(listingId);
      if ("error" in result) {
        setActive(previous.active);
        setCount(previous.count);
        // A signed-out visitor keeps their place: they come back to this listing.
        if (result.error === "unauthorized") {
          router.push(`/login?next=${encodeURIComponent(`/marketplace/${listingId}`)}`);
        }
        return;
      }
      setActive(result.active);
      setCount(result.count);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-black/70 px-3 text-xs font-semibold backdrop-blur transition-colors duration-200 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 disabled:opacity-70",
        active ? "text-[#ff6b81]" : "text-white/85 hover:text-white",
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
        className="transition-transform duration-200 ease-[var(--ease-premium)]"
        style={{ transform: active ? "scale(1.12)" : "scale(1)" }}
        aria-hidden="true"
      >
        <path d="M12 21s-6.7-4.35-9.3-8.1C1.1 10.4 1.6 7 4.4 5.5c2.2-1.2 4.6-.5 6.1 1.2l1.5 1.7 1.5-1.7c1.5-1.7 3.9-2.4 6.1-1.2 2.8 1.5 3.3 4.9 1.7 7.4C18.7 16.65 12 21 12 21Z" />
      </svg>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
