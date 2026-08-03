import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";

export default async function ForgotPasswordPage() {
  const { locale } = await getLocaleAndDictionary();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      <ForgotPasswordForm lang={locale} />
    </div>
  );
}
