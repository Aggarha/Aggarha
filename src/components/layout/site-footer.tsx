import type { Route } from "next";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#090909]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-block font-semibold uppercase tracking-[0.16em] text-white/75 hover:text-[#ccff00]"
          >
            Aggarha
          </Link>
          <p className="text-white/58 text-xs">
            Premium rental and swap marketplace with AI ranking, trust analytics, and nearby
            discovery.
          </p>
        </div>
        <div className="text-white/62 space-y-2 text-xs">
          <p className="text-white/72 font-semibold uppercase tracking-[0.14em]">Explore</p>
          <Link
            href={"/marketplace" as Route}
            className="block min-h-[44px] py-2 hover:text-[#ccff00]"
          >
            Marketplace
          </Link>
          <Link
            href={"/featured" as Route}
            className="block min-h-[44px] py-2 hover:text-[#ccff00]"
          >
            Featured Listings
          </Link>
          <Link
            href={"/collectibles" as Route}
            className="block min-h-[44px] py-2 hover:text-[#ccff00]"
          >
            Collectibles Exchange
          </Link>
          <Link
            href={"/playstation" as Route}
            className="block min-h-[44px] py-2 hover:text-[#ccff00]"
          >
            PlayStation Exchange
          </Link>
          <Link href={"/nearby" as Route} className="block min-h-[44px] py-2 hover:text-[#ccff00]">
            Nearby
          </Link>
        </div>
        <div className="text-white/62 space-y-2 text-xs">
          <p className="text-white/72 font-semibold uppercase tracking-[0.14em]">Trust</p>
          <p className="min-h-[44px] py-2">Verified sellers and renters</p>
          <p className="min-h-[44px] py-2">AI-computed trust and reputation scoring</p>
          <p className="min-h-[44px] py-2">Fraud signals and safety controls</p>
        </div>
        <div className="text-white/62 space-y-2 text-xs">
          <p className="text-white/72 font-semibold uppercase tracking-[0.14em]">App</p>
          <p className="min-h-[44px] py-2">PWA install-ready</p>
          <p className="min-h-[44px] py-2">Mobile bottom navigation</p>
          <p className="min-h-[44px] py-2">Optimized dark-first experience</p>
        </div>
      </div>
    </footer>
  );
}
