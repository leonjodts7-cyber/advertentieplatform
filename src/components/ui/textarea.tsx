import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[140px] w-full rounded-xl border border-white/[0.12] bg-white/[0.055] px-4 py-3 text-sm text-veloura-ivory",
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

Textarea.displayName = "Textarea";
