import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <section className="grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div className="space-y-4">
          <Badge>Phase A2 Foundation</Badge>
          <h1 className="text-balance text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Aggarha PWA foundation for desktop and mobile.
          </h1>
          <p className="max-w-xl text-base text-slate-600 sm:text-lg">
            This shell is production-ready for responsive web delivery across Desktop, Android,
            iPhone, iPad, and tablet form factors.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Open Roadmap</Button>
            <Button variant="ghost">View Architecture Docs</Button>
          </div>
        </div>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Production URL</p>
          <p className="mt-2 text-xl font-bold text-ink">https://www.aggarha.com</p>
          <p className="mt-4 text-sm text-slate-600">Prepared to replace temporary placeholder once deployment switch is requested.</p>
        </Card>
      </section>

      <section id="foundation" className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="text-lg font-bold">App Router + TypeScript</h2>
          <p className="mt-2 text-sm text-slate-600">Strict typing and modular structure for long-term maintainability.</p>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Tailwind + Design Primitives</h2>
          <p className="mt-2 text-sm text-slate-600">Reusable Button, Badge, and Card components with responsive defaults.</p>
        </Card>
        <Card id="pwa">
          <h2 className="text-lg font-bold">PWA Ready</h2>
          <p className="mt-2 text-sm text-slate-600">Installable app shell with manifest and service worker integration for production.</p>
        </Card>
      </section>

      <section id="platform" className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="text-base font-bold">Desktop Layout</h3>
          <p className="mt-2 text-sm text-slate-600">Two-column hero, wide content rhythm, and consistent spacing scales.</p>
        </Card>
        <Card>
          <h3 className="text-base font-bold">Mobile Layout</h3>
          <p className="mt-2 text-sm text-slate-600">Single-column fallback, touch-friendly controls, and readable typography.</p>
        </Card>
      </section>
    </div>
  );
}
