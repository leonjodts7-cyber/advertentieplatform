import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "dark" | "light";
  size?: "default" | "compact";
}

const variantClasses = {
  dark: cn(
    "ui-input ui-input--dark",
    "border-[var(--border-dark)] bg-[var(--dark-soft)]/90 text-[var(--text-light)]",
    "caret-[var(--champagne)]",
    "placeholder:text-[var(--muted-light)]",
    "focus-visible:border-[var(--champagne)]/45",
    "focus-visible:ring-[var(--champagne)]/18",
    "focus-visible:shadow-[0_0_0_3px_rgba(214,179,107,0.1)]"
  ),
  light: cn(
    "ui-input ui-input--light",
    "border-[var(--border-light)] bg-[var(--card-light)] text-[#171216]",
    "caret-[#7b2f49]",
    "placeholder:text-[var(--muted-dark)]",
    "focus-visible:border-[#7b2f49]/55",
    "focus-visible:ring-[#7b2f49]/15",
    "focus-visible:shadow-[0_0_0_3px_rgba(123,47,73,0.12)]"
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
        "flex w-full rounded-xl border text-sm opacity-100",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        type === "password" && "ui-input--password",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
