"use client";

import { Suspense } from "react";
import { ZoekFilterBar } from "@/components/zoek/zoek-filter-bar";
import { ZoekHeroSearch } from "@/components/zoek/zoek-hero-search";
import { ZoekActiveChips } from "@/components/zoek/zoek-active-chips";
import { ZoekQuickFilters } from "@/components/zoek/zoek-quick-filters";
import { ZoekSavedSearches } from "@/components/zoek/zoek-saved-searches";
import { ZoekResults } from "@/components/zoek/zoek-results";
import { useTranslation } from "@/contexts/locale-context";
import type { Advertentie } from "@/lib/types";

interface ZoekenPageContentProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  fotoCounts: Map<string, number>;
  filtersActive: boolean;
  fallbackPremium: Advertentie[];
  fallbackLatest: Advertentie[];
  fallbackFotos: Map<string, string | undefined>;
  aiQuery?: string;
}

function SparklesIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[var(--champagne)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

export function ZoekenPageContent({
  advertenties,
  fotos,
  fotoCounts,
  filtersActive,
  fallbackPremium,
  fallbackLatest,
  fallbackFotos,
  aiQuery,
}: ZoekenPageContentProps) {
  const { t } = useTranslation();

  return (
    <div className="search-page search-page--v2">
      <div className="search-page-top search-page-top--hero">
        <div className="container">
          <h1 className="search-page-top__title">{t("search.title")}</h1>
          <p className="search-page-top__subtitle">{t("search.subtitle")}</p>
          <Suspense fallback={null}>
            <ZoekHeroSearch />
          </Suspense>
        </div>
      </div>

      <div className="container search-page__body">
        <div className="search-page__layout">
          <aside className="search-page__sidebar search-page__sidebar--desktop">
            <Suspense fallback={<div className="zoek-filter-bar zoek-filter-bar--skeleton" />}>
              <ZoekFilterBar />
            </Suspense>
          </aside>

          <div className="search-page__main">
            <div className="search-page__mobile-filters">
              <Suspense fallback={null}>
                <ZoekFilterBar mobileOnly />
              </Suspense>
            </div>
            <Suspense fallback={null}>
              <ZoekQuickFilters />
            </Suspense>
            <Suspense fallback={null}>
              <ZoekSavedSearches />
            </Suspense>
            <Suspense fallback={null}>
              <ZoekActiveChips />
            </Suspense>

            {aiQuery && (
              <div className="zoek-ai-banner">
                <SparklesIcon />
                <span>
                  {t("search.aiBanner")} <strong>{aiQuery}</strong>
                </span>
              </div>
            )}

            <ZoekResults
              advertenties={advertenties}
              fotos={fotos}
              fotoCounts={fotoCounts}
              filtersActive={filtersActive}
              fallbackPremium={fallbackPremium}
              fallbackLatest={fallbackLatest}
              fallbackFotos={fallbackFotos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
