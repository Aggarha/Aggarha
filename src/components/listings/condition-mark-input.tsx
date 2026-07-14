"use client";

import type { DefectSeverity } from "@/lib/marketplace/condition-evidence";
import type { Locale } from "@/lib/i18n/types";

export type ConditionMarkDraft = {
  id: string;
  description: string;
  severity: DefectSeverity;
  hasPhoto: boolean;
};

const SEVERITY_STYLES: Record<DefectSeverity, string> = {
  minor: "border-[#ccff00]/40 bg-[#ccff00]/12 text-[#eaff95]",
  medium: "border-[#ffd27a]/40 bg-[#ffd27a]/14 text-[#ffd27a]",
  major: "border-[#ff9a8a]/45 bg-[#ff9a8a]/14 text-[#ffbcb0]"
};

const COPY = {
  en: {
    markLabel: (index: number) => `Mark ${index}`,
    addPhoto: "Add photo",
    photoAdded: "Photo added",
    descriptionPlaceholder: "Describe the mark (e.g. small scratch on the back panel)",
    severity: { minor: "Minor", medium: "Medium", major: "Major" } as Record<DefectSeverity, string>,
    remove: "Remove"
  },
  ar: {
    markLabel: (index: number) => `العلامة ${index}`,
    addPhoto: "إضافة صورة",
    photoAdded: "تمت إضافة الصورة",
    descriptionPlaceholder: "صف العلامة (مثال: خدش صغير في اللوحة الخلفية)",
    severity: { minor: "بسيط", medium: "متوسط", major: "كبير" } as Record<DefectSeverity, string>,
    remove: "إزالة"
  }
};

export function ConditionMarkInput({
  index,
  mark,
  onChange,
  onRemove,
  lang = "en"
}: {
  index: number;
  mark: ConditionMarkDraft;
  onChange: (next: ConditionMarkDraft) => void;
  onRemove: () => void;
  lang?: Locale;
}) {
  const copy = COPY[lang];
  const severities: DefectSeverity[] = ["minor", "medium", "major"];

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141414] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-white">{copy.markLabel(index)}</p>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold text-white/45 transition-colors hover:text-[#ff9a8a]"
        >
          {copy.remove}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onChange({ ...mark, hasPhoto: !mark.hasPhoto })}
        className={`flex h-24 w-full items-center justify-center rounded-xl border text-xs font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${
          mark.hasPhoto
            ? "border-[#ccff00]/40 bg-[#ccff00]/10 text-[#eaff95]"
            : "border-dashed border-white/15 bg-white/[0.02] text-white/45 hover:border-white/30 hover:text-white/70"
        }`}
      >
        {mark.hasPhoto ? copy.photoAdded : copy.addPhoto}
      </button>

      <textarea
        value={mark.description}
        onChange={(event) => onChange({ ...mark, description: event.target.value })}
        placeholder={copy.descriptionPlaceholder}
        rows={2}
        className="placeholder:text-white/38 w-full resize-none rounded-xl border border-white/[0.1] bg-[#101010] px-3 py-2 text-sm text-white transition-all duration-200 ease-[var(--ease-premium)] focus:border-[#ccff00] focus:outline-none focus:ring-2 focus:ring-[#ccff00]/25"
      />

      <div className="flex flex-wrap gap-2">
        {severities.map((severity) => (
          <button
            key={severity}
            type="button"
            onClick={() => onChange({ ...mark, severity })}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 ease-[var(--ease-premium)] ${
              mark.severity === severity ? SEVERITY_STYLES[severity] : "border-white/12 bg-white/[0.03] text-white/50 hover:text-white/80"
            }`}
          >
            {copy.severity[severity]}
          </button>
        ))}
      </div>
    </div>
  );
}
