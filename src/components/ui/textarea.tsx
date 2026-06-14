import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[140px] w-full rounded-xl border border-white/[0.12] bg-[#211820]/80 px-4 py-3 text-sm text-[#fff6ef]",
        "placeholder:text-[#c2b4ab]",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:border-[#d6b36b]/45 focus-visible:ring-2 focus-visible:ring-[#d6b36b]/15",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
