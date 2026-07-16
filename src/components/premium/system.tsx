import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { VerifiedSparkle } from "@/components/premium/verified-sparkle";
import type { Locale } from "@/lib/i18n/types";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

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
      ? "bg-[#ccff00] text-black hover:bg-[#deff57] hover:shadow-[0_10px_24px_rgba(204,255,0,0.22)]"
      : tone === "secondary"
        ? "bg-[#1b1b1b] text-white hover:bg-[#202020] hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
        : "bg-transparent text-white hover:bg-white/5";

  return (
    <button
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-semibold",
        "transition-all duration-200 ease-[var(--ease-premium)]",
        "hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:active:scale-100",
        "active:translate-y-0 active:scale-[0.97]",
        toneClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function PremiumCard({
  className,
  children,
  ...props
}: PropsWithChildren<{ className?: string } & HTMLAttributes<HTMLElement>>) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/[0.06] bg-[#151515] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.4)]",
        "transition-all duration-300 ease-[var(--ease-premium)]",
        "motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[0_28px_56px_rgba(0,0,0,0.5)]",
        "sm:p-6",
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
  action,
  level = 2
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  level?: 1 | 2;
}) {
  const HeadingTag = level === 1 ? "h1" : "h2";
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{eyebrow}</p>
        <HeadingTag className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </HeadingTag>
        {subtitle ? <p className="max-w-2xl text-sm leading-relaxed text-white/55">{subtitle}</p> : null}
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
      <div className="bg-[#ccff00]/12 pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl" />
      <div className="bg-[#4f85ff]/12 pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative space-y-4 [animation:revealUp_.8s_ease_both]">
        <h1 className="max-w-4xl text-balance text-[clamp(1.9rem,6vw,3.75rem)] font-black leading-tight text-white">
          {title}
        </h1>
        <p className="text-white/68 max-w-2xl text-base sm:text-lg">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}

export function SearchBar({
  className,
  suggestions = []
}: {
  className?: string;
  suggestions?: string[];
}) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-3xl border border-white/[0.08] bg-[#0f0f0f]/95 p-3 shadow-[0_20px_30px_rgba(0,0,0,0.35)] backdrop-blur sm:p-4",
        className
      )}
    >
      <div className="grid gap-3 sm:grid-cols-[1.35fr_1fr_auto]">
        <PremiumInput
          name="keyword"
          aria-label="Search rentals, swaps, collectibles, and games"
          placeholder="AI smart search for rentals, swaps, collectibles, games..."
        />
        <PremiumInput name="city" aria-label="City or district" placeholder="City or district" />
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
    <span
      className={cn(
        "text-white/78 inline-flex rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs font-medium",
        "transition-colors duration-200 ease-[var(--ease-premium)] hover:border-white/25 hover:bg-white/[0.08] hover:text-white",
        className
      )}
    >
      {children}
    </span>
  );
}

export function PremiumBadge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={cn(
        "bg-[#ccff00]/12 inline-flex rounded-full border border-[#ccff00]/40 px-3 py-1 text-xs font-semibold text-[#ebff9d]",
        className
      )}
    >
      {children}
    </span>
  );
}

export function TrustBadge({ score, lang = "en" }: { score: number; lang?: Locale }) {
  return <PremiumBadge>{lang === "ar" ? `ثقة ${score.toFixed(1)}` : `Trust ${score.toFixed(1)}`}</PremiumBadge>;
}

