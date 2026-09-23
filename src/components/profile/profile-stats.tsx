import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Locale } from "@/lib/i18n/types";

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#ccff00]">
      <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95L12 2.6Z" />
    </svg>
  );
}

/**
 * Three columns, hairline dividers between them. Numbers carry the display
 * face and the labels stay small and quiet — the count is the information,
 * the word is just its key.
 */
export function ProfileStats({
  followingCount,
  followerCount,
  ratingAverage,
  t,
  lang
}: {
  followingCount: number;
  followerCount: number;
  ratingAverage: number | null;
  t: Dictionary;
  lang: Locale;
}) {
  const numberLocale = lang === "ar" ? "ar-EG" : "en-US";
  const format = (value: number) => value.toLocaleString(numberLocale);

  const cells = [
    { key: "following", label: t.profile.following, value: format(followingCount), icon: null },
    { key: "followers", label: t.profile.followers, value: format(followerCount), icon: null },
    {
      key: "rating",
      label: t.profile.rating,
      value: ratingAverage === null ? t.profile.noRating : ratingAverage.toFixed(1),
      icon: ratingAverage === null ? null : <StarIcon />
    }
  ];

  return (
    <dl className="grid grid-cols-3 divide-x divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-[#171717] py-3 rtl:divide-x-reverse">
      {cells.map((cell) => (
        <div key={cell.key} className="flex flex-col items-center justify-center gap-0.5 px-2">
          <dd className="flex items-center gap-1 font-[family-name:var(--font-space-grotesk)] text-lg font-black leading-none text-white">
            {cell.icon}
            <span className="tabular-nums">{cell.value}</span>
          </dd>
          <dt className="text-[11px] font-medium text-white/50">{cell.label}</dt>
        </div>
      ))}
    </dl>
  );
}
