import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 min-h-[44px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-veloura-ivory",
        "placeholder:text-veloura-soft/60",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:border-veloura-champagne/40 focus-visible:ring-2 focus-visible:ring-veloura-champagne/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
