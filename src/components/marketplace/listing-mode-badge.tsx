import { modeLabel } from "@/lib/marketplace/format";
import type { Locale } from "@/lib/i18n/types";

const CHIP = "inline-flex rounded-full px-2.5 py-1 text-xs font-bold tracking-wide";
const RENT_CLASS = `${CHIP} border border-[#ccff00]/55 bg-black/72 text-[#ccff00]`;
const SWAP_CLASS = `${CHIP} border border-[#ff8a1f]/55 bg-black/72 text-[#ff8a1f]`;

export function ListingModeBadge({ mode, lang = "en" }: { mode: "RENT" | "SWAP" | "BOTH"; lang?: Locale }) {
  if (mode === "BOTH") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className={RENT_CLASS}>{modeLabel("RENT", lang)}</span>
        <span className={SWAP_CLASS}>{modeLabel("SWAP", lang)}</span>
      </span>
    );
  }

  return <span className={mode === "RENT" ? RENT_CLASS : SWAP_CLASS}>{modeLabel(mode, lang)}</span>;
}
