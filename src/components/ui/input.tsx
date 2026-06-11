import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 min-h-[44px] w-full rounded-xl border border-border/80 bg-input/50 px-4 py-2 text-sm text-foreground",
        "shadow-inner shadow-black/10",
        "placeholder:text-muted-foreground/70",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:border-champagne/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
