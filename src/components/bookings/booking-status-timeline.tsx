export type BookingStatus = "sent" | "pending" | "accepted" | "declined";

type TimelineStrings = {
  requestSent: string;
  reviewing: string;
  accepted: string;
  declined: string;
};

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function BookingStatusTimeline({ status, t }: { status: BookingStatus; t: TimelineStrings }) {
  const finalLabel = status === "declined" ? t.declined : t.accepted;
  const finalDone = status === "accepted" || status === "declined";
  const finalIsNegative = status === "declined";

  const steps = [
    { label: t.requestSent, done: true, active: false },
    {
      label: t.reviewing,
      done: status === "accepted" || status === "declined",
      active: status === "sent" || status === "pending"
    },
    { label: finalLabel, done: finalDone, active: false, negative: finalIsNegative }
  ];

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                step.negative
                  ? "border-[#ff9a8a]/50 bg-[#ff9a8a]/15 text-[#ffbcb0]"
                  : step.done
                    ? "border-[#ccff00]/50 bg-[#ccff00] text-black"
                    : step.active
                      ? "border-[#ccff00]/60 bg-[#ccff00]/12 text-[#eaff95]"
                      : "border-white/15 bg-white/5 text-white/40"
              }`}
            >
              {step.negative ? <CrossIcon /> : step.done ? <CheckIcon /> : index + 1}
            </span>
            {index < steps.length - 1 ? (
              <span className={`mt-1 h-8 w-px flex-1 ${step.done ? "bg-[#ccff00]/40" : "bg-white/10"}`} />
            ) : null}
          </div>
          <p
            className={`pb-8 pt-0.5 text-sm font-semibold ${
              step.negative
                ? "text-[#ffbcb0]"
                : step.done
                  ? "text-white"
                  : step.active
                    ? "text-[#eaff95]"
                    : "text-white/45"
            }`}
          >
            {step.label}
          </p>
        </li>
      ))}
    </ol>
  );
}
