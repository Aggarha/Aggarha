"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/premium/system";
import { respondToBookingAction } from "@/lib/bookings/actions";
import { buildProfilePath } from "@/lib/profile/identity";

export type IncomingRequest = {
  id: string;
  mode: string;
  dateLabel: string | null;
  listingTitle: string;
  requesterName: string;
  requesterHandle: string | null;
};

/**
 * Accept/decline reuse respondToBookingAction — the same path /bookings uses,
 * so approving here creates the Deal and sends the notification email exactly
 * as it does there. A decided row disappears on refresh because the query only
 * selects rows still REQUESTED.
 */
export function IncomingRequestList({
  requests,
  copy
}: {
  requests: IncomingRequest[];
  copy: {
    accept: string;
    decline: string;
    emptyTitle: string;
    emptyDescription: string;
  };
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  if (requests.length === 0) {
    return <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />;
  }

  const respond = (bookingId: string, decision: "APPROVE" | "REJECT") => {
    setError(null);
    setPendingId(bookingId);
    startTransition(async () => {
      const result = await respondToBookingAction({ bookingId, decision });
      setPendingId(null);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-2.5">
      {error ? <p className="text-sm font-medium text-[#ff8a8a]">{error}</p> : null}
      <ul className="flex flex-col gap-2.5">
        {requests.map((request) => (
          <li key={request.id} className="rounded-2xl border border-white/[0.08] bg-[#171717] px-4 py-3.5">
            <p className="truncate text-sm font-semibold text-white">{request.listingTitle}</p>
            <p className="mt-0.5 truncate text-xs text-white/50">
              {request.requesterHandle ? (
                <Link
                  href={buildProfilePath(request.requesterHandle) as Route}
                  className="underline-offset-2 hover:text-[#ccff00] hover:underline"
                >
                  {request.requesterName}
                </Link>
              ) : (
                request.requesterName
              )}
              {" · "}
              {request.mode}
              {request.dateLabel ? ` · ${request.dateLabel}` : ""}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => respond(request.id, "APPROVE")}
                disabled={pendingId === request.id}
                className="min-h-[44px] flex-1 rounded-xl bg-[#ccff00] text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:bg-[#deff57] active:scale-[0.97] disabled:opacity-50"
              >
                {copy.accept}
              </button>
              <button
                type="button"
                onClick={() => respond(request.id, "REJECT")}
                disabled={pendingId === request.id}
                className="min-h-[44px] flex-1 rounded-xl border border-white/15 text-sm font-semibold text-white transition-colors duration-200 ease-[var(--ease-premium)] hover:bg-white/[0.06] disabled:opacity-50"
              >
                {copy.decline}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
