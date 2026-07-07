import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

type CardProps = PropsWithChildren<{
  className?: string;
}> &
  HTMLAttributes<HTMLElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <section className={cn("rounded-3xl border border-white/[0.06] bg-[#171717] p-6 shadow-panel", className)} {...props}>
      {children}
    </section>
  );
}
