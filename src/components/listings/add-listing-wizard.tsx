"use client";

import { useState, useTransition } from "react";
import { AvailabilityCalendar } from "@/components/marketplace/availability-preview";
import { ConditionMarkInput, type ConditionMarkDraft } from "@/components/listings/condition-mark-input";
import { ListingPreviewCard } from "@/components/listings/listing-preview-card";
import { StepIndicator } from "@/components/listings/step-indicator";
import { PremiumButton, PremiumCard, PremiumInput, PremiumSelect, PremiumTextarea } from "@/components/premium/system";
import { createListingAction } from "@/lib/listings/actions";
import { buildCategoryLabel } from "@/lib/marketplace/demo-content";
import { uploadListingPhoto } from "@/lib/listings/upload-client";
import type { Locale } from "@/lib/i18n/types";

type CategoryOption = { slug: string; name: string; children: CategoryOption[] };
type ListingMode = "RENT" | "SWAP" | "BOTH";

type PhotoDraft = {
  id: string;
  previewUrl: string;
  status: "uploading" | "done" | "error";
  uploadedUrl: string | null;
  errorMessage: string | null;
  isMain: boolean;
};

const MAX_PHOTOS = 4;
const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 500;

const COPY = {
  en: {
    steps: ["Photos", "Condition", "Details", "Pricing & Mode", "Availability"],
    back: "Back",
    next: "Next",
    publish: "Publish listing",
    photosTitle: "Add photos",
    photosHint: "Add up to 4 photos. The first photo becomes the cover image.",
    slotAdd: "Add photo",
    uploadingLabel: "Uploading…",
    mainBadgeLabel: "Main",
    setMainLabel: "Set as main",
    removeLabel: "Remove",
    uploadErrors: {
      invalid_type: "Unsupported file type",
      too_large: "File is larger than 5MB",
      presign_failed: "Could not start upload",
      upload_failed: "Upload failed"
    },
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
    priceLabel: "Value range per day (EGP)",
    minPricePlaceholder: "Min, e.g. 300",
    maxPricePlaceholder: "Max, e.g. 500",
    priceRangeError: "Max must be greater than or equal to min.",
    swapPreferencesLabel: "What would you swap this for?",
    swapPreferencesPlaceholder: "e.g. Gaming Console, Clothes",
    cityLabel: "City",
    cityPlaceholder: "e.g. Cairo",
    availabilityTitle: "Set availability",
    availabilityHint: "Every day defaults to available. Tap a date to block it — use the arrows to plan further ahead.",
    previewLabel: "Live preview",
    publishing: "Publishing…",
    waitForUploads: "Wait for photo uploads to finish before publishing.",
    optionalTag: "(Optional)",
    titleRequiredError: "Title is required.",
    categoryRequiredError: "Please select a category.",
    photoRequiredError: "Add at least one photo before publishing.",
    charCount: (count: number, max: number) => `${count}/${max}`
  },
  ar: {
    steps: ["الصور", "الحالة", "التفاصيل", "السعر والنمط", "التوفر"],
    back: "السابق",
    next: "التالي",
    publish: "نشر الإعلان",
    photosTitle: "أضف الصور",
    photosHint: "أضف حتى 4 صور. الصورة الأولى ستكون صورة الغلاف.",
    slotAdd: "إضافة صورة",
    uploadingLabel: "جارٍ الرفع…",
    mainBadgeLabel: "الرئيسية",
    setMainLabel: "تعيين كرئيسية",
    removeLabel: "إزالة",
    uploadErrors: {
      invalid_type: "نوع الملف غير مدعوم",
      too_large: "حجم الملف أكبر من 5 ميجابايت",
      presign_failed: "تعذر بدء الرفع",
      upload_failed: "فشل الرفع"
    },
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
    priceLabel: "نطاق السعر لليوم (جنيه)",
    minPricePlaceholder: "الحد الأدنى، مثال: 300",
    maxPricePlaceholder: "الحد الأقصى، مثال: 500",
    priceRangeError: "يجب أن يكون الحد الأقصى أكبر من أو يساوي الحد الأدنى.",
    swapPreferencesLabel: "بماذا تود استبداله؟",
    swapPreferencesPlaceholder: "مثال: جهاز ألعاب، ملابس",
    cityLabel: "المدينة",
    cityPlaceholder: "مثال: القاهرة",
    availabilityTitle: "حدد التوفر",
    availabilityHint: "كل يوم متاح افتراضيًا. اضغط على تاريخ لحجبه — استخدم الأسهم للتخطيط لوقت أبعد.",
    previewLabel: "معاينة مباشرة",
    publishing: "جارٍ النشر…",
    waitForUploads: "يرجى الانتظار حتى تنتهي عمليات رفع الصور قبل النشر.",
    optionalTag: "(اختياري)",
    titleRequiredError: "العنوان مطلوب.",
    categoryRequiredError: "يرجى اختيار فئة.",
    photoRequiredError: "أضف صورة واحدة على الأقل قبل النشر.",
    charCount: (count: number, max: number) => `${count}/${max}`
  }
};

