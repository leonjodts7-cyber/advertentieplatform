"use client";

import { useState } from "react";
import { AdvertentieCardHorizontal } from "@/components/advertentie-card";
import { ListingCard } from "@/components/listing-card";
import { SearchResultsFallback } from "@/components/zoek/search-results-fallback";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ZoekResultsProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  filtersActive: boolean;
  fallbackPremium?: Advertentie[];
  fallbackLatest?: Advertentie[];
  fallbackFotos?: Map<string, string | undefined>;
}

function profielCountLabel(count: number): string {
  if (count === 0) return "Geen profielen gevonden";
  if (count === 1) return "1 profiel gevonden";
  return `${count} profielen gevonden`;
}

export function ZoekResults({
  advertenties,
  fotos,
  filtersActive,
  fallbackPremium = [],
  fallbackLatest = [],
  fallbackFotos = new Map(),
}: ZoekResultsProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const isEmpty = advertenties.length === 0;

  return (
    <main className="zoek-results">
      <div className="zoek-results__toolbar">
        <p className="zoek-results__count">{profielCountLabel(advertenties.length)}</p>
        {!isEmpty && (
          <div className="zoek-view-toggle" role="group" aria-label="Weergave">
            <button
              type="button"
              className={cn(
                "zoek-view-toggle__btn",
                view === "grid" && "zoek-view-toggle__btn--active"
              )}
              onClick={() => setView("grid")}
            >
              Raster
            </button>
            <button
              type="button"
              className={cn(
                "zoek-view-toggle__btn",
                view === "list" && "zoek-view-toggle__btn--active"
              )}
              onClick={() => setView("list")}
            >
              Lijst
            </button>
          </div>
        )}
      </div>

      {!isEmpty ? (
        view === "grid" ? (
          <div className="listing-grid listing-grid--search listing-grid--compact-cards">
            {advertenties.map((advertentie) => (
              <ListingCard
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
                variant="premium"
              />
            ))}
          </div>
        ) : (
          <div className="listing-list">
            {advertenties.map((advertentie) => (
              <AdvertentieCardHorizontal
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
              />
            ))}
          </div>
        )
      ) : (
        <SearchResultsFallback
          premium={fallbackPremium}
          latest={fallbackLatest}
          fotos={fallbackFotos}
          filtersActive={filtersActive}
        />
      )}
    </main>
  );
}
