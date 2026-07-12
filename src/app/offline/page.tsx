import { PremiumBadge } from "@/components/premium/system";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";

export default async function OfflinePage() {
  const { locale, t } = await getLocaleAndDictionary();

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <PremiumBadge>{t.offline.badge}</PremiumBadge>
      <h1 className="text-3xl font-black text-white sm:text-4xl">{t.offline.title}</h1>
      <p className="max-w-md text-sm text-white/65">{t.offline.message}</p>
    </div>
  );
}
