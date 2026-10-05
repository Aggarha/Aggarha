import type { Route } from "next";
import Link from "next/link";
import { ComingSoonTag } from "@/components/premium/system";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/types";

const COPY = {
  en: {
    eyebrow: "Aggarha Admin",
    dashboard: "Dashboard",
    listings: "Listings",
    users: "Users",
    banners: "Banners",
    reports: "Reports"
  },
  ar: {
    eyebrow: "لوحة تحكم اجّرها",
    dashboard: "الرئيسية",
    listings: "الإعلانات",
    users: "المستخدمون",
    banners: "البانرات",
    reports: "البلاغات"
  }
};

const itemBase =
  "flex min-h-[44px] items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ease-[var(--ease-premium)]";

export function AdminSidebar({ lang = "en" }: { lang?: Locale }) {
  const copy = COPY[lang];
  const isRtl = lang === "ar";

  return (
    <aside
      dir={isRtl ? "rtl" : "ltr"}
      className="w-full shrink-0 space-y-4 rounded-3xl border border-white/[0.06] bg-[#151515] p-4 lg:sticky lg:top-6 lg:w-60"
    >
      <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{copy.eyebrow}</p>

      <nav aria-label="Admin navigation" className="space-y-1.5">
        <Link
          href={"/admin" as Route}
          className={cn(itemBase, "bg-[#ccff00] text-black hover:bg-[#deff57]")}
        >
          {copy.dashboard}
        </Link>

        {[copy.listings, copy.users, copy.banners, copy.reports].map((label) => (
          <span
            key={label}
            aria-disabled="true"
            className={cn(itemBase, "cursor-not-allowed text-white/35")}
          >
            {label}
            <ComingSoonTag />
          </span>
        ))}
      </nav>
    </aside>
  );
}
