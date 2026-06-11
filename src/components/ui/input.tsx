import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 min-h-[44px] w-full rounded-xl border border-white/[0.12] bg-white/[0.055] px-4 py-2 text-sm text-veloura-ivory",
        "placeholder:text-veloura-muted",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:border-veloura-champagne/45 focus-visible:ring-2 focus-visible:ring-veloura-champagne/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
