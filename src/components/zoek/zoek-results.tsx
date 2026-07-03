"use client";

import { useState } from "react";
import { AdvertentieCardHorizontal } from "@/components/advertentie-card";
import { ListingCard } from "@/components/listing-card";
import { RecentBekekenSection } from "@/components/recent-bekeken-section";
import { SearchResultsFallback } from "@/components/zoek/search-results-fallback";
import { ZoekSortDropdown } from "@/components/zoek/zoek-sort-dropdown";
import { useTranslation } from "@/contexts/locale-context";
import { getListingCardVariant } from "@/lib/listing-card-variant";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ZoekResultsProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  fotoCounts?: Map<string, number>;
  filtersActive: boolean;
  fallbackPremium?: Advertentie[];
  fallbackLatest?: Advertentie[];
  fallbackFotos?: Map<string, string | undefined>;
}

export function ZoekResults({
  advertenties,
  fotos,
  fotoCounts = new Map(),
  filtersActive,
  fallbackPremium = [],
  fallbackLatest = [],
  fallbackFotos = new Map(),
}: ZoekResultsProps) {
  const [view, setView] = useState<"grid" | "compact" | "list">("grid");
  const { t } = useTranslation();
  const isEmpty = advertenties.length === 0;

  function countLabel(count: number): string {
    if (count === 0) return t("search.noneFound");
    if (count === 1) return t("search.oneFound");
    return t("search.manyFound", { count });
  }

  return (
    <section className="zoek-results zoek-results--sticky" aria-label={t("search.results")}>
      <div className="zoek-results__toolbar zoek-results__toolbar--sticky">
        <p className="zoek-results__count">{countLabel(advertenties.length)}</p>
        <div className="zoek-results__controls">
          {!isEmpty && <ZoekSortDropdown />}
          {!isEmpty && (
            <div className="zoek-view-toggle" role="group" aria-label={t("search.viewMode")}>
              <button
                type="button"
                className={cn(
                  "zoek-view-toggle__btn",
                  view === "grid" && "zoek-view-toggle__btn--active"
                )}
                onClick={() => setView("grid")}
              >
                {t("search.grid")}
              </button>
              <button
                type="button"
                className={cn(
                  "zoek-view-toggle__btn",
                  view === "compact" && "zoek-view-toggle__btn--active"
                )}
                onClick={() => setView("compact")}
              >
                {t("search.compactGrid")}
              </button>
              <button
                type="button"
                className={cn(
                  "zoek-view-toggle__btn",
                  view === "list" && "zoek-view-toggle__btn--active"
                )}
                onClick={() => setView("list")}
              >
                {t("search.list")}
              </button>
            </div>
          )}
        </div>
      </div>

      {!isEmpty ? (
        <>
          {view === "grid" || view === "compact" ? (
            <div
              className={cn(
                "listing-grid listing-grid--search",
                view === "compact" && "listing-grid--compact-cards listing-grid--dense"
              )}
            >
              {advertenties.map((advertentie) => (
                <ListingCard
                  key={advertentie.id}
                  advertentie={advertentie}
                  afbeeldingUrl={fotos.get(advertentie.id)}
                  variant={getListingCardVariant(advertentie)}
                  fotoCount={fotoCounts.get(advertentie.id) ?? 0}
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
          )}
          <RecentBekekenSection variant="embedded" className="search-embedded-carousel" />
        </>
      ) : (
        <SearchResultsFallback
          premium={fallbackPremium}
          latest={fallbackLatest}
          fotos={fallbackFotos}
          filtersActive={filtersActive}
        />
      )}
    </section>
  );
}
