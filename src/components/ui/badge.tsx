import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "gold"
    | "green"
    | "muted"
    | "danger"
    | "review"
    | "default"
    | "success"
    | "warning"
    | "bordeaux";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-champagne/10 text-champagne border-champagne/25",
  gold: "bg-champagne/15 text-champagne border-champagne/35",
  green: "bg-emerald-500/12 text-emerald-400 border-emerald-500/25",
  success: "bg-emerald-500/12 text-emerald-400 border-emerald-500/25",
  muted: "bg-muted/70 text-muted-foreground border-border/50",
  danger: "bg-red-500/12 text-red-400 border-red-500/25",
  review: "bg-amber-500/12 text-amber-400 border-amber-500/25",
  warning: "bg-amber-500/12 text-amber-400 border-amber-500/25",
  bordeaux: "bg-bordeaux/25 text-champagne-muted border-bordeaux-light/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider sm:text-[0.6875rem]",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
