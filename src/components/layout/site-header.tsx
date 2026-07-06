import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-fog/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-ink">
          Aggarha
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          <a href="#categories" className="transition-colors hover:text-ink">Categories</a>
          <a href="#featured" className="transition-colors hover:text-ink">Featured</a>
          <a href="#trust" className="transition-colors hover:text-ink">Trust</a>
          <a href="#safety" className="transition-colors hover:text-ink">Safety</a>
        </nav>
        <Button variant="secondary">Early Access</Button>
      </div>
    </header>
  );
}
