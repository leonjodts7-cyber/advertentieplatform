"use client";

import Link from "next/link";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { POPULAIRE_STEDEN, MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import type { Advertentie } from "@/lib/types";

interface SearchResultsFallbackProps {
  premium: Advertentie[];
  latest: Advertentie[];
  fotos: Map<string, string | undefined>;
  filtersActive: boolean;
}

export function SearchResultsFallback({
  premium,
  latest,
  fotos,
  filtersActive,
}: SearchResultsFallbackProps) {
  return (
    <div className="search-results-fallback">
      <div className="zoek-empty">
        <h3 className="zoek-empty__title">Geen profielen gevonden</h3>
        <p className="zoek-empty__text">
          {filtersActive
            ? "Pas je filters aan of bekijk alle actieve profielen."
            : "Er zijn momenteel geen profielen die aan je zoekopdracht voldoen."}
        </p>
        <div className="zoek-empty__actions">
          <Link href="/zoeken" className="zoek-empty__cta zoek-empty__cta--primary">
            Bekijk alle profielen
          </Link>
          {filtersActive && (
            <Link href="/zoeken" className="zoek-empty__cta zoek-empty__cta--secondary">
              Filters wissen
            </Link>
          )}
        </div>
      </div>

      <HorizontalListingsCarousel
        title="Aanbevolen premium profielen"
        subtitle="Uitgelichte profielen op Veloura."
        items={premium}
        fotos={fotos}
        variant="premium"
        viewAllHref="/zoeken?premium_profiel=true"
        embedded
        className="search-embedded-carousel"
      />

      <HorizontalListingsCarousel
        title="Nieuwste profielen"
        subtitle="Recent geplaatste advertenties."
        items={latest}
        fotos={fotos}
        variant="latest"
        viewAllHref="/zoeken"
        embedded
        className="search-embedded-carousel"
      />

      <section className="search-fallback-categories">
        <h3 className="search-fallback-categories__title">Populaire categorieën</h3>
        <div className="search-fallback-chips">
          {MARKETPLACE_CATEGORIEEN.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              href={`/zoeken?categorie=${cat.slug}`}
              className="search-fallback-chip"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="search-fallback-categories">
        <h3 className="search-fallback-categories__title">Populaire steden</h3>
        <div className="search-fallback-chips">
          {POPULAIRE_STEDEN.slice(0, 8).map((stad) => (
            <Link
              key={stad}
              href={`/zoeken?stad=${encodeURIComponent(stad)}`}
              className="search-fallback-chip"
            >
              {stad}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
