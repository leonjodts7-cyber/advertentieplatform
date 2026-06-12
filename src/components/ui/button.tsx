import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "premium"
    | "secondary"
    | "secondary-light"
    | "ghost"
    | "danger"
    | "outline"
    | "rose";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-[#4a1d2f] via-[#7b2f49] to-[#b87955] text-[#fff4ec] border border-[#d6b36b]/20 shadow-sm hover:brightness-[1.04] hover:shadow-warm-glow",
  premium:
    "bg-gradient-to-r from-[#4a1d2f] to-[#7b2f49] text-[#fff4ec] border border-[#9d4963]/35 hover:brightness-105",
  rose:
    "bg-[#7b2f49] text-[#fff4ec] border border-[#9d4963]/40 hover:bg-[#8a3a55]",
  secondary:
    "bg-white/[0.06] text-[#fff4ec] border border-white/13 hover:bg-white/[0.1] hover:border-[#d6b36b]/25",
  "secondary-light":
    "bg-[#fffaf6] text-[#24191f] border border-[#e6d8cf] hover:border-[#7b2f49]/30 hover:bg-[#f4ede7]",
  ghost:
    "bg-transparent text-[#b8aaa2] border border-transparent hover:bg-white/[0.05] hover:text-[#fff4ec]",
  danger:
    "bg-[#8b3040] text-[#fff7ef] border border-[#8b3040]/40 hover:opacity-90",
  outline:
    "border border-white/14 bg-transparent text-[#fff7ef] hover:bg-white/[0.05] hover:border-[#d8b46a]/25",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-10 min-h-[44px] px-3.5 text-xs sm:text-sm",
  md: "h-11 min-h-[44px] px-5 text-sm",
  lg: "h-12 min-h-[44px] px-6 text-sm sm:text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b46a]/35 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