export function OwnerCard({
  name,
  level,
  trust,
  stats,
  verificationLevel,
  lang = "en",
  messageLabel,
  comingSoonTitle
}: {
  name: string;
  level: number;
  trust: number;
  stats: Array<{ label: string; value: string }>;
  verificationLevel: string;
  lang?: Locale;
  messageLabel?: string;
  comingSoonTitle?: string;
}) {
  return (
    <PremiumCard className="space-y-4 bg-[#191919]">
      <div>
        <p className="inline-flex items-center gap-1.5 text-lg font-bold text-white">
          {name}
          <VerifiedSparkle level={verificationLevel} lang={lang} />
        </p>
        <p className="text-white/63 text-sm">{lang === "ar" ? `المستوى ${level}` : `Level ${level}`}</p>
      </div>
      <TrustBadge score={trust} lang={lang} />
      <div className="text-white/74 grid grid-cols-2 gap-2 text-xs">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-[#202020] p-3">
            <p className="text-white/52">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
      {messageLabel ? (
        <PremiumButton tone="ghost" disabled aria-disabled="true" title={comingSoonTitle} className="w-full">
          {messageLabel}
        </PremiumButton>
      ) : null}
    </PremiumCard>
  );
}

export function ReviewCard({
  author,
  verificationLevel,
  rating,
  body,
  meta,
  lang = "en"
}: {
  author: string;
  verificationLevel?: string;
  rating: number;
  body: string;
  meta: string;
  lang?: Locale;
}) {
  return (
    <PremiumCard className="space-y-2 bg-[#1b1b1b] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          {author}
          {verificationLevel ? <VerifiedSparkle level={verificationLevel} lang={lang} /> : null}
        </p>
        <p className="text-xs tabular-nums text-[#ccff00]">{rating.toFixed(1)} / 5</p>
      </div>
      {body ? <p className="text-sm text-white/70">{body}</p> : null}
      <p className="text-xs text-white/55">{meta}</p>
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
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ccff00]">
        Sticky Booking Card
      </p>
      <p className="text-3xl font-black text-white">{price}</p>
      <div className="text-white/64 space-y-1 text-xs">
        {details.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <PremiumButton
        tone="primary"
        className="w-full"
        disabled
        aria-disabled="true"
        title="Coming soon"
      >
        {primaryLabel} (Coming soon)
      </PremiumButton>
      <PremiumButton
        tone="secondary"
        className="w-full"
        disabled
        aria-disabled="true"
        title="Coming soon"
      >
        {secondaryLabel} (Coming soon)
      </PremiumButton>
    </PremiumCard>
  );
}

export function PremiumCalendar({
  days
}: {
  days: Array<{
    day: string;
    date: string;
    state: "available" | "reserved" | "blocked" | "cooldown";
  }>;
}) {
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
            <div
              key={`${item.day}-${item.date}`}
              className={cn("rounded-2xl border p-2 text-center", stateClass)}
            >
              <p className="text-[10px] uppercase tracking-[0.1em]">{item.day}</p>
              <p className="text-xs font-semibold">{item.date}</p>
            </div>
          );
        })}
      </div>
    </PremiumCard>
  );
}

export function NearbyCard({
  title,
  distance,
  mode,
  trust
}: {
  title: string;
  distance?: string;
  mode: string;
  trust: number;
}) {
  return (
    <PremiumCard className="space-y-2 bg-[#141414] p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="flex flex-wrap gap-2">
        {distance ? (
          <Tag>{distance}</Tag>
        ) : (
          <Tag className="text-white/55">Distance: Coming soon</Tag>
        )}
        <Tag>{mode}</Tag>
        <TrustBadge score={trust} />
      </div>
    </PremiumCard>
  );
}

export function CollectibleCard({
  title,
  value,
  rarity
}: {
  title: string;
  value: string;
  rarity: string;
}) {
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
      <p className="text-white/72 text-xs">{subtitle}</p>
      <PremiumBadge>AI Match Suggestions</PremiumBadge>
    </PremiumCard>
  );
}

export function TextLink({
  href,
  children,
  className
}: {
  href: Route | string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href as Route}
      className={cn(
        "text-sm font-semibold text-[#ccff00] underline-offset-4 transition-all duration-200 ease-[var(--ease-premium)] hover:text-[#deff57] hover:underline",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function RecommendationCard({
  title,
  reason,
  href
}: {
  title: string;
  reason: string;
  href: string;
}) {
  return (
    <Link
      href={href as Route}
      className="block rounded-2xl border border-white/[0.08] bg-[#181818] p-4 transition duration-300 hover:border-[#ccff00]/45 hover:bg-[#202020] active:scale-[0.99]"
    >
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-white/58 mt-1 text-xs">{reason}</p>
    </Link>
  );
}

export function StatsCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <PremiumCard className="bg-[#1a1a1a] p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-white/55">{label}</p>
      <p className="mt-1 text-2xl font-black text-white [animation:counterFade_1.2s_ease]">
        {value}
      </p>
      {note ? <p className="mt-1 text-xs text-white/50">{note}</p> : null}
    </PremiumCard>
  );
}

export function PremiumSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-white/[0.1] bg-[#121212] px-3 py-2.5 text-sm text-white",
        "transition-all duration-200 ease-[var(--ease-premium)]",
        "focus:border-[#ccff00] focus:outline-none focus:ring-2 focus:ring-[#ccff00]/25",
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
        "placeholder:text-white/38 w-full rounded-2xl border border-white/[0.1] bg-[#121212] px-3 py-2.5 text-sm text-white",
        "transition-all duration-200 ease-[var(--ease-premium)]",
        "focus:border-[#ccff00] focus:outline-none focus:ring-2 focus:ring-[#ccff00]/25 focus:shadow-[0_0_0_4px_rgba(204,255,0,0.08)]",
        className
      )}
      {...props}
    />
  );
}

