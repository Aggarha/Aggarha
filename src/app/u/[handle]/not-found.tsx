import type { Route } from "next";
import Link from "next/link";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";

export default async function ProfileNotFound() {
  const { locale, t } = await getLocaleAndDictionary();

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-3 px-4 text-center"
    >
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-black text-white">
        {t.profile.notFoundTitle}
      </h1>
      <p className="text-sm text-white/60">{t.profile.notFoundDescription}</p>
      <Link
        href={"/marketplace" as Route}
        className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-[#ccff00] px-5 text-sm font-bold text-black transition-all duration-200 ease-[var(--ease-premium)] hover:bg-[#deff57] active:scale-[0.97]"
      >
        {t.common.browseMarketplace}
      </Link>
    </div>
  );
}
