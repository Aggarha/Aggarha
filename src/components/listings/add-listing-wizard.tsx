"use client";

import { useState, useTransition } from "react";
import { AvailabilityCalendar } from "@/components/marketplace/availability-preview";
import { ConditionMarkInput, type ConditionMarkDraft } from "@/components/listings/condition-mark-input";
import { ListingPreviewCard } from "@/components/listings/listing-preview-card";
import { StepIndicator } from "@/components/listings/step-indicator";
import { PremiumButton, PremiumCard, PremiumInput, PremiumSelect, PremiumTextarea } from "@/components/premium/system";
import { createListingAction } from "@/lib/listings/actions";
import { buildCategoryLabel } from "@/lib/marketplace/demo-content";
import type { Locale } from "@/lib/i18n/types";

type CategoryOption = { slug: string; name: string };
type ListingMode = "RENT" | "SWAP" | "BOTH";

const COPY = {
  en: {
    steps: ["Photos", "Condition", "Details", "Pricing & Mode", "Availability"],
    back: "Back",
    next: "Next",
    publish: "Publish listing",
    photosTitle: "Add photos",
    photosHint: "Add up to 4 photos. The first photo becomes the cover image.",
    slotAdd: "Add photo",
    slotAdded: "Photo added",
    conditionTitle: "Document condition",
    conditionHint: "Mark any scratches, dents, or missing parts so renters know exactly what to expect.",
    addMark: "+ Add another mark",
    skipDamage: "Skip — no damage to report",
    detailsTitle: "Listing details",
    titleLabel: "Title",
    titlePlaceholder: "e.g. Canon EOS R6 with 24-70mm lens",
    categoryLabel: "Category",
    categoryPlaceholder: "Select a category",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Describe your item, what's included, and any pickup details.",
    pricingTitle: "Pricing & mode",
    modeLabel: "Listing mode",
    rent: "Rent",
    swap: "Swap",
    both: "Both",
    priceLabel: "Price per day (EGP)",
    pricePlaceholder: "e.g. 350",
    swapPreferencesLabel: "What would you swap this for?",
    swapPreferencesPlaceholder: "e.g. Gaming Console, Clothes",
    cityLabel: "City",
    cityPlaceholder: "e.g. Cairo",
    availabilityTitle: "Set availability",
    availabilityHint: "Every day defaults to available. Tap a date to block it — use the arrows to plan further ahead.",
    previewLabel: "Live preview",
    publishing: "Publishing…"
  },
  ar: {
    steps: ["الصور", "الحالة", "التفاصيل", "السعر والنمط", "التوفر"],
    back: "السابق",
    next: "التالي",
    publish: "نشر الإعلان",
    photosTitle: "أضف الصور",
    photosHint: "أضف حتى 4 صور. الصورة الأولى ستكون صورة الغلاف.",
    slotAdd: "إضافة صورة",
    slotAdded: "تمت إضافة الصورة",
    conditionTitle: "وثّق الحالة",
    conditionHint: "سجّل أي خدوش أو أضرار أو أجزاء ناقصة ليعرف المستأجر بالضبط ما يتوقعه.",
    addMark: "+ إضافة علامة أخرى",
    skipDamage: "تخطي — لا يوجد ضرر لتسجيله",
    detailsTitle: "تفاصيل الإعلان",
    titleLabel: "العنوان",
    titlePlaceholder: "مثال: كانون EOS R6 مع عدسة 24-70 مم",
    categoryLabel: "الفئة",
    categoryPlaceholder: "اختر فئة",
    descriptionLabel: "الوصف",
    descriptionPlaceholder: "صف المنتج، وما هو متضمن، وأي تفاصيل استلام.",
    pricingTitle: "السعر والنمط",
    modeLabel: "نمط الإعلان",
    rent: "إيجار",
    swap: "تبادل",
    both: "كلاهما",
    priceLabel: "السعر لليوم (جنيه)",
    pricePlaceholder: "مثال: 350",
    swapPreferencesLabel: "بماذا تود استبداله؟",
    swapPreferencesPlaceholder: "مثال: جهاز ألعاب، ملابس",
    cityLabel: "المدينة",
    cityPlaceholder: "مثال: القاهرة",
    availabilityTitle: "حدد التوفر",
    availabilityHint: "كل يوم متاح افتراضيًا. اضغط على تاريخ لحجبه — استخدم الأسهم للتخطيط لوقت أبعد.",
    previewLabel: "معاينة مباشرة",
    publishing: "جارٍ النشر…"
  }
};

