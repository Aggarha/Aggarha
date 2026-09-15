"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ProfileTabKey = "listings" | "liked" | "saved";

function BoxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 8.5v7a1.6 1.6 0 0 1-.85 1.4l-7.2 3.8a1.9 1.9 0 0 1-1.9 0l-7.2-3.8A1.6 1.6 0 0 1 3 15.5v-7" />
      <path d="m3.3 7.7 8.2 4.3 8.2-4.3-8.2-4.3a1.1 1.1 0 0 0-1 0L3.3 7.7Z" />
      <path d="M11.5 12v8.9" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20.5s-6.4-4.15-8.9-7.75C1.4 10 1.9 6.7 4.6 5.3c2.1-1.15 4.4-.5 5.85 1.15L12 8.05l1.55-1.6C15 4.8 17.3 4.15 19.4 5.3c2.7 1.4 3.2 4.7 1.5 7.45C18.4 16.35 12 20.5 12 20.5Z" />
    </svg>
  );
}

function SavedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h9M3 11h7M3 16h5" />
      <path d="M17.6 21s-4.6-2.9-4.6-6.1a2.75 2.75 0 0 1 4.6-2.05A2.75 2.75 0 0 1 22.2 14.9c0 3.2-4.6 6.1-4.6 6.1Z" />
    </svg>
  );
}

const ICONS: Record<ProfileTabKey, () => ReactNode> = {
  listings: BoxIcon,
  liked: HeartIcon,
  saved: SavedIcon
};

/**
 * Tabs live client-side while all three panels are rendered on the server and
 * passed in as slots, so switching is instant with no spinner and no refetch —
 * a profile has three short lists, not three expensive pages.
 *
 * The lime indicator slides between columns; panels cross-fade. Motion here
 * answers a tap rather than decorating the page, which is the only kind this
 * interface uses.
 */
export function ProfileTabs({
  tabs,
  panels
}: {
  tabs: Array<{ key: ProfileTabKey; label: string; count: number | null }>;
  panels: Record<ProfileTabKey, ReactNode>;
}) {
  const [active, setActive] = useState<ProfileTabKey>(tabs[0]?.key ?? "listings");
  const baseId = useId();
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.key === active));

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="Profile sections"
        className="relative grid rounded-2xl border border-white/[0.08] bg-[#171717] p-1"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 left-1 rounded-xl bg-[#ccff00] transition-transform duration-300 ease-[var(--ease-premium)] motion-reduce:transition-none"
          style={{
            width: `calc((100% - 0.5rem) / ${tabs.length})`,
            transform: `translateX(calc(${activeIndex} * 100%))`
          }}
        />
        {tabs.map((tab) => {
          const Icon = ICONS[tab.key];
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              id={`${baseId}-tab-${tab.key}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.key}`}
              onClick={() => setActive(tab.key)}
              className={cn(
                "relative z-10 flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-2 text-[13px] font-semibold transition-colors duration-200 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70",
                isActive ? "text-black" : "text-white/60 hover:text-white"
              )}
            >
              <Icon />
              <span className="truncate">{tab.label}</span>
              {tab.count !== null ? <span className="tabular-nums opacity-70">{tab.count}</span> : null}
            </button>
          );
        })}
      </div>

      {/* Only the active panel is mounted, and its key changes with the tab, so
          the enter animation replays on every switch instead of running once
          on load and never again. */}
      <div
        key={active}
        id={`${baseId}-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="animate-page-enter motion-reduce:animate-none"
      >
        {panels[active]}
      </div>
    </div>
  );
}
