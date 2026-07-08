import type { Route } from "next";
import Link from "next/link";
import { PremiumBadge } from "@/components/premium/system";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <PremiumBadge>404</PremiumBadge>
      <h1 className="text-3xl font-black text-white sm:text-4xl">
        This page wandered off the marketplace.
      </h1>
      <p className="max-w-md text-sm text-white/65">
        The listing, page, or link you followed may have been removed, renamed, or never existed.
        Let&apos;s get you back to discovering trusted rentals and swaps.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-[#ccff00] px-5 py-2.5 text-sm font-semibold text-black transition duration-300 hover:bg-[#deff57] active:scale-[0.98]"
        >
          Back to Home
        </Link>
        <Link
          href={"/marketplace" as Route}
          className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 bg-[#1b1b1b] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#202020] active:scale-[0.98]"
        >
          Browse Marketplace
        </Link>
      </div>
    </div>
  );
}
