import type { PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

export function Badge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600",
        className
      )}
    >
      {children}
    </span>
  );
}
