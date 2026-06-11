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
    "bg-primary text-white border border-primary-dark/15 shadow-sm hover:bg-primary-dark hover:shadow-md",
  premium:
    "bg-gradient-to-b from-accent to-[#c99550] text-foreground border border-accent/25 shadow-sm hover:from-[#e8c982] hover:to-[#d6ad5f] hover:shadow-card",
  rose: "bg-primary text-white border border-primary-dark/15 hover:bg-primary-dark",
  secondary:
    "bg-transparent text-foreground border border-border hover:bg-surface-soft hover:border-primary/25",
  ghost:
    "bg-transparent text-muted-foreground border border-transparent hover:bg-surface-soft hover:text-foreground",
  danger:
    "bg-destructive text-white border border-destructive/20 hover:opacity-90",
  outline:
    "border border-border bg-white text-foreground hover:bg-surface-soft hover:border-primary/20",
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
