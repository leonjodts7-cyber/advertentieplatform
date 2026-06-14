import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "dark" | "light";
}

const variantClasses = {
  dark: cn(
    "border-[var(--border-dark)] bg-[var(--dark-soft)]/90 text-[var(--text-light)]",
    "placeholder:text-[var(--muted-light)]",
    "focus-visible:border-[var(--champagne)]/45 focus-visible:ring-[var(--champagne)]/18"
  ),
  light: cn(
    "border-[var(--border-light)] bg-[var(--card-light)] text-[var(--text-dark)]",
    "placeholder:text-[var(--muted-dark)]",
    "focus-visible:border-[var(--wine)]/35 focus-visible:ring-[var(--wine)]/12"
  ),
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant = "dark", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 min-h-[40px] w-full rounded-xl border px-3.5 py-2 text-sm",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
