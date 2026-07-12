import Image from "next/image";
import { EmptyState, PremiumCard } from "@/components/premium/system";
import { conditionBadges, type ConditionBadgeVariant, type ConditionReport } from "@/lib/marketplace/condition-evidence";
import type { Locale } from "@/lib/i18n/types";

const BADGE_STYLES: Record<ConditionBadgeVariant, string> = {
  verified: "border-[#58f0c6]/40 bg-[#58f0c6]/14 text-[#a3ffe4]",
  clean: "border-[#ccff00]/40 bg-[#ccff00]/12 text-[#eaff95]",
  damage: "border-[#ffd27a]/40 bg-[#ffd27a]/14 text-[#ffd27a]",
  required: "border-white/15 bg-white/5 text-white/55"
};

const SEVERITY_STYLES: Record<string, string> = {
  minor: "border-[#ccff00]/40 bg-[#ccff00]/12 text-[#eaff95]",
  medium: "border-[#ffd27a]/40 bg-[#ffd27a]/14 text-[#ffd27a]",
  major: "border-[#ff9a8a]/45 bg-[#ff9a8a]/14 text-[#ffbcb0]"
};

const COPY = {
  en: {
    heading: "Condition report",
    noPhotosTitle: "No condition photos yet",
    noPhotosDescription: "The owner hasn't documented this listing's condition yet.",
    noDamage: (title: string) => `No scratches, dents, or missing parts were documented for ${title}.`,
    location: "Location",
    severity: { minor: "Minor", medium: "Medium", major: "Major" }
  },
  ar: {
    heading: "تقرير الحالة",
    noPhotosTitle: "لا توجد صور للحالة بعد",
    noPhotosDescription: "لم يوثّق المالك حالة هذا الإعلان بعد.",
    noDamage: (title: string) => `لم يتم تسجيل أي خدوش أو أضرار أو أجزاء ناقصة في ${title}.`,
    location: "الموقع",
    severity: { minor: "بسيط", medium: "متوسط", major: "كبير" }
  }
};

export function ConditionDamageReport({
  report,
  listingTitle,
  lang = "en"
}: {
  report: ConditionReport;
  listingTitle: string;
  lang?: Locale;
}) {
  const badges = conditionBadges(report);
  const copy = COPY[lang];
  const isRtl = lang === "ar";

  return (
    <PremiumCard dir={isRtl ? "rtl" : "ltr"} className={`space-y-4 bg-[#171717] ${isRtl ? "text-right" : "text-left"}`}>
      <p className="text-sm font-bold text-white">{copy.heading}</p>

      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span
            key={badge.label}
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${BADGE_STYLES[badge.variant]}`}
          >
            {badge.label}
          </span>
        ))}
      </div>

      {report.status === "photos_required" ? (
        <EmptyState title={copy.noPhotosTitle} description={copy.noPhotosDescription} />
      ) : report.status === "verified_no_damage" ? (
        <div className="rounded-2xl border border-[#ccff00]/25 bg-[#ccff00]/[0.05] p-4 text-sm text-white/75">
          {copy.noDamage(listingTitle)}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {report.evidence.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
              <div className="relative h-36 w-full">
                <Image
                  src={item.photoUrl}
                  alt={`${item.defectLabel} evidence on ${listingTitle}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="space-y-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{item.defectLabel}</p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${SEVERITY_STYLES[item.severity]}`}
                  >
                    {copy.severity[item.severity as "minor" | "medium" | "major"]}
                  </span>
                </div>
                <p className="text-xs text-white/65">{item.description}</p>
                <p className="text-[11px] uppercase tracking-wide text-white/45">
                  {copy.location}: {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PremiumCard>
  );
}
