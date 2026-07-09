import { verificationLabel } from "@/lib/marketplace/format";

export function VerificationBadge({ level }: { level: string }) {
  const normalized = level.toUpperCase();
  const classes =
    normalized === "UNVERIFIED"
      ? "border border-white/15 bg-white/5 text-white/55"
      : normalized === "PROFESSIONAL_SELLER" || normalized === "BUSINESS_VERIFIED"
        ? "border border-[#58f0c6]/50 bg-[#58f0c6]/20 text-[#c8fff0]"
        : "border border-[#58f0c6]/30 bg-[#58f0c6]/12 text-[#a3ffe4]";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {verificationLabel(level as never)}
    </span>
  );
}
