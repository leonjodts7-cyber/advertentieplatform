import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "champagne"
    | "rose"
    | "green"
    | "muted"
    | "review"
    | "danger"
    | "premium"
    | "default"
    | "gold"
    | "success"
    | "bordeaux";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary-soft text-primary-dark border-primary/20",
  champagne: "bg-accent-soft text-[#8a6530] border-accent/30",
  gold: "bg-accent-soft text-[#8a6530] border-accent/30",
  premium: "bg-accent-soft text-[#8a6530] border-accent/30",
  rose: "bg-primary-soft text-primary-dark border-primary/25",
  green: "bg-success/10 text-success border-success/25",
  success: "bg-success/10 text-success border-success/25",
  muted: "bg-surface-soft text-muted-foreground border-border",
  review: "bg-accent-soft/80 text-[#8a6530] border-accent/25",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  bordeaux: "bg-primary-soft text-primary-dark border-primary/20",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider sm:text-[0.6875rem]",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
