import { FilterPanel, PremiumButton, PremiumInput, PremiumSelect } from "@/components/premium/system";
import { buildCategoryLabel } from "@/lib/marketplace/demo-content";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Locale } from "@/lib/i18n/types";

type CategoryOption = { slug: string; name: string };

export function HomepageSearchBar({
  categories,
  locale,
  t
}: {
  categories: CategoryOption[];
  locale: Locale;
  t: Dictionary["marketplace"];
}) {
  const isRtl = locale === "ar";

  return (
    <form action="/marketplace" dir={isRtl ? "rtl" : "ltr"}>
      <FilterPanel className="bg-[#141414] p-3">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center">
          <PremiumInput
            type="text"
            name="keyword"
            aria-label={t.searchPlaceholder}
            placeholder={t.searchPlaceholder}
            className="col-span-2 lg:col-span-1"
          />
          <PremiumSelect name="category" aria-label={t.allCategories} defaultValue="">
            <option value="">{t.allCategories}</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {buildCategoryLabel(category.slug, category.name, locale)}
              </option>
            ))}
          </PremiumSelect>
          <PremiumInput type="text" name="city" aria-label={t.locationPlaceholder} placeholder={t.locationPlaceholder} />
          <PremiumButton type="submit" tone="primary" className="col-span-2 w-full lg:col-span-1 lg:w-auto">
            {t.search}
          </PremiumButton>
        </div>
      </FilterPanel>
    </form>
  );
}
