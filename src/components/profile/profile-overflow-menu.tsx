"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/premium/sheet";
import { PremiumTextarea } from "@/components/premium/system";
import { reportUserAction, toggleBlockAction } from "@/lib/profile/actions";
import { cn } from "@/lib/cn";

export type OverflowCopy = {
  moreActions: string;
  block: string;
  unblock: string;
  report: string;
  reportReasonLabel: string;
  reportDetailsLabel: string;
  reportSubmit: string;
  reportSent: string;
  reasons: { scam: string; fake_listings: string; harassment: string; other: string };
  blockConfirm: string;
  cancel: string;
  saving: string;
};

type Reason = keyof OverflowCopy["reasons"];
const REASONS: Reason[] = ["scam", "fake_listings", "harassment", "other"];

/**
 * The ▼ next to Follow/Message. Report files into the existing FraudReport
 * queue; Block is a real edge that also drops the follow relationship both
 * ways. Both live behind the menu rather than on the surface — they are rare,
 * deliberate actions and should not compete with Follow for attention.
 */
export function ProfileOverflowMenu({
  targetUserId,
  blockedByViewer,
  copy
}: {
  targetUserId: string;
  blockedByViewer: boolean;
  copy: OverflowCopy;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState<Reason>("scam");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleBlock = () => {
    setMenuOpen(false);
    if (!blockedByViewer && !window.confirm(copy.blockConfirm)) {
      return;
    }
    startTransition(async () => {
      const result = await toggleBlockAction(targetUserId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const handleReport = () => {
    setError(null);
    startTransition(async () => {
      const result = await reportUserAction({ targetUserId, reason, details });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSent(true);
    });
  };

  const itemClass =
    "flex min-h-[44px] w-full items-center px-4 text-sm font-medium text-white/85 transition-colors duration-200 ease-[var(--ease-premium)] hover:bg-white/[0.07] hover:text-white";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label={copy.moreActions}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 text-white/70 transition-colors duration-200 ease-[var(--ease-premium)] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {menuOpen ? (
        <div
          role="menu"
          className="absolute end-0 top-[calc(100%+0.5rem)] z-30 w-44 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#181818] py-1 shadow-[0_18px_36px_rgba(0,0,0,0.55)] [animation:revealUp_.18s_ease_both]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              setSent(false);
              setReportOpen(true);
            }}
            className={itemClass}
          >
            {copy.report}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleBlock}
            disabled={pending}
            className={cn(itemClass, "text-[#ff8a8a] hover:text-[#ffa3a3] disabled:opacity-50")}
          >
            {blockedByViewer ? copy.unblock : copy.block}
          </button>
        </div>
      ) : null}

      <Sheet open={reportOpen} onClose={() => setReportOpen(false)}>
        <div className="space-y-4 p-4 pb-6">
          {sent ? (
            <>
              <h2 className="text-lg font-bold text-white">{copy.reportSent}</h2>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="min-h-[48px] w-full rounded-2xl bg-[#ccff00] text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:bg-[#deff57] active:scale-[0.97]"
              >
                {copy.cancel}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-white">{copy.report}</h2>

              <fieldset className="space-y-2">
                <legend className="mb-2 text-xs font-semibold text-white/65">{copy.reportReasonLabel}</legend>
                {REASONS.map((value) => (
                  <label
                    key={value}
                    className={cn(
                      "flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 text-sm transition-colors duration-200 ease-[var(--ease-premium)]",
                      reason === value
                        ? "border-[#ccff00]/50 bg-[#ccff00]/[0.08] text-white"
                        : "border-white/10 text-white/75 hover:bg-white/[0.04]"
                    )}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={value}
                      checked={reason === value}
                      onChange={() => setReason(value)}
                      className="h-4 w-4"
                    />
                    {copy.reasons[value]}
                  </label>
                ))}
              </fieldset>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-white/65">{copy.reportDetailsLabel}</span>
                <PremiumTextarea
                  rows={3}
                  maxLength={500}
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                />
              </label>

              {error ? <p className="text-sm font-medium text-[#ff8a8a]">{error}</p> : null}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  disabled={pending}
                  className="min-h-[48px] flex-1 rounded-2xl border border-white/15 text-sm font-semibold text-white transition-colors duration-200 ease-[var(--ease-premium)] hover:bg-white/[0.06] disabled:opacity-50"
                >
                  {copy.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleReport}
                  disabled={pending}
                  className="min-h-[48px] flex-1 rounded-2xl bg-[#ccff00] text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:bg-[#deff57] active:scale-[0.97] disabled:opacity-50"
                >
                  {pending ? copy.saving : copy.reportSubmit}
                </button>
              </div>
            </>
          )}
        </div>
      </Sheet>
    </div>
  );
}
