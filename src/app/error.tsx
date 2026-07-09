"use client";

import Link from "next/link";
import { PremiumBadge } from "@/components/premium/system";

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <PremiumBadge>Something broke</PremiumBadge>
      <h1 className="text-3xl font-black text-white sm:text-4xl">
        This part of Aggarha hit a snag.
      </h1>
      <p className="max-w-md text-sm text-white/65">
        Our AI Brain didn&apos;t see this one coming. Try again, or head back while we sort it out.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-[#ccff00] px-5 py-2.5 text-sm font-semibold text-black transition duration-300 hover:bg-[#deff57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98]"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-[#1b1b1b] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#202020] active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
