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
    "bg-gradient-to-r from-[var(--wine)] via-[#8f3a52] to-[var(--bronze)] text-[var(--text-main)] border border-[var(--gold)]/25 shadow-[0_2px_10px_rgba(123,41,70,0.28)] hover:brightness-[1.06] hover:shadow-[0_4px_16px_rgba(123,41,70,0.35)]",
  premium:
    "bg-gradient-to-r from-[var(--wine-deep)] to-[var(--wine)] text-[var(--text-main)] border border-[var(--wine)]/40 hover:brightness-105",
  rose:
    "bg-[var(--wine)] text-[var(--text-main)] border border-[var(--rose-wine)]/40 hover:bg-[#8f3450]",
  secondary:
    "bg-[var(--panel-soft)] text-[var(--text-main)] border border-[var(--border-soft)] hover:bg-[#3a2d34] hover:border-[var(--gold)]/28",
  "secondary-light":
    "bg-[var(--cream-card)] text-[var(--text-dark)] border border-[#e0d4ca] hover:border-[var(--wine)]/35 hover:bg-[var(--cream)]",
  ghost:
    "bg-transparent text-[var(--text-muted)] border border-transparent hover:bg-white/[0.06] hover:text-[var(--text-main)]",
  danger:
    "bg-[var(--danger)] text-[var(--text-main)] border border-[var(--danger)]/40 hover:opacity-90",
  outline:
    "border border-[var(--gold)]/35 bg-transparent text-[var(--text-main)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]/50",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-[44px] h-11 px-3.5 text-xs",
  md: "min-h-[44px] h-11 px-4 text-sm",
  lg: "min-h-[44px] h-11 px-5 text-sm",
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
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-dark)]",
          "disabled:pointer-events-none disabled:opacity-55 disabled:bg-[var(--panel-soft)] disabled:text-[var(--text-muted)] disabled:border-[var(--border-soft)] disabled:shadow-none disabled:from-transparent disabled:to-transparent",
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
