import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, PropsWithChildren, ReactNode, SelectHTMLAttributes } from "react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function PremiumButton({
  children,
  className,
  tone = "primary",
  ...props
}: PropsWithChildren<
  {
    className?: string;
    tone?: "primary" | "secondary" | "ghost";
  } & ButtonHTMLAttributes<HTMLButtonElement>
>) {
  const toneClass =
    tone === "primary"
      ? "bg-[#ccff00] text-black hover:bg-[#deff57]"
      : tone === "secondary"
        ? "bg-[#1b1b1b] text-white hover:bg-[#202020]"
        : "bg-transparent text-white hover:bg-white/5";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold transition duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        toneClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function PremiumCard({ className, children, ...props }: PropsWithChildren<{ className?: string } & HTMLAttributes<HTMLElement>>) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/[0.06] bg-[#151515] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition duration-300 motion-safe:hover:-translate-y-0.5 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{eyebrow}</p>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
        {subtitle ? <p className="max-w-2xl text-sm text-white/65">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function HeroBanner({
  title,
  subtitle,
  children,
  className
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(150deg,#090909,#111111,#090909)] p-6 sm:p-8 lg:p-10",
        className
      )}
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#ccff00]/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-[#4f85ff]/12 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative space-y-4 [animation:revealUp_.8s_ease_both]">
        <h1 className="max-w-4xl text-balance text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="max-w-2xl text-base text-white/68 sm:text-lg">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}

export function SearchBar({ className, suggestions = [] }: { className?: string; suggestions?: string[] }) {
  return (
    <div className={cn("space-y-3 rounded-3xl border border-white/[0.08] bg-[#0f0f0f]/95 p-3 shadow-[0_20px_30px_rgba(0,0,0,0.35)] backdrop-blur sm:p-4", className)}>
      <div className="grid gap-3 sm:grid-cols-[1.35fr_1fr_auto]">
        <PremiumInput name="keyword" placeholder="AI smart search for rentals, swaps, collectibles, games..." />
        <PremiumInput name="nearby" placeholder="City or district" />
        <PremiumButton type="submit" tone="primary" className="w-full sm:w-auto">
          Search
        </PremiumButton>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.slice(0, 6).map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    </div>
  );
}

export function FilterPanel({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <PremiumCard className={cn("bg-[#141414]", className)}>{children}</PremiumCard>;
}

export function Tag({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn("inline-flex rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/78", className)}>
      {children}
    </span>
  );
}

export function PremiumBadge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <span className={cn("inline-flex rounded-full border border-[#ccff00]/40 bg-[#ccff00]/12 px-3 py-1 text-xs font-semibold text-[#ebff9d]", className)}>{children}</span>;
}

export function TrustBadge({ score }: { score: number }) {
  return <PremiumBadge>Trust {score.toFixed(1)}</PremiumBadge>;
}

export function VerificationBadgePill({ label }: { label: string }) {
  return <span className="inline-flex rounded-full border border-[#58f0c6]/30 bg-[#58f0c6]/12 px-3 py-1 text-xs font-semibold text-[#a3ffe4]">{label}</span>;
}

export function OwnerCard({
  name,
  level,
  trust,
  stats,
  badge
}: {
  name: string;
  level: number;
  trust: number;
  stats: Array<{ label: string; value: string }>;
  badge: string;
}) {
  return (
    <PremiumCard className="space-y-4 bg-[#191919]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-white">{name}</p>
          <p className="text-sm text-white/63">Level {level}</p>
        </div>
        <VerificationBadgePill label={badge} />
      </div>
      <TrustBadge score={trust} />
      <div className="grid grid-cols-2 gap-2 text-xs text-white/74">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-[#202020] p-3">
            <p className="text-white/52">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}

export function ReviewCard({ author, rating, body, meta }: { author: string; rating: number; body: string; meta: string }) {
  return (
    <PremiumCard className="space-y-2 bg-[#1b1b1b] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-white">{author}</p>
        <p className="text-xs text-[#ccff00]">{rating.toFixed(1)} / 5</p>
      </div>
      <p className="text-sm text-white/70">{body}</p>
      <p className="text-xs text-white/45">{meta}</p>
    </PremiumCard>
  );
}

export function StickyBookingCard({
  price,
  details,
  primaryLabel,
  secondaryLabel
}: {
  price: string;
  details: string[];
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <PremiumCard className="space-y-4 bg-[#101010]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ccff00]">Sticky Booking Card</p>
      <p className="text-3xl font-black text-white">{price}</p>
      <div className="space-y-1 text-xs text-white/64">
        {details.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <PremiumButton tone="primary" className="w-full">
        {primaryLabel}
      </PremiumButton>
      <PremiumButton tone="secondary" className="w-full">
        {secondaryLabel}
      </PremiumButton>
    </PremiumCard>
  );
}

export function PremiumCalendar({ days }: { days: Array<{ day: string; date: string; state: "available" | "reserved" | "blocked" | "cooldown" }> }) {
  return (
    <PremiumCard className="bg-[#181818] p-4">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
        {days.map((item) => {
          const stateClass =
            item.state === "available"
              ? "bg-[#ccff00]/15 text-[#eaff95] border-[#ccff00]/40"
              : item.state === "reserved"
                ? "bg-[#ffd27a]/15 text-[#ffd27a] border-[#ffd27a]/35"
                : item.state === "cooldown"
                  ? "bg-[#7ac1ff]/15 text-[#9fd4ff] border-[#7ac1ff]/35"
                  : "bg-white/[0.04] text-white/55 border-white/10";

          return (
            <div key={`${item.day}-${item.date}`} className={cn("rounded-2xl border p-2 text-center", stateClass)}>
              <p className="text-[10px] uppercase tracking-[0.1em]">{item.day}</p>
              <p className="text-xs font-semibold">{item.date}</p>
            </div>
          );
        })}
      </div>
    </PremiumCard>
  );
}

export function NearbyCard({ title, distance, mode, trust }: { title: string; distance: string; mode: string; trust: number }) {
  return (
    <PremiumCard className="space-y-2 bg-[#141414] p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="flex flex-wrap gap-2">
        <Tag>{distance}</Tag>
        <Tag>{mode}</Tag>
        <TrustBadge score={trust} />
      </div>
    </PremiumCard>
  );
}

export function CollectibleCard({ title, value, rarity }: { title: string; value: string; rarity: string }) {
  return (
    <PremiumCard className="space-y-2 bg-[linear-gradient(155deg,#131313,#1a1a1a)] p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-white/55">AI Estimated Value</p>
      <p className="text-lg font-bold text-[#ccff00]">{value}</p>
      <Tag>{rarity}</Tag>
    </PremiumCard>
  );
}

export function PlayStationCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <PremiumCard className="space-y-2 bg-[linear-gradient(140deg,#0d1324,#152a4f,#0c1a34)] p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-white/72">{subtitle}</p>
      <PremiumBadge>AI Match Suggestions</PremiumBadge>
    </PremiumCard>
  );
}

export function RecommendationCard({ title, reason, href }: { title: string; reason: string; href: string }) {
  return (
    <Link href={href as Route} className="block rounded-2xl border border-white/[0.08] bg-[#181818] p-4 transition hover:border-[#ccff00]/45 hover:bg-[#202020]">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-white/58">{reason}</p>
    </Link>
  );
}

export function StatsCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <PremiumCard className="bg-[#1a1a1a] p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-white/55">{label}</p>
      <p className="mt-1 text-2xl font-black text-white [animation:counterFade_1.2s_ease]">{value}</p>
      {note ? <p className="mt-1 text-xs text-white/50">{note}</p> : null}
    </PremiumCard>
  );
}

export function PremiumSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-white/[0.1] bg-[#121212] px-3 py-2.5 text-sm text-white",
        "focus:border-[#ccff00] focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

export function PremiumInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-white/[0.1] bg-[#121212] px-3 py-2.5 text-sm text-white placeholder:text-white/38",
        "focus:border-[#ccff00] focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

export function BottomSheet({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="rounded-t-[1.75rem] border border-white/[0.1] bg-[#161616] p-4 shadow-[0_-14px_32px_rgba(0,0,0,0.45)]">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-2 text-sm text-white/72">{children}</div>
    </div>
  );
}

export function ModalPanel({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="rounded-3xl border border-white/[0.1] bg-[#161616] p-5">
      <p className="text-lg font-bold text-white">{title}</p>
      <div className="mt-2 text-sm text-white/72">{children}</div>
    </div>
  );
}

export function TooltipHint({ text }: { text: string }) {
  return <span className="inline-flex rounded-lg border border-white/[0.12] bg-black/80 px-2 py-1 text-[11px] text-white/76">{text}</span>;
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-white/[0.08]", className)} />;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <PremiumCard className="bg-[#171717] text-center">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-white/62">{description}</p>
    </PremiumCard>
  );
}

export function MapPanel({ title, layers }: { title: string; layers: string[] }) {
  return (
    <PremiumCard className="space-y-3 bg-[#151515]">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="relative overflow-hidden rounded-2xl border border-[#ccff00]/30 bg-[radial-gradient(circle_at_35%_25%,rgba(204,255,0,0.14),transparent_40%),linear-gradient(180deg,#121212,#0a0a0a)] p-4">
        <div className="grid grid-cols-4 gap-2 opacity-40">
          {Array.from({ length: 24 }).map((_, idx) => (
            <div key={idx} className="h-6 rounded-md border border-white/10 bg-white/5" />
          ))}
        </div>
        <div className="absolute left-[14%] top-[25%] h-2.5 w-2.5 rounded-full bg-[#ccff00] shadow-[0_0_0_8px_rgba(204,255,0,0.12)]" />
        <div className="absolute right-[25%] top-[35%] h-2.5 w-2.5 rounded-full bg-[#ccff00] shadow-[0_0_0_8px_rgba(204,255,0,0.12)]" />
        <div className="absolute bottom-[22%] left-[45%] h-2.5 w-2.5 rounded-full bg-[#58a6ff] shadow-[0_0_0_8px_rgba(88,166,255,0.12)]" />
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {layers.map((layer) => (
          <Tag key={layer}>{layer}</Tag>
        ))}
      </div>
    </PremiumCard>
  );
}

export function MobileBottomNav() {
  return (
    <div className="fixed bottom-3 left-1/2 z-40 flex w-[min(96%,28rem)] -translate-x-1/2 items-center justify-between rounded-2xl border border-white/[0.1] bg-[#121212]/90 px-4 py-2 backdrop-blur md:hidden">
      <Link href="/" className="text-xs font-semibold text-white/72">Home</Link>
      <Link href="/marketplace" className="text-xs font-semibold text-white/72">Browse</Link>
      <Link href="/ai/dashboard" className="text-xs font-semibold text-[#ccff00]">AI</Link>
      <Link href="/marketplace?mode=SWAP" className="text-xs font-semibold text-white/72">Swap</Link>
    </div>
  );
}

export function HeroAdsSlider({ slides }: { slides: Array<{ title: string; caption: string }> }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0f0f0f] p-3">
      <div className="flex min-w-max gap-3 [animation:heroSlide_26s_linear_infinite] hover:[animation-play-state:paused]">
        {[...slides, ...slides].map((slide, idx) => (
          <div key={`${slide.title}-${idx}`} className="w-full rounded-2xl border border-white/[0.08] bg-[#191919] p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[#ccff00]">Campaign</p>
            <p className="mt-2 text-xl font-bold text-white">{slide.title}</p>
            <p className="mt-1 text-sm text-white/62">{slide.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
