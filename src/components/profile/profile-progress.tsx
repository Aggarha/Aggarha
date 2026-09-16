import { cn } from "@/lib/cn";
import type { buildAchievements, buildDailyTasks, buildLevelProgress } from "@/lib/profile/gamification";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

/**
 * Level, achievements and today's tasks — the own-profile dashboard block from
 * the design prototype. Every badge and tick is derived from the account's own
 * rows, so nothing here can claim activity the history doesn't show.
 *
 * Server component: it renders counts, not interactions.
 */
export function ProfileProgress({
  progress,
  achievements,
  tasks,
  t
}: {
  progress: ReturnType<typeof buildLevelProgress>;
  achievements: ReturnType<typeof buildAchievements>;
  tasks: ReturnType<typeof buildDailyTasks>;
  t: Dictionary;
}) {
  return (
    <section className="space-y-6 rounded-2xl border border-white/[0.08] bg-[#171717] p-4 sm:p-5">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#ccff00] font-[family-name:var(--font-space-grotesk)] text-base font-black text-[#ccff00]">
              {progress.level}
            </span>
            <div>
              <p className="text-[15px] font-bold text-white">
                {t.profile.levelLabel} {progress.level} / {progress.maxLevel} · {progress.tierName}
              </p>
              <p className="mt-0.5 text-xs text-white/55">
                <span className="tabular-nums">
                  {progress.xpCurrent} / {progress.xpTarget}
                </span>{" "}
                {t.profile.xpLabel}
              </p>
            </div>
          </div>
          <p className="max-w-[15rem] text-xs leading-relaxed text-white/50">{t.profile.levelPerkNote}</p>
        </div>

        <div
          role="progressbar"
          aria-valuenow={progress.xpCurrent}
          aria-valuemin={0}
          aria-valuemax={progress.xpTarget}
          className="h-2 overflow-hidden rounded-full bg-[#101013]"
        >
          <div className="h-full rounded-full bg-[#ccff00]" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="flex items-baseline gap-2 text-[13px] font-bold text-white/85">
          {t.profile.achievementsTitle}
          <span className="text-xs font-medium text-white/45">
            {t.profile.achievementsCount(achievements.filter((entry) => entry.unlocked).length)}
          </span>
        </h3>
        <ul className="flex flex-wrap gap-2">
          {achievements.map((achievement) => (
            <li
              key={achievement.key}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                achievement.unlocked
                  ? "border-[#ccff00]/25 bg-[#ccff00]/[0.08] text-white"
                  : "border-white/[0.08] text-white/35"
              )}
            >
              <span aria-hidden="true">{achievement.icon}</span>
              {achievement.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-[13px] font-bold text-white/85">{t.profile.dailyTasksTitle}</h3>
        <ul className="flex flex-col gap-2.5">
          {tasks.map((task) => (
            <li
              key={task.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#101013] px-4 py-3"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px]",
                    task.done ? "border-[#ccff00] bg-[#ccff00] text-black" : "border-white/20"
                  )}
                >
                  {task.done ? <CheckIcon /> : null}
                </span>
                <span className={cn("truncate text-[13px]", task.done ? "text-white/40 line-through" : "text-white/80")}>
                  {task.label}
                </span>
              </span>
              <span className="shrink-0 rounded-lg border border-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-[#ccff00]">
                {task.reward}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
