import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "rose";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-b from-[#e8c982] to-[#d6ad5f] text-[#160f13] border border-[#e8c982]/25 shadow-champagne hover:from-[#f0d49a] hover:to-[#e0b96a] hover:shadow-glow",
  rose:
    "bg-gradient-to-b from-veloura-rose/90 to-veloura-rose-deep/90 text-veloura-ivory border border-veloura-rose/25 hover:brightness-110",
  secondary:
    "bg-white/[0.04] text-veloura-ivory border border-white/[0.12] backdrop-blur-sm hover:bg-white/[0.08] hover:border-veloura-champagne/20",
  ghost:
    "bg-transparent text-veloura-muted border border-transparent hover:bg-white/[0.04] hover:text-veloura-ivory",
  danger:
    "bg-veloura-rose-deep/70 text-veloura-ivory border border-veloura-rose/25 hover:bg-veloura-rose-deep/85",
  outline:
    "border border-white/[0.12] bg-transparent text-veloura-ivory hover:border-veloura-champagne/28 hover:bg-veloura-champagne/[0.06]",
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veloura-champagne/40 focus-visible:ring-offset-2 focus-visible:ring-offset-veloura-bg",
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
