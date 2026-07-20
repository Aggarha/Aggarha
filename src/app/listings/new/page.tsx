import { AddListingWizard } from "@/components/listings/add-listing-wizard";
import { requireSession } from "@/lib/auth/session";
import { getLocaleAndDictionary } from "@/lib/i18n/get-locale";
import { flattenCategories } from "@/lib/marketplace/format";
import { getCategoryTree } from "@/lib/marketplace/query";

export default async function NewListingPage() {
  await requireSession();
  const [categoryTree, { locale }] = await Promise.all([getCategoryTree(), getLocaleAndDictionary()]);
  const categories = flattenCategories(categoryTree);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <AddListingWizard categories={categories} lang={locale} />
    </div>
  );
}
