import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "premium" | "secondary" | "ghost" | "danger" | "outline" | "rose";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-wine-deep via-wine to-wine-light/90 text-foreground border border-champagne/15 shadow-sm hover:brightness-[1.04] hover:shadow-warm-glow",
  premium:
    "bg-gradient-to-r from-wine-deep to-wine text-foreground border border-wine-light/30 hover:brightness-110",
  rose:
    "bg-wine text-foreground border border-wine-light/40 hover:bg-wine-light",
  secondary:
    "bg-white/[0.05] text-foreground border border-white/12 hover:bg-white/[0.08] hover:border-champagne/25 backdrop-blur-sm",
  ghost:
    "bg-transparent text-muted-foreground border border-transparent hover:bg-white/[0.05] hover:text-foreground",
  danger:
    "bg-destructive text-foreground border border-destructive/40 hover:opacity-90",
  outline:
    "border border-white/12 bg-transparent text-foreground hover:bg-white/[0.05] hover:border-champagne/25",
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
