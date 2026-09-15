import type { ReactNode } from "react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { ProfileStats } from "@/components/profile/profile-stats";
import { VerifiedSparkle } from "@/components/premium/verified-sparkle";
import { buildLocationLabel } from "@/lib/marketplace/demo-content";
import type { ProfileSummary } from "@/lib/profile/query";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Locale } from "@/lib/i18n/types";

function PinIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/**
 * Presentational: every interactive affordance arrives as a slot, so this stays
 * a server component and the client bundle only carries the controls that
 * actually need state (avatar upload, edit sheet, follow, overflow menu).
 */
export function ProfileHeader({
  profile,
  t,
  lang,
  avatarSlot,
  actionsSlot,
  bioSlot
}: {
  profile: ProfileSummary;
  t: Dictionary;
  lang: Locale;
  avatarSlot?: ReactNode;
  actionsSlot?: ReactNode;
  bioSlot?: ReactNode;
}) {
  const locationLine = [profile.city ? buildLocationLabel(profile.city, lang) : null, profile.country]
    .filter(Boolean)
    .join(", ");

  return (
    <header className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="relative">
          <ProfileAvatar
            name={profile.displayName}
            avatarUrl={profile.avatarUrl}
            priority
            className="h-[86px] w-[86px] text-[1.05rem] sm:h-[104px] sm:w-[104px]"
          />
          {avatarSlot}
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <h1 className="flex items-center gap-1.5 font-[family-name:var(--font-space-grotesk)] text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">
            <span className="truncate">{profile.displayName}</span>
            <VerifiedSparkle level={profile.verificationLevel} lang={lang} />
          </h1>
          <p dir="ltr" className="truncate text-sm text-white/45 rtl:text-right">
            @{profile.handle}
          </p>
          {locationLine ? (
            <p className="mt-1.5 flex items-center gap-1 truncate text-xs text-white/55">
              <PinIcon />
              <span className="truncate">{locationLine}</span>
            </p>
          ) : null}
        </div>
      </div>

      <ProfileStats
        followingCount={profile.followingCount}
        followerCount={profile.followerCount}
        ratingAverage={profile.ratingAverage}
        t={t}
        lang={lang}
      />

      {bioSlot}
      {actionsSlot}
    </header>
  );
}
