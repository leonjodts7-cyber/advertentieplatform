import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[140px] w-full rounded-xl border border-border/80 bg-input/50 px-4 py-3 text-sm text-foreground",
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

Textarea.displayName = "Textarea";
