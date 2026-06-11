import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[140px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-veloura-ivory",
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

Textarea.displayName = "Textarea";
