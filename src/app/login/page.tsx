import { AuthCard } from "@/components/auth/auth-card";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";

export default async function LoginPage() {
  const { locale } = await getLocaleAndDictionary();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      <AuthCard lang={locale} />
    </div>
  );
}
