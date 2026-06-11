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
    "bg-veloura-champagne/90 text-veloura-bg border border-veloura-champagne/30 hover:bg-veloura-champagne hover:shadow-glow",
  rose:
    "bg-veloura-rose/85 text-veloura-ivory border border-veloura-rose/30 hover:bg-veloura-rose",
  secondary:
    "bg-white/[0.06] text-veloura-ivory border border-white/10 hover:bg-white/[0.1] hover:border-white/15",
  ghost:
    "bg-transparent text-veloura-soft border border-transparent hover:bg-white/[0.05] hover:text-veloura-ivory",
  danger:
    "bg-destructive/80 text-veloura-ivory border border-destructive/30 hover:bg-destructive",
  outline:
    "border border-white/12 bg-transparent text-veloura-ivory hover:border-veloura-champagne/35 hover:bg-veloura-champagne/5",
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veloura-champagne/50 focus-visible:ring-offset-2 focus-visible:ring-offset-veloura-bg",
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
