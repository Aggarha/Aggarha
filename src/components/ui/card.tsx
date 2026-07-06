import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/cn";

type CardProps = PropsWithChildren<{
  className?: string;
}> &
  HTMLAttributes<HTMLElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <section className={cn("rounded-xl2 border border-slate-200 bg-white p-6 shadow-panel", className)} {...props}>
      {children}
    </section>
  );
}
