"use client";

import Link from "next/link";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { RecentBekekenSection } from "@/components/recent-bekeken-section";
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
            {filtersActive ? "Filters wissen & alles bekijken" : "Bekijk alle profielen"}
          </Link>
        </div>
      </div>

      <HorizontalListingsCarousel
        title="Aanbevolen profielen"
        subtitle="Ontdek populaire profielen op Veloura."
        items={latest}
        fotos={fotos}
        variant="premium"
        viewAllHref="/zoeken"
        embedded
        className="search-embedded-carousel"
      />

      <HorizontalListingsCarousel
        title="Premium advertenties"
        subtitle="Extra zichtbaarheid en premium profielen."
        items={premium}
        fotos={fotos}
        variant="premium"
        viewAllHref="/zoeken?premium_profiel=true"
        embedded
        className="search-embedded-carousel"
      />

      <RecentBekekenSection variant="embedded" className="search-embedded-carousel" />
    </div>
  );
}
