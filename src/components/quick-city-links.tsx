import Link from "next/link";
import { cn } from "@/lib/utils";

const STEDEN = ["Antwerpen", "Gent", "Brussel", "Leuven"] as const;

interface QuickCityLinksProps {
  className?: string;
  size?: "sm" | "md";
}

export function QuickCityLinks({ className, size = "md" }: QuickCityLinksProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {STEDEN.map((stad) => (
        <Link
          key={stad}
          href={`/zoeken?stad=${encodeURIComponent(stad)}`}
          className={cn(
            "city-pill",
            size === "sm" && "min-h-[36px] px-3 py-1 text-xs"
          )}
        >
          {stad}
        </Link>
      ))}
    </div>
  );
}
