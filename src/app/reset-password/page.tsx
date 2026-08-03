import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { EmptyState } from "@/components/premium/system";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";

const COPY = {
  en: { missingTokenTitle: "Invalid reset link", missingTokenDescription: "Request a new password reset link and try again." },
  ar: { missingTokenTitle: "رابط إعادة تعيين غير صالح", missingTokenDescription: "اطلب رابط إعادة تعيين جديدًا وحاول مرة أخرى." }
};

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ locale }, { token }] = await Promise.all([getLocaleAndDictionary(), searchParams]);
  const copy = COPY[locale];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      {token ? (
        <ResetPasswordForm token={token} lang={locale} />
      ) : (
        <EmptyState title={copy.missingTokenTitle} description={copy.missingTokenDescription} />
      )}
    </div>
  );
}
