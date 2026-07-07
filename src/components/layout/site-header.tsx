import type { Route } from "next";
import Link from "next/link";
import { PremiumButton } from "@/components/premium/system";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-black tracking-[0.05em] text-white">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#ccff00] shadow-[0_0_18px_rgba(204,255,0,0.65)]" />
          AGGARHA
        </Link>
        <nav className="hidden gap-2 rounded-2xl border border-white/[0.08] bg-[#111111] p-1 text-sm text-white/70 md:flex">
          <Link href={"/marketplace" as Route} className="rounded-xl px-3 py-1.5 transition-colors hover:bg-[#ccff00]/8 hover:text-[#ccff00]">Browse</Link>
          <Link href={"/#featured" as Route} className="rounded-xl px-3 py-1.5 transition-colors hover:bg-[#ccff00]/8 hover:text-[#ccff00]">Featured</Link>
          <Link href={"/#collectibles" as Route} className="rounded-xl px-3 py-1.5 transition-colors hover:bg-[#ccff00]/8 hover:text-[#ccff00]">Collectibles</Link>
          <Link href={"/#playstation" as Route} className="rounded-xl px-3 py-1.5 transition-colors hover:bg-[#ccff00]/8 hover:text-[#ccff00]">PlayStation</Link>
          <Link href={"/ai/dashboard" as Route} className="rounded-xl px-3 py-1.5 transition-colors hover:bg-[#ccff00]/8 hover:text-[#ccff00]">AI Brain</Link>
        </nav>
        <Link href={"/marketplace" as Route}>
          <PremiumButton tone="primary">Start Exploring</PremiumButton>
        </Link>
      </div>
    </header>
  );
}