export function PremiumTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "placeholder:text-white/38 w-full resize-none rounded-2xl border border-white/[0.1] bg-[#121212] px-3 py-2.5 text-sm text-white",
        "transition-all duration-200 ease-[var(--ease-premium)]",
        "focus:border-[#ccff00] focus:outline-none focus:ring-2 focus:ring-[#ccff00]/25 focus:shadow-[0_0_0_4px_rgba(204,255,0,0.08)]",
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
      <div className="text-white/72 mt-2 text-sm">{children}</div>
    </div>
  );
}

export function ModalPanel({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="rounded-3xl border border-white/[0.1] bg-[#161616] p-5">
      <p className="text-lg font-bold text-white">{title}</p>
      <div className="text-white/72 mt-2 text-sm">{children}</div>
    </div>
  );
}

export function ComingSoonTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50",
        className
      )}
    >
      Coming Soon
    </span>
  );
}

export function TooltipHint({ text }: { text: string }) {
  return (
    <span className="text-white/76 inline-flex rounded-lg border border-white/[0.12] bg-black/80 px-2 py-1 text-[11px]">
      {text}
    </span>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-2xl", className)} />;
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <PremiumCard className="items-center bg-[#171717] text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
        <span className="h-2 w-2 rounded-full bg-[#ccff00]/70" />
      </div>
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="text-white/62 mx-auto mt-2 max-w-sm text-sm">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </PremiumCard>
  );
}

