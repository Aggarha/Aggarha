import type { Route } from "next";
import Link from "next/link";
import { PremiumBadge } from "@/components/premium/system";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";

export default async function NotFound() {
  const { locale, t } = await getLocaleAndDictionary();

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <PremiumBadge>{t.notFound.badge}</PremiumBadge>
      <h1 className="text-3xl font-black text-white sm:text-4xl">{t.notFound.title}</h1>
      <p className="max-w-md text-sm text-white/65">{t.notFound.message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-[#ccff00] px-5 py-2.5 text-sm font-semibold text-black transition duration-300 hover:bg-[#deff57] active:scale-[0.98]"
        >
          {t.common.backToHome}
        </Link>
        <Link
          href={"/marketplace" as Route}
          className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-[#1b1b1b] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#202020] active:scale-[0.98]"
        >
          {t.common.browseMarketplace}
        </Link>
      </div>
    </div>
  );
}
