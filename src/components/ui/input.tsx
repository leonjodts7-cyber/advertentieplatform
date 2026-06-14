import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "dark" | "light";
}

const variantClasses = {
  dark: cn(
    "border-white/[0.14] bg-[#211820]/85 text-[#fff6ef]",
    "placeholder:text-[#c2b4ab]",
    "focus-visible:border-[#d6b36b]/45 focus-visible:ring-[#d6b36b]/18"
  ),
  light: cn(
    "border-[#e6d8cf] bg-[#fffaf6] text-[#24191f]",
    "placeholder:text-[#74665f]",
    "focus-visible:border-[#7b2f49]/35 focus-visible:ring-[#7b2f49]/12"
  ),
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant = "dark", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 min-h-[44px] w-full rounded-xl border px-4 py-2 text-sm",
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

Input.displayName = "Input";