export function MapPanel({ title, layers }: { title: string; layers: string[] }) {
  return (
    <PremiumCard className="space-y-3 bg-[#151515]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-white">{title}</p>
        <ComingSoonTag />
      </div>
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

const NAV_ICONS = {
  home: (
    <path d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
  ),
  browse: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  nearby: (
    <>
      <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  messages: <path d="M4 5h16v12H8l-4 4V5z" />,
  profile: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  )
};

function BottomNavIcon({ name }: { name: keyof typeof NAV_ICONS }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {NAV_ICONS[name]}
    </svg>
  );
}

/**
 * The primary mobile navigation — not a duplicate of the header. Home,
 * Browse, Nearby, and Requests are real destinations; Messages stays
 * disabled since that page doesn't exist yet. The last slot currently
 * points to /bookings, labeled "Requests" and reusing the profile
 * icon/position — swap the label back to Profile once a real profile
 * page exists.
 */
export function MobileBottomNav({ locale, t }: { locale: Locale; t: Dictionary }) {
  const itemClass =
    "text-white/65 inline-flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition-all duration-200 ease-[var(--ease-premium)] active:scale-[0.96]";

  return (
    <nav
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label="Mobile navigation"
      className="fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[min(96%,30rem)] -translate-x-1/2 items-center justify-between rounded-2xl border border-white/[0.1] bg-[#121212]/92 px-1.5 py-1.5 backdrop-blur md:hidden"
    >
      <Link href="/" className={cn(itemClass, "hover:bg-white/10 hover:text-white")}>
        <BottomNavIcon name="home" />
        {t.nav.home}
      </Link>
      <Link href="/marketplace" className={cn(itemClass, "hover:bg-white/10 hover:text-white")}>
        <BottomNavIcon name="browse" />
        {t.nav.browse}
      </Link>
      <Link href="/nearby" className={cn(itemClass, "hover:bg-white/10 hover:text-white")}>
        <BottomNavIcon name="nearby" />
        {t.nav.nearby}
      </Link>
      <span
        aria-disabled="true"
        title={t.nav.comingSoon}
        className={cn(itemClass, "cursor-not-allowed text-white/30")}
      >
        <BottomNavIcon name="messages" />
        {t.nav.messages}
      </span>
      <Link href="/bookings" className={cn(itemClass, "hover:bg-white/10 hover:text-white")}>
        <BottomNavIcon name="profile" />
        {t.nav.requests}
      </Link>
    </nav>
  );
}

export function PlaystationDisc({
  className,
  caption = "Limited Edition Exchange"
}: {
  className?: string;
  caption?: string;
}) {
  return (
    <div className={cn("relative mx-auto h-80 w-80 sm:h-[26rem] sm:w-[26rem] lg:h-[30rem] lg:w-[30rem]", className)}>
      <div className="absolute inset-0 rounded-full bg-[#58a6ff]/25 blur-3xl" />
      <div className="absolute inset-0 rounded-full bg-[#ccff00]/12 blur-[88px]" />
      <div className="absolute inset-4 rounded-full border border-white/10" />
      <div className="absolute inset-0 [animation:discFloat_6s_ease-in-out_infinite] [transform:perspective(1000px)_rotateX(12deg)] motion-safe:[transform-style:preserve-3d]">
        <div className="relative h-full w-full">
          <div className="h-full w-full rounded-full border border-white/25 bg-[conic-gradient(from_120deg,#243768,#0b1224,#24467a,#0e1a36,#243768)] shadow-[0_30px_110px_rgba(0,0,0,0.6)] [animation:discSpin_20s_linear_infinite]" />
          <div className="absolute inset-[17%] rounded-full border border-white/20 bg-black/50 backdrop-blur" />
          <div className="absolute inset-[43%] rounded-full bg-[#ccff00]/85 shadow-[0_0_0_10px_rgba(204,255,0,0.12)]" />
          {/* specular reflection */}
          <div className="pointer-events-none absolute left-[10%] top-[8%] h-16 w-16 rounded-full bg-white/25 blur-2xl sm:h-20 sm:w-20" />
          <div className="pointer-events-none absolute -left-8 top-0 h-14 w-36 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm [animation:discSweep_5.8s_linear_infinite]" />
          <div className="pointer-events-none absolute -left-8 top-0 h-14 w-24 bg-gradient-to-r from-transparent via-[#7ac1ff]/40 to-transparent blur-sm [animation:discSweep_5.8s_linear_2.6s_infinite]" />
        </div>
      </div>
      {/* floor reflection for depth */}
      <div className="pointer-events-none absolute -bottom-4 left-1/2 h-6 w-[65%] -translate-x-1/2 rounded-full bg-[#58a6ff]/25 blur-2xl" />
      <div className="pointer-events-none absolute left-[16%] top-[68%] h-1.5 w-1.5 rounded-full bg-[#ccff00]/90 [animation:particleRise_2.8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute left-[24%] top-[74%] h-1 w-1 rounded-full bg-[#58a6ff]/90 [animation:particleRise_3.2s_ease-in-out_.4s_infinite]" />
      <div className="pointer-events-none absolute left-[63%] top-[72%] h-1.5 w-1.5 rounded-full bg-white/90 [animation:particleRise_3s_ease-in-out_.7s_infinite]" />
      {caption ? (
        <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-4 py-1 text-[11px] uppercase tracking-[0.16em] text-white/70">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

export function MuseumSpotlight({
  eyebrow = "Museum Spotlight",
  title,
  caption,
  rarity,
  className
}: {
  eyebrow?: string;
  title: string;
  caption: string;
  rarity?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-h-[16rem] overflow-hidden rounded-3xl border border-[#d4af37]/20 bg-[linear-gradient(150deg,#161310,#0c0b09,#100e0a)] p-5 sm:min-h-[20rem] sm:p-6",
        className
      )}
    >
      {rarity ? (
        <div className="absolute right-5 top-5 z-10 sm:right-6 sm:top-6">
          <span className="inline-flex items-center rounded-full border border-[#d4af37]/45 bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-[#e8c76b] backdrop-blur">
            {rarity}
          </span>
        </div>
      ) : null}
      {/* spotlight beam */}
      <div className="absolute left-1/2 top-0 h-40 w-56 -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_75deg,rgba(240,207,106,0.18)_90deg,transparent_105deg)] blur-md" />
      <div className="absolute left-1/2 top-5 h-10 w-32 -translate-x-1/2 rounded-full bg-[#f0cf6a]/25 blur-xl" />
      {/* glass display case */}
      <div className="absolute left-1/2 top-10 h-[68%] w-[62%] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-[#d4af37]/15 bg-[linear-gradient(170deg,rgba(255,255,255,0.1),rgba(255,255,255,0.015))] backdrop-blur-sm">
        <div className="absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <div className="absolute bottom-[17%] left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#f0cf6a,#8a6d23)] shadow-[0_16px_50px_rgba(0,0,0,0.6)] [animation:discFloat_6.2s_ease-in-out_infinite]" />
      <div className="absolute bottom-5 left-1/2 h-4 w-40 -translate-x-1/2 rounded-full bg-black/60 blur-md" />
      <div className="relative z-10 max-w-xs rounded-2xl border border-[#d4af37]/20 bg-black/45 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[#e8c76b]">{eyebrow}</p>
        <p className="mt-2 text-lg font-bold text-white">{title}</p>
        <p className="mt-1 text-sm text-white/65">{caption}</p>
      </div>
    </div>
  );
}

export function HeroAdsSlider({ slides }: { slides: Array<{ title: string; caption: string }> }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0f0f0f] p-3">
      <div className="flex min-w-max gap-3 [animation:heroSlide_26s_linear_infinite] hover:[animation-play-state:paused]">
        {[...slides, ...slides].map((slide, idx) => (
          <div
            key={`${slide.title}-${idx}`}
            className="w-[min(88vw,24rem)] shrink-0 rounded-2xl border border-white/[0.08] bg-[#191919] p-5 sm:w-[min(44vw,24rem)] lg:w-[24rem]"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-[#ccff00]">Campaign</p>
            <p className="mt-2 text-xl font-bold text-white">{slide.title}</p>
            <p className="text-white/62 mt-1 text-sm">{slide.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
