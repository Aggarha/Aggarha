import type { Locale } from "@/lib/i18n/types";

/**
 * Egypt's 27 governorates. `value` is the English name and is what gets stored in
 * Location.governorate / Location.city; `ar` is the display label for the Arabic UI.
 */
export const EGYPT_GOVERNORATES = [
  { value: "Cairo", ar: "القاهرة" },
  { value: "Giza", ar: "الجيزة" },
  { value: "Alexandria", ar: "الإسكندرية" },
  { value: "Qalyubia", ar: "القليوبية" },
  { value: "Sharqia", ar: "الشرقية" },
  { value: "Dakahlia", ar: "الدقهلية" },
  { value: "Gharbia", ar: "الغربية" },
  { value: "Monufia", ar: "المنوفية" },
  { value: "Beheira", ar: "البحيرة" },
  { value: "Kafr El Sheikh", ar: "كفر الشيخ" },
  { value: "Damietta", ar: "دمياط" },
  { value: "Port Said", ar: "بورسعيد" },
  { value: "Ismailia", ar: "الإسماعيلية" },
  { value: "Suez", ar: "السويس" },
  { value: "North Sinai", ar: "شمال سيناء" },
  { value: "South Sinai", ar: "جنوب سيناء" },
  { value: "Faiyum", ar: "الفيوم" },
  { value: "Beni Suef", ar: "بني سويف" },
  { value: "Minya", ar: "المنيا" },
  { value: "Asyut", ar: "أسيوط" },
  { value: "Sohag", ar: "سوهاج" },
  { value: "Qena", ar: "قنا" },
  { value: "Luxor", ar: "الأقصر" },
  { value: "Aswan", ar: "أسوان" },
  { value: "Red Sea", ar: "البحر الأحمر" },
  { value: "New Valley", ar: "الوادي الجديد" },
  { value: "Matrouh", ar: "مطروح" }
] as const;

export const EGYPT_GOVERNORATE_VALUES: ReadonlySet<string> = new Set(EGYPT_GOVERNORATES.map((item) => item.value));

export const EGYPT_GOVERNORATE_LABELS_AR: Record<string, string> = Object.fromEntries(
  EGYPT_GOVERNORATES.map((item) => [item.value, item.ar])
);

export function governorateLabel(value: string, locale: Locale): string {
  return locale === "ar" ? (EGYPT_GOVERNORATE_LABELS_AR[value] ?? value) : value;
}
