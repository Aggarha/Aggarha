import type { Route } from "next";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-fog/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-ink">
          Aggarha
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          <Link href={"/marketplace" as Route} className="transition-colors hover:text-ink">Browse</Link>
          <Link href={"/#categories" as Route} className="transition-colors hover:text-ink">Categories</Link>
          <Link href={"/#featured" as Route} className="transition-colors hover:text-ink">Featured</Link>
          <Link href={"/#trust" as Route} className="transition-colors hover:text-ink">Trust</Link>
        </nav>
        <Link
          href={"/marketplace" as Route}
          className="inline-flex items-center justify-center rounded-xl2 bg-sand px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-amber-100"
        >
          Start Exploring
        </Link>
      </div>
    </header>
  );
}
