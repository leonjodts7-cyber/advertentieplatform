import Link from "next/link";
import { MapPin } from "lucide-react";

const STEDEN = [
  { naam: "Antwerpen", placeholder: 248 },
  { naam: "Brussel", placeholder: 182 },
  { naam: "Gent", placeholder: 156 },
  { naam: "Leuven", placeholder: 94 },
  { naam: "Hasselt", placeholder: 67 },
  { naam: "Brugge", placeholder: 83 },
] as const;

interface CityDiscoveryProps {
  counts: Record<string, number>;
}

export function CityDiscovery({ counts }: CityDiscoveryProps) {
  return (
    <section className="discovery-section discovery-section--light">
      <div className="container">
        <h2 className="font-display text-xl font-medium text-[#24191f] sm:text-2xl">
          Populaire steden
        </h2>
        <p className="mt-1 text-sm text-[#74665f]">
          Vind profielen in jouw regio
        </p>
        <div className="discovery-city-grid mt-5">
          {STEDEN.map((stad) => {
            const count = counts[stad.naam] ?? 0;
            const displayCount = count > 0 ? count : stad.placeholder;

            return (
              <Link
                key={stad.naam}
                href={`/zoeken?stad=${encodeURIComponent(stad.naam)}`}
                className="discovery-city-card group"
              >
                <div className="discovery-city-card__icon">
                  <MapPin className="h-4 w-4 text-[#7b2f49]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="discovery-city-card__title">{stad.naam}</h3>
                  <p className="discovery-city-card__count">
                    {displayCount} advertenties
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
