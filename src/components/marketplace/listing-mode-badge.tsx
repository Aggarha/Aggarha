import { modeLabel } from "@/lib/marketplace/format";

export function ListingModeBadge({ mode }: { mode: "RENT" | "SWAP" | "BOTH" }) {
  const classes =
    mode === "RENT"
      ? "border border-[#58f0c6]/40 bg-[#58f0c6]/14 text-[#a3ffe4]"
      : mode === "SWAP"
        ? "border border-[#ffd27a]/40 bg-[#ffd27a]/14 text-[#ffd27a]"
        : "border border-white/20 bg-white/10 text-white";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {modeLabel(mode)}
    </span>
  );
}
