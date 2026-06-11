import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "bordeaux";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-b from-champagne to-champagne/85 text-primary-foreground border border-champagne/30 shadow-glow hover:from-champagne/95 hover:to-champagne/75",
  secondary:
    "bg-secondary/80 text-secondary-foreground border border-border hover:bg-secondary hover:border-border/80",
  outline:
    "border border-border/80 bg-transparent text-foreground hover:border-champagne/40 hover:bg-champagne/5",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
  destructive:
    "bg-destructive/90 text-destructive-foreground border border-destructive/30 hover:bg-destructive",
  bordeaux:
    "bg-gradient-to-b from-bordeaux to-bordeaux/80 text-white border border-bordeaux-light/30 hover:from-bordeaux-light hover:to-bordeaux",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-10 min-h-[44px] px-4 text-sm",
  md: "h-11 min-h-[44px] px-5 text-sm",
  lg: "h-12 min-h-[44px] px-7 text-base",
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
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-wide transition-all duration-200",
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
