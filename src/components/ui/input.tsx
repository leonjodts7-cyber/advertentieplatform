import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "dark" | "light";
  size?: "default" | "compact";
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

const sizeClasses = {
  default: "h-10 min-h-[40px] px-3.5 py-2",
  compact: "h-9 min-h-[36px] px-3 py-1.5 text-sm",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", variant = "dark", size = "default", ...props },
    ref
  ) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex w-full rounded-xl border text-sm",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
