import Link from "next/link";
import { POPULAIRE_STEDEN } from "@/lib/home-preview-profielen";

export function PopularCitiesGrid() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {POPULAIRE_STEDEN.map((stad) => (
        <Link
          key={stad}
          href={`/zoeken?stad=${encodeURIComponent(stad)}`}
          className="profile-card flex min-h-[52px] items-center justify-center px-3 py-3 text-center text-sm font-medium text-muted-foreground transition-all hover:text-soft-champagne"
        >
          {stad}
        </Link>
      ))}
    </div>
  );
}
