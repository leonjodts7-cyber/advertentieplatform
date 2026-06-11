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
    | "default"
    | "gold"
    | "success"
    | "bordeaux";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-veloura-champagne/12 text-veloura-champagne border-veloura-champagne/25",
  champagne: "bg-veloura-champagne/12 text-veloura-champagne border-veloura-champagne/25",
  gold: "bg-veloura-champagne/12 text-veloura-champagne border-veloura-champagne/25",
  rose: "bg-veloura-rose/15 text-[#e8b4bb] border-veloura-rose/30",
  green: "bg-emerald-400/10 text-emerald-300/90 border-emerald-400/20",
  success: "bg-emerald-400/10 text-emerald-300/90 border-emerald-400/20",
  muted: "bg-white/[0.04] text-veloura-soft border-white/10",
  review: "bg-veloura-champagne/10 text-veloura-champagne border-veloura-champagne/20",
  danger: "bg-red-400/10 text-red-300/90 border-red-400/20",
  bordeaux: "bg-veloura-plum/60 text-veloura-soft border-veloura-rose/20",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wider sm:text-[0.6875rem]",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
