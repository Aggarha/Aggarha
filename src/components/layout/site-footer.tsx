import type { Route } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/types";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const links: Array<{ href: Route; label: string }> = [
    { href: "/marketplace" as Route, label: t.nav.browse },
    { href: "/featured" as Route, label: t.nav.featured },
    { href: "/collectibles" as Route, label: t.nav.collectibles },
    { href: "/playstation" as Route, label: t.nav.playstation }
  ];

  return (
    <footer dir={locale === "ar" ? "rtl" : "ltr"} className="border-t border-white/[0.05] bg-[#090909]">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-white/45 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold uppercase tracking-[0.16em] text-white/60 hover:text-[#ccff00]">
          Aggarha
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white/80">
              {link.label}
            </Link>
          ))}
        </nav>
        <p>{t.footer.rights(new Date().getFullYear())}</p>
      </div>
    </footer>
  );
}
