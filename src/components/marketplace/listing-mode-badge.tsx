import { modeLabel } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";

export function ListingModeBadge({ mode, lang = "en" }: { mode: "RENT" | "SWAP" | "BOTH"; lang?: Locale }) {
  const classes =
    mode === "RENT"
      ? "border border-[#ccff00]/40 bg-[#ccff00]/12 text-[#eaff95]"
      : mode === "SWAP"
        ? "border border-[#ff8a1f]/45 bg-[#ff8a1f]/16 text-[#ffb877]"
        : "border border-white/20 bg-white/10 text-white";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {modeLabel(mode, lang)}
    </span>
  );
}
