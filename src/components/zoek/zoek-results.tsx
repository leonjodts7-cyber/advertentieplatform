"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AdvertentieCard,
  AdvertentieCardHorizontal,
} from "@/components/advertentie-card";
import { Button } from "@/components/ui/button";
import { isPremiumListing } from "@/lib/advertentie-boost";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ZoekResultsProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  filtersActive: boolean;
}

function profielCountLabel(count: number): string {
  if (count === 0) return "0 profielen gevonden";
  if (count === 1) return "1 profiel gevonden";
  return `${count} profielen gevonden`;
}

export function ZoekResults({
  advertenties,
  fotos,
  filtersActive,
}: ZoekResultsProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <main className="zoek-results">
      <div className="zoek-results__toolbar">
        <p className="zoek-results__count">{profielCountLabel(advertenties.length)}</p>
        <div className="zoek-view-toggle" role="group" aria-label="Weergave">
          <button
            type="button"
            className={cn("zoek-view-toggle__btn", view === "grid" && "zoek-view-toggle__btn--active")}
            onClick={() => setView("grid")}
          >
            Raster
          </button>
          <button
            type="button"
            className={cn("zoek-view-toggle__btn", view === "list" && "zoek-view-toggle__btn--active")}
            onClick={() => setView("list")}
          >
            Lijst
          </button>
        </div>
      </div>

      {advertenties.length > 0 ? (
        view === "grid" ? (
          <div className="listing-grid listing-grid--search">
            {advertenties.map((advertentie) => (
              <AdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
                theme="light"
                premium
                showPremium={isPremiumListing(advertentie)}
                showOnline={advertentie.beschikbaar}
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
        <div className="zoek-empty">
          <h3 className="zoek-empty__title">Geen profielen gevonden</h3>
          <p className="zoek-empty__text">
            Pas je filters aan of bekijk alle actieve profielen.
          </p>
          <div className="zoek-empty__actions">
            {filtersActive && (
              <Button asChild variant="secondary-light" size="sm">
                <Link href="/zoeken">Filters wissen</Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link href="/zoeken">Bekijk alle profielen</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
