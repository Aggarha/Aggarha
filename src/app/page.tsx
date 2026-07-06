import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const categories = [
  {
    name: "Gaming & Esports",
    summary: "Consoles, GPUs, stream kits, and tournament-ready peripherals.",
    trust: "High-activity category"
  },
  {
    name: "Cameras & Creative",
    summary: "Mirrorless kits, cinema lenses, gimbals, and creator accessories.",
    trust: "Verified-first visibility"
  },
  {
    name: "Audio & Events",
    summary: "Mics, mixers, speakers, and event-grade sound rigs.",
    trust: "Damage-safe profile priority"
  },
  {
    name: "Pro Work Tools",
    summary: "Commercial tools and pro equipment for project-based use.",
    trust: "Completion-rate weighted"
  }
];

const featuredListings = [
  {
    title: "PS5 Streaming Bundle",
    city: "Doha",
    mode: "Rent",
    score: "Trust 82"
  },
  {
    title: "Sony A7 IV + Lens Kit",
    city: "Lusail",
    mode: "Both",
    score: "Trust 90"
  },
  {
    title: "Event Speaker Pair",
    city: "Al Wakrah",
    mode: "Swap",
    score: "Trust 78"
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-7 px-4 pb-12 pt-8 sm:px-6 md:gap-10 md:pb-16 md:pt-12 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-panel sm:p-7 lg:p-10">
        <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-teal-200/35 blur-2xl sm:h-56 sm:w-56" />
        <div className="absolute -bottom-24 -left-20 h-40 w-40 rounded-full bg-amber-200/35 blur-2xl sm:h-60 sm:w-60" />

        <div className="relative grid gap-8 md:grid-cols-[1.25fr_0.95fr] md:items-end">
          <div className="space-y-5">
            <Badge>Premium rental and swap discovery</Badge>
            <h1 className="text-balance text-4xl font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Discover trusted gear for rent, swap, or both.
            </h1>
            <p className="max-w-xl text-pretty text-base text-slate-600 sm:text-lg">
              Aggarha is a trust-first marketplace experience designed for fast discovery, confident
              decisions, and premium interactions across desktop, Android, iPhone, iPad, and tablets.
            </p>

            <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 sm:grid-cols-[1fr_auto] sm:items-center sm:p-4">
              <label htmlFor="search" className="sr-only">
                Search listings
              </label>
              <input
                id="search"
                name="search"
                type="text"
                placeholder="Search PS5, camera kit, DJ deck, studio lights..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-accent focus:outline-none"
              />
              <Button type="button" className="w-full sm:w-auto">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">Rent</span>
              <span className="rounded-full bg-white px-3 py-1 font-semibold ring-1 ring-slate-200">Swap</span>
              <span className="rounded-full bg-white px-3 py-1 font-semibold ring-1 ring-slate-200">Both</span>
            </div>
          </div>

          <Card id="pwa" className="space-y-4 border-0 bg-slate-950 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">PWA Install Ready</p>
            <h2 className="text-2xl font-bold leading-tight">Take Aggarha with you.</h2>
            <p className="text-sm text-slate-300">
              Add Aggarha to your home screen for fast re-entry, app-like navigation, and always-on discovery workflows.
            </p>
            <ul className="grid gap-2 text-sm text-slate-200">
              <li>iPhone/iPad: Share then Add to Home Screen</li>
              <li>Android: Install app from browser menu</li>
              <li>Desktop: Install from browser address bar</li>
            </ul>
          </Card>
        </div>
      </section>

      <section id="categories" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Category Preview</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">High-intent discovery zones</h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <Card key={category.name} className="bg-white/90">
              <p className="text-base font-bold text-ink">{category.name}</p>
              <p className="mt-2 text-sm text-slate-600">{category.summary}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">{category.trust}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="featured" className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Featured Listings Preview</p>
          <div className="grid gap-3">
            {featuredListings.map((listing) => (
              <div key={listing.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-base font-bold text-ink">{listing.title}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">{listing.city}</span>
                  <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">{listing.mode}</span>
                  <span className="rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">{listing.score}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card id="trust" className="space-y-4 bg-gradient-to-br from-teal-900 to-slate-950 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-teal-100">Trust & Reputation</p>
          <h3 className="text-2xl font-bold">Visibility is earned, not bought.</h3>
          <p className="text-sm text-slate-200">
            Aggarha ranking balances trust score, verification state, completion behavior, and reputation quality.
            Paid visibility is bounded and never overrides safety signals.
          </p>
          <div className="grid gap-2 text-sm text-slate-100">
            <p>Phone and identity verification improve confidence badges.</p>
            <p>Mutual deal confirmation unlocks XP and review impact.</p>
            <p>Fraud and abuse signals can reduce ranking instantly.</p>
          </div>
        </Card>
      </section>

      <section id="modes" className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Mode</p>
          <h4 className="mt-2 text-lg font-bold text-ink">Rent</h4>
          <p className="mt-2 text-sm text-slate-600">Short-term access with confidence layers for profile and listing quality.</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Mode</p>
          <h4 className="mt-2 text-lg font-bold text-ink">Swap</h4>
          <p className="mt-2 text-sm text-slate-600">Mutual exchange flow where confirmation protects trust and reputation integrity.</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Mode</p>
          <h4 className="mt-2 text-lg font-bold text-ink">Both</h4>
          <p className="mt-2 text-sm text-slate-600">Flexible listings that support both intent types while preserving trust weighting.</p>
        </Card>
      </section>

      <section id="reseller" className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Reseller Subscription</p>
          <h3 className="mt-2 text-xl font-bold text-ink">Boosted visibility for serious inventory.</h3>
          <p className="mt-2 text-sm text-slate-600">
            Subscription unlocks bounded ranking boosts, profile styling, and inventory analytics while trust remains the primary sorting signal.
          </p>
        </Card>
        <Card id="safety" className="bg-slate-100/80">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Safety & Legal Position</p>
          <h3 className="mt-2 text-xl font-bold text-ink">Discovery platform, not payment custody.</h3>
          <p className="mt-2 text-sm text-slate-600">
            Aggarha does not process payments, hold goods, or execute contracts. Users arrange transactions externally and confirm outcomes in-app.
          </p>
        </Card>
      </section>
    </div>
  );
}