function nextMarkId() {
  return `mark-${Math.random().toString(36).slice(2, 9)}`;
}

function nextPhotoId() {
  return `photo-${Math.random().toString(36).slice(2, 9)}`;
}

function RequirementTag({ required, optionalLabel }: { required: boolean; optionalLabel: string }) {
  return required ? (
    <span className="ml-1 text-[#ff9a8a]">*</span>
  ) : (
    <span className="ml-1 font-normal text-white/35">{optionalLabel}</span>
  );
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
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [skipDamage, setSkipDamage] = useState(false);
  const [marks, setMarks] = useState<ConditionMarkDraft[]>([]);
  const [title, setTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<ListingMode>("RENT");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [city, setCity] = useState("");
  const [swapPreferences, setSwapPreferences] = useState("");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [detailsStepAttempted, setDetailsStepAttempted] = useState(false);
  const [photoStepAttempted, setPhotoStepAttempted] = useState(false);
  const [isPublishing, startPublishTransition] = useTransition();

  const uploadedPhotos = photos.filter(
    (photo): photo is PhotoDraft & { uploadedUrl: string } => photo.status === "done" && photo.uploadedUrl !== null
  );
  const photoError = uploadedPhotos.length > 0 ? null : copy.photoRequiredError;
  const titleError = title.trim() ? null : copy.titleRequiredError;
  const categoryError = categorySlug ? null : copy.categoryRequiredError;
  const hasDetailsErrors = Boolean(titleError || categoryError);
  const priceRangeError =
    minPrice && maxPrice && Number(maxPrice) < Number(minPrice) ? copy.priceRangeError : null;

  const handlePublish = () => {
    if (photoError) {
      setPhotoStepAttempted(true);
      setStepIndex(0);
      return;
    }
    if (hasDetailsErrors) {
      setDetailsStepAttempted(true);
      setStepIndex(2);
      return;
    }
    if (priceRangeError) {
      setStepIndex(3);
      return;
    }
    setPublishError(null);
    startPublishTransition(async () => {
      const result = await createListingAction({
        title,
        description,
        categorySlug,
        mode,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        city,
        swapPreferences: mode === "SWAP" || mode === "BOTH" ? swapPreferences : null,
        photos: uploadedPhotos.map((photo) => ({ url: photo.uploadedUrl, isMain: photo.isMain })),
        conditionMarks: marks.map((mark) => ({ description: mark.description, severity: mark.severity })),
        blockedDates
      });
      if ("error" in result) {
        setPublishError(result.error);
      }
    });
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).slice(0, MAX_PHOTOS - photos.length);

    files.forEach((file) => {
      const id = nextPhotoId();
      const previewUrl = URL.createObjectURL(file);
      setPhotos((current) => [
        ...current,
        { id, previewUrl, status: "uploading", uploadedUrl: null, errorMessage: null, isMain: current.length === 0 }
      ]);

      uploadListingPhoto(file).then((result) => {
        if ("error" in result) {
          setPhotos((current) =>
            current.map((photo) =>
              photo.id === id ? { ...photo, status: "error", errorMessage: copy.uploadErrors[result.error] } : photo
            )
          );
          return;
        }
        setPhotos((current) =>
          current.map((photo) => (photo.id === id ? { ...photo, status: "done", uploadedUrl: result.url } : photo))
        );
      });
    });
  };

  const setMainPhoto = (id: string) => {
    setPhotos((current) => current.map((photo) => ({ ...photo, isMain: photo.id === id })));
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const wasMain = current.find((photo) => photo.id === id)?.isMain ?? false;
      const remaining = current.filter((photo) => photo.id !== id);
      if (wasMain && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isMain: true };
      }
      return remaining;
    });
  };

  const movePhoto = (id: string, direction: -1 | 1) => {
    setPhotos((current) => {
      const index = current.findIndex((photo) => photo.id === id);
      const targetIndex = index + direction;
      if (index === -1 || targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
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
  const photoCount = photos.length;
  const hasUploadingPhoto = photos.some((photo) => photo.status === "uploading");
  const mainPhotoUrl = photos.find((photo) => photo.status === "done" && photo.isMain)?.uploadedUrl ?? null;

  const modeOptions: Array<{ value: ListingMode; label: string; activeClass: string }> = [
    { value: "RENT", label: copy.rent, activeClass: "border-[#ccff00]/45 bg-[#ccff00]/12 text-[#eaff95]" },
    { value: "SWAP", label: copy.swap, activeClass: "border-[#ff8a1f]/45 bg-[#ff8a1f]/16 text-[#ffb877]" },
    { value: "BOTH", label: copy.both, activeClass: "border-white/30 bg-white/15 text-white" }
  ];

  const goNext = () => {
    if (stepIndex === 0 && photoError) {
      setPhotoStepAttempted(true);
      return;
    }
    if (stepIndex === 2 && hasDetailsErrors) {
      setDetailsStepAttempted(true);
      return;
    }
    setStepIndex((value) => Math.min(value + 1, steps.length - 1));
  };
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
                <h2 className="text-lg font-bold text-white">
                  {copy.photosTitle}
                  <RequirementTag required optionalLabel={copy.optionalTag} />
                </h2>
                <p className="mt-1 text-sm text-white/55">{copy.photosHint}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`relative flex h-28 flex-col items-center justify-center overflow-hidden rounded-2xl border text-xs font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${
                      photo.status === "error"
                        ? "border-[#ff9a8a]/40 bg-[#ff9a8a]/10 text-[#ff9a8a]"
                        : "border-[#ccff00]/40 bg-[#ccff00]/10"
                    }`}
                  >
                    {photo.status === "error" ? (
                      <>
                        <span className="px-2 text-center">{photo.errorMessage}</span>
                        <button type="button" onClick={() => removePhoto(photo.id)} className="mt-1 underline">
                          {copy.removeLabel}
                        </button>
                      </>
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview / freshly-uploaded R2 asset, not an optimizable static asset */}
                        <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
                        {photo.status === "uploading" ? (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[11px] text-white">
                            {copy.uploadingLabel}
                          </span>
                        ) : (
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/60 px-1.5 py-1">
                            {photo.isMain ? (
                              <span className="text-[10px] font-bold text-[#ccff00]">{copy.mainBadgeLabel}</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setMainPhoto(photo.id)}
                                className="text-[10px] text-white/70 hover:text-white"
                              >
                                {copy.setMainLabel}
                              </button>
                            )}
                            <div className="flex items-center gap-1.5 text-white/70">
                              {index > 0 ? (
                                <button type="button" onClick={() => movePhoto(photo.id, -1)} className="hover:text-white">
                                  ←
                                </button>
                              ) : null}
                              {index < photos.length - 1 ? (
                                <button type="button" onClick={() => movePhoto(photo.id, 1)} className="hover:text-white">
                                  →
                                </button>
                              ) : null}
                              <button type="button" onClick={() => removePhoto(photo.id)} className="hover:text-white">
                                ✕
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                {photos.length < MAX_PHOTOS ? (
                  <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-xs font-semibold text-white/45 transition-all duration-200 ease-[var(--ease-premium)] hover:border-white/30 hover:text-white/70">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    {copy.slotAdd}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        handleFilesSelected(event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </label>
                ) : null}
              </div>
              {photoStepAttempted && photoError ? (
                <p className="text-xs font-semibold text-[#ff9a8a]">{photoError}</p>
              ) : null}
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {copy.conditionTitle}
                  <RequirementTag required={false} optionalLabel={copy.optionalTag} />
                </h2>
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
                <span className="text-xs font-semibold text-white/60">
                  {copy.titleLabel}
                  <RequirementTag required optionalLabel={copy.optionalTag} />
                </span>
                <PremiumInput
                  type="text"
                  value={title}
                  maxLength={MAX_TITLE_LENGTH}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={copy.titlePlaceholder}
                />
                <p className={`${isRtl ? "text-left" : "text-right"} text-[11px] text-white/35`}>
                  {copy.charCount(title.length, MAX_TITLE_LENGTH)}
                </p>
                {detailsStepAttempted && titleError ? (
                  <p className="text-xs font-semibold text-[#ff9a8a]">{titleError}</p>
                ) : null}
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-white/60">
                  {copy.categoryLabel}
                  <RequirementTag required optionalLabel={copy.optionalTag} />
                </span>
                <PremiumSelect value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
                  <option value="">{copy.categoryPlaceholder}</option>
                  {categories.map((category) =>
                    category.children.length > 0 ? (
                      <optgroup key={category.slug} label={buildCategoryLabel(category.slug, category.name, lang)}>
                        <option value={category.slug}>{buildCategoryLabel(category.slug, category.name, lang)}</option>
                        {category.children.map((child) => (
                          <option key={child.slug} value={child.slug}>
                            {buildCategoryLabel(child.slug, child.name, lang)}
                          </option>
                        ))}
                      </optgroup>
                    ) : (
                      <option key={category.slug} value={category.slug}>
                        {buildCategoryLabel(category.slug, category.name, lang)}
                      </option>
                    )
                  )}
                </PremiumSelect>
                {detailsStepAttempted && categoryError ? (
                  <p className="text-xs font-semibold text-[#ff9a8a]">{categoryError}</p>
                ) : null}
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-white/60">
                  {copy.descriptionLabel}
                  <RequirementTag required={false} optionalLabel={copy.optionalTag} />
                </span>
                <PremiumTextarea
                  rows={4}
                  value={description}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={copy.descriptionPlaceholder}
                />
                <p className={`${isRtl ? "text-left" : "text-right"} text-[11px] text-white/35`}>
                  {copy.charCount(description.length, MAX_DESCRIPTION_LENGTH)}
                </p>
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
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-white/60">
                  {copy.priceLabel}
                  <RequirementTag required={false} optionalLabel={copy.optionalTag} />
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <PremiumInput
                    type="number"
                    inputMode="numeric"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder={copy.minPricePlaceholder}
                  />
                  <PremiumInput
                    type="number"
                    inputMode="numeric"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder={copy.maxPricePlaceholder}
                  />
                </div>
                {priceRangeError ? <p className="text-xs font-semibold text-[#ff9a8a]">{priceRangeError}</p> : null}
              </div>
              {mode === "SWAP" || mode === "BOTH" ? (
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-white/60">
                    {copy.swapPreferencesLabel}
                    <RequirementTag required={false} optionalLabel={copy.optionalTag} />
                  </span>
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
                <span className="text-xs font-semibold text-white/60">
                  {copy.cityLabel}
                  <RequirementTag required={false} optionalLabel={copy.optionalTag} />
                </span>
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
                <h2 className="text-lg font-bold text-white">
                  {copy.availabilityTitle}
                  <RequirementTag required={false} optionalLabel={copy.optionalTag} />
                </h2>
                <p className="mt-1 text-sm text-white/55">{copy.availabilityHint}</p>
              </div>
              <AvailabilityCalendar dates={availabilityDates} lang={lang} onToggle={toggleAvailability} />
            </div>
          ) : null}

          {stepIndex === steps.length - 1 && hasUploadingPhoto ? (
            <p className="text-center text-xs font-semibold text-white/55">{copy.waitForUploads}</p>
          ) : null}

          {stepIndex === steps.length - 1 && publishError ? (
            <p className="text-center text-xs font-semibold text-[#ff9a8a]">{publishError}</p>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
            <PremiumButton type="button" tone="ghost" onClick={goBack} disabled={stepIndex === 0}>
              {copy.back}
            </PremiumButton>
            {stepIndex === steps.length - 1 ? (
              <PremiumButton type="button" tone="primary" onClick={handlePublish} disabled={isPublishing || hasUploadingPhoto}>
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
            minPrice={minPrice ? Number(minPrice) : null}
            maxPrice={maxPrice ? Number(maxPrice) : null}
            city={city}
            photoCount={photoCount}
            mainPhotoUrl={mainPhotoUrl}
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
