import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  light?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2
          className={
            light
              ? "font-display text-xl font-medium tracking-tight text-[#24191f] sm:text-2xl"
              : "font-display text-xl font-medium tracking-tight text-[#fff6ef] sm:text-2xl"
          }
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={
              light
                ? "mt-1 text-sm text-[#74665f]"
                : "mt-1 text-sm text-[#c2b4ab]"
            }
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
