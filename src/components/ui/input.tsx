import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "dark" | "light" | "onDark";
  size?: "default" | "compact";
}

const variantClasses = {
  dark: cn(
    "ui-input ui-input--dark",
    "border-[var(--border-dark)] bg-[var(--dark-soft)]/90 text-[var(--text-light)]",
    "caret-[var(--champagne)] font-medium",
    "placeholder:text-[var(--muted-light)]",
    "focus-visible:border-[var(--champagne)]/45",
    "focus-visible:ring-[var(--champagne)]/18",
    "focus-visible:shadow-[0_0_0_3px_rgba(214,179,107,0.18)]"
  ),
  light: cn(
    "ui-input ui-input--light",
    "border-[var(--border-light)] bg-[#fffaf6] text-[#171216]",
    "caret-[#7b2f49] font-medium",
    "placeholder:text-[rgba(36,25,31,0.45)]",
    "focus-visible:border-[#d6b36b]",
    "focus-visible:ring-[#d6b36b]/20",
    "focus-visible:shadow-[0_0_0_3px_rgba(214,179,107,0.18)]"
  ),
  onDark: cn(
    "ui-input ui-input--on-dark",
    "border-[#e5d8cf] bg-[#fffaf6] text-[#171216]",
    "caret-[#7b2f49] font-medium",
    "placeholder:text-[rgba(36,25,31,0.45)]",
    "focus-visible:border-[#d6b36b]",
    "focus-visible:ring-[#d6b36b]/20",
    "focus-visible:shadow-[0_0_0_3px_rgba(214,179,107,0.18)]"
  ),
};

const sizeClasses = {
  default: "h-11 min-h-[44px] px-3.5 py-2",
  compact: "h-11 min-h-[44px] px-3 py-1.5 text-sm",
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
