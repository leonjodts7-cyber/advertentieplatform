"use client";

import { FavorietenGrid } from "@/components/favorieten-grid";
import { useTranslation } from "@/contexts/locale-context";
import type { Advertentie } from "@/lib/types";

interface FavorietenPageHeaderProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  fallbackPremium: Advertentie[];
  fallbackLatest: Advertentie[];
  fallbackFotos: Map<string, string | undefined>;
}

export function FavorietenPageContent({
  advertenties,
  fotos,
  fallbackPremium,
  fallbackLatest,
  fallbackFotos,
}: FavorietenPageHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="search-page search-page--compact favorieten-page">
      <div className="search-page-top search-page-top--compact">
        <div className="container">
          <h1 className="search-page-top__title">{t("favorites.title")}</h1>
          <p className="search-page-top__subtitle">{t("favorites.subtitle")}</p>
        </div>
      </div>

      <div className="container search-page__body">
        <FavorietenGrid
          advertenties={advertenties}
          fotos={fotos}
          fallbackPremium={fallbackPremium}
          fallbackLatest={fallbackLatest}
          fallbackFotos={fallbackFotos}
        />
      </div>
    </div>
  );
}
