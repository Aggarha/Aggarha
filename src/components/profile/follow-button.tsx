"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFollowAction } from "@/lib/profile/actions";
import { cn } from "@/lib/cn";

/**
 * Optimistic: the label and the follower count flip on tap and settle against
 * the server's recount when it answers. A failure rolls both back rather than
 * leaving the button claiming a state the database does not have.
 */
export function FollowButton({
  targetUserId,
  initialFollowing,
  followLabel,
  followingLabel
}: {
  targetUserId: string;
  initialFollowing: boolean;
  followLabel: string;
  followingLabel: string;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    const previous = following;
    setFollowing(!previous);

    startTransition(async () => {
      const result = await toggleFollowAction(targetUserId);
      if ("error" in result) {
        setFollowing(previous);
        return;
      }
      setFollowing(result.following);
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={following}
      className={cn(
        "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl px-5 text-sm font-bold transition-all duration-200 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 active:scale-[0.97] disabled:opacity-60",
        following
          ? "border border-white/15 bg-white/[0.06] text-white hover:bg-white/10"
          : "bg-[#ccff00] text-black hover:bg-[#deff57]"
      )}
    >
      {following ? followingLabel : followLabel}
    </button>
  );
}
