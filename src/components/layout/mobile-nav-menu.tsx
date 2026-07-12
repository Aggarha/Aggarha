"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/types";

type NavStrings = {
  featured: string;
  collectibles: string;
  playstation: string;
  openMenu: string;
  closeMenu: string;
};

/** Browse already lives in the mobile bottom nav — no duplicates here. */
export function MobileNavMenu({ locale, nav }: { locale: Locale; nav: NavStrings }) {
  const [open, setOpen] = useState(false);
  const isRtl = locale === "ar";

  const links: Array<{ href: Route; label: string }> = [
    { href: "/featured" as Route, label: nav.featured },
    { href: "/collectibles" as Route, label: nav.collectibles },
    { href: "/playstation" as Route, label: nav.playstation }
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? nav.closeMenu : nav.openMenu}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white transition-all duration-200 ease-[var(--ease-premium)] hover:bg-white/5 active:scale-[0.96]"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="absolute inset-x-0 top-full border-b border-white/[0.06] bg-black/95 px-4 pb-4 pt-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl [animation:revealUp_.22s_ease_both]"
        >
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-[44px] items-center rounded-xl px-3 text-sm font-semibold text-white/80 transition-all duration-200 ease-[var(--ease-premium)] hover:bg-white/5 hover:text-[#ccff00]",
                  isRtl ? "hover:pr-4" : "hover:pl-4"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
