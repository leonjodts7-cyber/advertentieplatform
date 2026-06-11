import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "muted" | "bordeaux" | "gold";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-champagne/10 text-champagne border-champagne/25",
  gold: "bg-champagne/15 text-champagne border-champagne/35",
  success: "bg-emerald-500/12 text-emerald-400 border-emerald-500/25",
  warning: "bg-amber-500/12 text-amber-400 border-amber-500/25",
  muted: "bg-muted/80 text-muted-foreground border-border/60",
  bordeaux: "bg-bordeaux/20 text-champagne-muted border-bordeaux-light/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wider",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
