import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "dark" | "light" | "onDark";
}

const variantClasses = {
  dark: cn(
    "border-white/[0.14] bg-[var(--dark-soft)]/90 text-[var(--text-light)]",
    "placeholder:text-[var(--muted-light)]",
    "focus-visible:border-[var(--champagne)]/45 focus-visible:ring-[var(--champagne)]/15"
  ),
  light: cn(
    "border-[var(--border-light)] bg-[var(--card-light)] text-[var(--text-dark)]",
    "placeholder:text-[var(--muted-dark)]",
    "focus-visible:border-[var(--wine)]/35 focus-visible:ring-[var(--wine)]/12"
  ),
  onDark: cn(
    "border-[#e5d8cf] bg-[#fffaf6] text-[#171216] font-medium",
    "caret-[#7b2f49]",
    "placeholder:text-[rgba(36,25,31,0.45)]",
    "focus-visible:border-[#d6b36b] focus-visible:ring-[#d6b36b]/20",
    "focus-visible:shadow-[0_0_0_3px_rgba(214,179,107,0.18)]"
  ),
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "dark", ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border px-4 py-3 text-sm",
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

Textarea.displayName = "Textarea";
