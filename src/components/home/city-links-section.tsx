import Link from "next/link";
import { RECENTE_STEDEN } from "@/lib/marketplace";

export function CityLinksSection() {
  return (
    <section className="home-listing-block home-listing-block--compact">
      <div className="container">
        <h2 className="home-listing-block__title">Populaire steden</h2>
        <div className="city-links-grid">
          {RECENTE_STEDEN.map((stad) => (
            <Link
              key={stad}
              href={`/zoeken?stad=${encodeURIComponent(stad)}`}
              className="city-link-card"
            >
              {stad}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
