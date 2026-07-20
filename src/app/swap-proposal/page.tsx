import { SwapProposalForm } from "@/components/marketplace/swap-proposal-form";
import { requireSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";

export default async function SwapProposalPage() {
  await requireSession();
  const { locale } = await getLocaleAndDictionary();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <SwapProposalForm lang={locale} />
    </div>
  );
}
