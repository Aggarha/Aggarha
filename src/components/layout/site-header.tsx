import type { Route } from "next";
import Link from "next/link";
import { MobileNavMenu } from "@/components/layout/mobile-nav-menu";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import type { Locale } from "@/lib/i18n/types";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.05] bg-black/70 backdrop-blur-xl">
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-x-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 font-[family-name:var(--font-space-grotesk)] text-base font-black tracking-[0.05em] text-white"
        >
          <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-[#ccff00] shadow-[0_0_14px_rgba(204,255,0,0.55)]" />
          AGGARHA
        </Link>
        <nav className="hidden items-center gap-6 text-[13px] font-medium text-white/55 md:flex">
          <Link
            href={"/marketplace" as Route}
            className="transition-colors duration-200 ease-[var(--ease-premium)] hover:text-[#ccff00]"
          >
            {t.nav.browse}
          </Link>
          <Link
            href={"/nearby" as Route}
            className="transition-colors duration-200 ease-[var(--ease-premium)] hover:text-[#ccff00]"
          >
            {t.nav.nearby}
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={"/login" as Route}
              className="text-[13px] font-medium text-white/55 transition-colors duration-200 ease-[var(--ease-premium)] hover:text-[#ccff00]"
            >
              {t.nav.login}
            </Link>
            <Link
              href={"/listings/new" as Route}
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#1b1b1b] px-3.5 text-[13px] font-semibold text-white transition-all duration-200 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-[#202020] hover:shadow-[0_10px_22px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-0 active:scale-[0.97]"
            >
              <PlusIcon />
              {t.nav.listItem}
            </Link>
          </div>
          <LanguageSwitcher locale={locale} t={t} />
          <MobileNavMenu locale={locale} nav={t.nav} />
          <Link
            href={"/marketplace" as Route}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-[#ccff00] px-3.5 text-[13px] font-semibold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-[#deff57] hover:shadow-[0_10px_22px_rgba(204,255,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-0 active:scale-[0.97]"
          >
            <span className="sm:hidden">{t.nav.explore}</span>
            <span className="hidden sm:inline">{t.nav.startExploring}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
