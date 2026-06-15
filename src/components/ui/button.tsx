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
    "bg-gradient-to-r from-[#4a1d2f] via-[#7b2f49] to-[#b87955] text-[#fff6ef] border border-[#d6b36b]/22 shadow-sm hover:brightness-[1.04] hover:shadow-warm-glow",
  premium:
    "bg-gradient-to-r from-[#4a1d2f] to-[#7b2f49] text-[#fff6ef] border border-[#9d4963]/35 hover:brightness-105",
  rose:
    "bg-[#7b2f49] text-[#fff6ef] border border-[#9d4963]/40 hover:bg-[#8a3a55]",
  secondary:
    "bg-white/[0.06] text-[#fff6ef] border border-white/[0.14] hover:bg-white/[0.1] hover:border-[#d6b36b]/28",
  "secondary-light":
    "bg-[#fffaf6] text-[#24191f] border border-[#e6d8cf] hover:border-[#7b2f49]/28 hover:bg-[#f4ede7]",
  ghost:
    "bg-transparent text-[#c2b4ab] border border-transparent hover:bg-white/[0.05] hover:text-[#fff6ef]",
  danger:
    "bg-[#8b3040] text-[#fff6ef] border border-[#8b3040]/40 hover:opacity-90",
  outline:
    "border border-white/[0.14] bg-transparent text-[#fff6ef] hover:bg-white/[0.05] hover:border-[#d6b36b]/28",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 min-h-[32px] px-3 text-xs",
  md: "h-9 min-h-[36px] px-4 text-sm",
  lg: "h-10 min-h-[40px] px-5 text-sm",
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b36b]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1519]",
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
