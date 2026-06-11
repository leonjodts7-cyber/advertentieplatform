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
  default:
    "bg-veloura-champagne/[0.08] text-veloura-champagne/90 border-veloura-champagne/20",
  champagne:
    "bg-veloura-champagne/[0.08] text-veloura-champagne/90 border-veloura-champagne/20",
  gold:
    "bg-veloura-champagne/[0.08] text-veloura-champagne/90 border-veloura-champagne/20",
  rose:
    "bg-veloura-rose/[0.1] text-[#e8b4c0] border-veloura-rose/22",
  green:
    "bg-veloura-green/[0.08] text-veloura-green/90 border-veloura-green/18",
  success:
    "bg-veloura-green/[0.08] text-veloura-green/90 border-veloura-green/18",
  muted:
    "bg-white/[0.04] text-veloura-muted border-white/[0.1]",
  review:
    "bg-veloura-plum-light/50 text-veloura-champagne/85 border-veloura-champagne/18",
  danger:
    "bg-veloura-rose-deep/25 text-[#d4a0aa] border-veloura-rose/20",
  bordeaux:
    "bg-veloura-plum/50 text-veloura-soft border-veloura-rose/18",
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
