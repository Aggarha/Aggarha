export type WizardStep = { key: string; label: string };

export function StepIndicator({
  steps,
  activeIndex,
  className = ""
}: {
  steps: WizardStep[];
  activeIndex: number;
  className?: string;
}) {
  return (
    <ol className={`flex items-center gap-1.5 overflow-x-auto sm:gap-2 ${className}`}>
      {steps.map((step, index) => {
        const isDone = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <li key={step.key} className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div
              className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 ease-[var(--ease-premium)] sm:px-3 ${
                isDone
                  ? "border-[#ccff00]/45 bg-[#ccff00]/12 text-[#eaff95]"
                  : isActive
                    ? "border-[#ccff00]/60 bg-[#ccff00] text-black"
                    : "border-white/12 bg-white/[0.03] text-white/45"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  isDone ? "bg-[#ccff00] text-black" : isActive ? "bg-black/20 text-black" : "bg-white/10 text-white/50"
                }`}
              >
                {isDone ? (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span className="whitespace-nowrap">{step.label}</span>
            </div>
            {index < steps.length - 1 ? (
              <span className={`h-px w-4 shrink-0 sm:w-6 ${isDone ? "bg-[#ccff00]/45" : "bg-white/10"}`} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
