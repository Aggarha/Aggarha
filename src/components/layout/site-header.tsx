import type { Route } from "next";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-black tracking-tight text-white">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#ccff00]" />
          AGGARHA
        </Link>
        <nav className="hidden gap-5 text-sm text-white/70 md:flex">
          <Link href={"/marketplace" as Route} className="transition-colors hover:text-[#ccff00]">Browse</Link>
          <Link href={"/#featured" as Route} className="transition-colors hover:text-[#ccff00]">Featured</Link>
          <Link href={"/#collectibles" as Route} className="transition-colors hover:text-[#ccff00]">Collectibles</Link>
          <Link href={"/#playstation" as Route} className="transition-colors hover:text-[#ccff00]">PlayStation</Link>
          <Link href={"/ai/dashboard" as Route} className="transition-colors hover:text-[#ccff00]">AI Brain</Link>
        </nav>
        <Link
          href={"/marketplace" as Route}
          className="inline-flex items-center justify-center rounded-xl2 bg-[#ccff00] px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#ddff57]"
        >
          Start Exploring
        </Link>
      </div>
    </header>
  );
}
