import { verificationLabel } from "@/lib/marketplace/format";

export function VerificationBadge({ level }: { level: string }) {
  const normalized = level.toUpperCase();
  const classes =
    normalized === "UNVERIFIED"
      ? "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      : normalized === "PROFESSIONAL_SELLER" || normalized === "BUSINESS_VERIFIED"
        ? "bg-emerald-700 text-white"
        : "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {verificationLabel(level as never)}
    </span>
  );
}
