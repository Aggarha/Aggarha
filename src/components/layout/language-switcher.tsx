import { setLocale } from "@/lib/i18n/set-locale";
import type { Locale } from "@/lib/i18n/types";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

/** Zero client JS — two server-action-bound buttons, no dropdown state needed for a 2-option switch. */
export function LanguageSwitcher({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-[11px] font-semibold"
      aria-label={t.language.label}
    >
      <form action={setLocale.bind(null, "en")}>
        <button
          type="submit"
          aria-current={locale === "en"}
          className={`rounded-full px-2.5 py-1.5 transition-all duration-200 ease-[var(--ease-premium)] ${
            locale === "en" ? "bg-[#ccff00] text-black" : "text-white/55 hover:text-white"
          }`}
        >
          EN
        </button>
      </form>
      <form action={setLocale.bind(null, "ar")}>
        <button
          type="submit"
          aria-current={locale === "ar"}
          className={`rounded-full px-2.5 py-1.5 transition-all duration-200 ease-[var(--ease-premium)] ${
            locale === "ar" ? "bg-[#ccff00] text-black" : "text-white/55 hover:text-white"
          }`}
        >
          ع
        </button>
      </form>
    </div>
  );
}
