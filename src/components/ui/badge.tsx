import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "online"
    | "verified"
    | "premium"
    | "fictief"
    | "credits"
    | "champagne"
    | "wine"
    | "green"
    | "muted"
    | "review"
    | "danger"
    | "default"
    | "gold"
    | "success"
    | "rose"
    | "bordeaux";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-champagne/12 text-soft-champagne border-champagne/25",
  online: "bg-success/12 text-success border-success/30",
  verified: "bg-success/12 text-success border-success/30",
  premium: "bg-champagne/12 text-soft-champagne border-champagne/30",
  fictief: "bg-white/[0.05] text-muted-foreground border-white/12",
  credits: "bg-wine/30 text-soft-champagne border-wine-light/35",
  champagne: "bg-champagne/12 text-soft-champagne border-champagne/30",
  gold: "bg-champagne/12 text-soft-champagne border-champagne/30",
  wine: "bg-wine/35 text-foreground border-wine-light/40",
  rose: "bg-wine/25 text-foreground border-rose-nude/35",
  bordeaux: "bg-wine/35 text-foreground border-wine-light/40",
  green: "bg-success/12 text-success border-success/30",
  success: "bg-success/12 text-success border-success/30",
  muted: "bg-white/[0.06] text-muted-foreground border-white/12",
  review: "bg-champagne/12 text-soft-champagne border-champagne/22",
  danger: "bg-destructive/20 text-red-300 border-destructive/30",
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
