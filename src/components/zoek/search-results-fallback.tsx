"use client";

import Link from "next/link";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { RecentBekekenSection } from "@/components/recent-bekeken-section";
import { useTranslation } from "@/contexts/locale-context";
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
  const { t } = useTranslation();

  return (
    <div className="search-results-fallback">
      <div className="zoek-empty">
        <h3 className="zoek-empty__title">{t("search.emptyTitle")}</h3>
        <p className="zoek-empty__text">
          {filtersActive ? t("search.emptyFiltered") : t("search.emptyDefault")}
        </p>
        <div className="zoek-empty__actions">
          <Link href="/zoeken" className="zoek-empty__cta zoek-empty__cta--primary">
            {filtersActive ? t("search.clearFilters") : t("search.viewAll")}
          </Link>
        </div>
      </div>

      <HorizontalListingsCarousel
        title={t("search.recommended")}
        subtitle={t("search.recommendedSub")}
        items={latest}
        fotos={fotos}
        variant="premium"
        viewAllHref="/zoeken"
        embedded
        className="search-embedded-carousel"
      />

      <HorizontalListingsCarousel
        title={t("search.premiumCarousel")}
        subtitle={t("search.premiumCarouselSub")}
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