function nextMarkId() {
  return `mark-${Math.random().toString(36).slice(2, 9)}`;
}

export function AddListingWizard({
  categories,
  lang = "en"
}: {
  categories: CategoryOption[];
  lang?: Locale;
}) {
  const copy = COPY[lang];
  const isRtl = lang === "ar";

  const [stepIndex, setStepIndex] = useState(0);
  const [photoSlots, setPhotoSlots] = useState<boolean[]>([false, false, false, false]);
  const [skipDamage, setSkipDamage] = useState(false);
  const [marks, setMarks] = useState<ConditionMarkDraft[]>([]);
  const [title, setTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<ListingMode>("RENT");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [swapPreferences, setSwapPreferences] = useState("");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPublishing, startPublishTransition] = useTransition();

  const handlePublish = () => {
    setPublishError(null);
    startPublishTransition(async () => {
      const result = await createListingAction({
        title,
        description,
        categorySlug,
        mode,
        priceAmount: price ? Number(price) : null,
        city,
        swapPreferences: mode === "SWAP" || mode === "BOTH" ? swapPreferences : null,
        photoCount,
        conditionMarks: marks.map((mark) => ({ description: mark.description, severity: mark.severity })),
        blockedDates
      });
      if ("error" in result) {
        setPublishError(result.error);
      }
    });
  };

  const toggleAvailability = (date: Date) => {
    // Build the key from LOCAL date components, not toISOString() — that converts through UTC
    // first, which silently shifts the day by one for any timezone ahead or behind UTC.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const iso = `${year}-${month}-${day}`;
    setBlockedDates((current) => (current.includes(iso) ? current.filter((item) => item !== iso) : [...current, iso]));
  };

  const availabilityDates = blockedDates.map((iso) => ({ date: new Date(iso), status: "BLOCKED" as const }));

  const steps = copy.steps.map((label, index) => ({ key: `step-${index}`, label }));
  const photoCount = photoSlots.filter(Boolean).length;

  const modeOptions: Array<{ value: ListingMode; label: string; activeClass: string }> = [
    { value: "RENT", label: copy.rent, activeClass: "border-[#ccff00]/45 bg-[#ccff00]/12 text-[#eaff95]" },
    { value: "SWAP", label: copy.swap, activeClass: "border-[#ff8a1f]/45 bg-[#ff8a1f]/16 text-[#ffb877]" },
    { value: "BOTH", label: copy.both, activeClass: "border-white/30 bg-white/15 text-white" }
  ];

  const goNext = () => setStepIndex((value) => Math.min(value + 1, steps.length - 1));
  const goBack = () => setStepIndex((value) => Math.max(value - 1, 0));

  const addMark = () => {
    setSkipDamage(false);
    setMarks((value) => [...value, { id: nextMarkId(), description: "", severity: "minor", hasPhoto: false }]);
  };

  const updateMark = (id: string, next: ConditionMarkDraft) => {
    setMarks((value) => value.map((mark) => (mark.id === id ? next : mark)));
  };

  const removeMark = (id: string) => {
    setMarks((value) => value.filter((mark) => mark.id !== id));
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
      <StepIndicator steps={steps} activeIndex={stepIndex} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <PremiumCard className="space-y-5 bg-[#171717]">
          {stepIndex === 0 ? (
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-white">{copy.photosTitle}</h2>
                <p className="mt-1 text-sm text-white/55">{copy.photosHint}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photoSlots.map((added, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setPhotoSlots((value) => value.map((slot, slotIndex) => (slotIndex === index ? !slot : slot)))
                    }
                    className={`flex h-28 flex-col items-center justify-center gap-1 rounded-2xl border text-xs font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${
                      added
                        ? "border-[#ccff00]/40 bg-[#ccff00]/10 text-[#eaff95]"
                        : "border-dashed border-white/15 bg-white/[0.02] text-white/45 hover:border-white/30 hover:text-white/70"
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      {added ? <path d="M20 6 9 17l-5-5" /> : <path d="M12 5v14M5 12h14" />}
                    </svg>
                    {added ? copy.slotAdded : copy.slotAdd}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-white">{copy.conditionTitle}</h2>
                <p className="mt-1 text-sm text-white/55">{copy.conditionHint}</p>
              </div>

              {marks.length === 0 ? (
                <button
                  type="button"
                  onClick={() => setSkipDamage((value) => !value)}
                  className={`w-full rounded-2xl border p-4 text-sm font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${
                    skipDamage
                      ? "border-[#ccff00]/40 bg-[#ccff00]/10 text-[#eaff95]"
                      : "border-white/12 bg-white/[0.02] text-white/60 hover:text-white/85"
                  }`}
                >
                  {copy.skipDamage}
                </button>
              ) : (
                <div className="space-y-3">
                  {marks.map((mark, index) => (
                    <ConditionMarkInput
                      key={mark.id}
                      index={index + 1}
                      mark={mark}
                      onChange={(next) => updateMark(mark.id, next)}
                      onRemove={() => removeMark(mark.id)}
                      lang={lang}
                    />
                  ))}
                </div>
              )}

              {!skipDamage ? (
                <PremiumButton type="button" tone="ghost" onClick={addMark} className="w-full">
                  {copy.addMark}
                </PremiumButton>
              ) : null}
            </div>
          ) : null}

          {stepIndex === 2 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{copy.detailsTitle}</h2>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-white/60">{copy.titleLabel}</span>
                <PremiumInput
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={copy.titlePlaceholder}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-white/60">{copy.categoryLabel}</span>
                <PremiumSelect value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
                  <option value="">{copy.categoryPlaceholder}</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {buildCategoryLabel(category.slug, category.name, lang)}
                    </option>
                  ))}
                </PremiumSelect>
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-white/60">{copy.descriptionLabel}</span>
                <PremiumTextarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={copy.descriptionPlaceholder}
                />
              </label>
            </div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">{copy.pricingTitle}</h2>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-white/60">{copy.modeLabel}</span>
                <div className="grid grid-cols-3 gap-2">
                  {modeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMode(option.value)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${
                        mode === option.value ? option.activeClass : "border-white/12 bg-white/[0.02] text-white/55 hover:text-white/85"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-white/60">{copy.priceLabel}</span>
                <PremiumInput
                  type="number"
                  inputMode="numeric"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder={copy.pricePlaceholder}
                />
              </label>
              {mode === "SWAP" || mode === "BOTH" ? (
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-white/60">{copy.swapPreferencesLabel}</span>
                  <PremiumInput
                    type="text"
                    maxLength={200}
                    value={swapPreferences}
                    onChange={(event) => setSwapPreferences(event.target.value)}
                    placeholder={copy.swapPreferencesPlaceholder}
                  />
                </label>
              ) : null}
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-white/60">{copy.cityLabel}</span>
                <PremiumInput
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder={copy.cityPlaceholder}
                />
              </label>
            </div>
          ) : null}

          {stepIndex === 4 ? (
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-white">{copy.availabilityTitle}</h2>
                <p className="mt-1 text-sm text-white/55">{copy.availabilityHint}</p>
              </div>
              <AvailabilityCalendar dates={availabilityDates} lang={lang} onToggle={toggleAvailability} />
            </div>
          ) : null}

          {stepIndex === steps.length - 1 && publishError ? (
            <p className="text-center text-xs font-semibold text-[#ff9a8a]">{publishError}</p>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
            <PremiumButton type="button" tone="ghost" onClick={goBack} disabled={stepIndex === 0}>
              {copy.back}
            </PremiumButton>
            {stepIndex === steps.length - 1 ? (
              <PremiumButton type="button" tone="primary" onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? copy.publishing : copy.publish}
              </PremiumButton>
            ) : (
              <PremiumButton type="button" tone="primary" onClick={goNext}>
                {copy.next}
              </PremiumButton>
            )}
          </div>
        </PremiumCard>

        <div className="space-y-2 lg:sticky lg:top-20">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{copy.previewLabel}</p>
          <ListingPreviewCard
            title={title}
            categorySlug={categorySlug || null}
            mode={mode}
            priceAmount={price ? Number(price) : null}
            city={city}
            photoCount={photoCount}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
