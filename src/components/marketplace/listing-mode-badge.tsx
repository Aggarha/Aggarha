import { modeLabel } from "@/lib/marketplace/format";

export function ListingModeBadge({ mode }: { mode: "RENT" | "SWAP" | "BOTH" }) {
  const classes =
    mode === "RENT"
      ? "bg-teal-700 text-white"
      : mode === "SWAP"
        ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300"
        : "bg-slate-900 text-white";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{modeLabel(mode)}</span>;
}
