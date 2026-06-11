import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "bordeaux";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "gold-gradient text-primary-foreground border border-champagne/25 shadow-glow hover:brightness-110",
  secondary:
    "bg-secondary/90 text-secondary-foreground border border-border/70 hover:bg-secondary hover:border-champagne/20",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent",
  danger:
    "bg-destructive/90 text-destructive-foreground border border-destructive/30 hover:bg-destructive",
  outline:
    "border border-border/70 bg-transparent text-foreground hover:border-champagne/35 hover:bg-champagne/5",
  bordeaux:
    "bg-gradient-to-b from-bordeaux to-bordeaux/85 text-white border border-bordeaux-light/25 hover:brightness-110",
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
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
