import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "online"
    | "verified"
    | "premium"
    | "new"
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
  default: "bg-[#d6b36b]/14 text-[#ecd89a] border-[#d6b36b]/26",
  online: "bg-[#4db87a]/14 text-[#62d490] border-[#4db87a]/28",
  verified: "bg-[#4db87a]/14 text-[#62d490] border-[#4db87a]/28",
  premium: "bg-[#d6b36b]/14 text-[#ecd89a] border-[#d6b36b]/28",
  new: "bg-[#7b2f49]/22 text-[#f0d0d8] border-[#b76d78]/32",
  fictief: "bg-white/[0.06] text-[#c2b4ab] border-white/[0.12]",
  credits: "bg-[#7b2f49]/28 text-[#ecd89a] border-[#b76d78]/32",
  champagne: "bg-[#d6b36b]/14 text-[#ecd89a] border-[#d6b36b]/28",
  gold: "bg-[#d6b36b]/14 text-[#ecd89a] border-[#d6b36b]/28",
  wine: "bg-[#7b2f49]/28 text-[#fff6ef] border-[#9d4963]/32",
  rose: "bg-[#b76d78]/18 text-[#fff6ef] border-[#b76d78]/32",
  bordeaux: "bg-[#7b2f49]/28 text-[#fff6ef] border-[#b76d78]/32",
  green: "bg-[#4db87a]/14 text-[#62d490] border-[#4db87a]/28",
  success: "bg-[#4db87a]/14 text-[#62d490] border-[#4db87a]/28",
  muted: "bg-black/22 text-[#d4ccc6] border-white/[0.12] backdrop-blur-sm",
  review: "bg-[#d6b36b]/12 text-[#ecd89a] border-[#d6b36b]/20",
  danger: "bg-[#8b3040]/22 text-red-300 border-[#8b3040]/32",
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
