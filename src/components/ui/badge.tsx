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
  default: "bg-[#d8b46a]/15 text-[#ecd89a] border-[#d8b46a]/28",
  online: "bg-[#4db87a]/14 text-[#62d490] border-[#4db87a]/30",
  verified: "bg-[#4db87a]/14 text-[#62d490] border-[#4db87a]/30",
  premium: "bg-[#d8b46a]/14 text-[#ecd89a] border-[#d8b46a]/30",
  new: "bg-[#7a2f49]/25 text-[#f0d0d8] border-[#b76d78]/35",
  fictief: "bg-white/[0.06] text-[#b7aaa2] border-white/12",
  credits: "bg-[#7a2f49]/30 text-[#ecd89a] border-[#b76d78]/35",
  champagne: "bg-[#d8b46a]/14 text-[#ecd89a] border-[#d8b46a]/30",
  gold: "bg-[#d8b46a]/14 text-[#ecd89a] border-[#d8b46a]/30",
  wine: "bg-[#7b2f49]/30 text-[#fff4ec] border-[#9d4963]/35",
  rose: "bg-[#b76d78]/20 text-[#fff7ef] border-[#b76d78]/35",
  bordeaux: "bg-[#7a2f49]/30 text-[#fff7ef] border-[#b76d78]/35",
  green: "bg-[#4db87a]/14 text-[#62d490] border-[#4db87a]/30",
  success: "bg-[#4db87a]/14 text-[#62d490] border-[#4db87a]/30",
  muted: "bg-black/25 text-[#d4ccc6] border-white/12 backdrop-blur-sm",
  review: "bg-[#d8b46a]/12 text-[#ecd89a] border-[#d8b46a]/22",
  danger: "bg-[#8b3040]/25 text-red-300 border-[#8b3040]/35",
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
