"use client";

import Link from "next/link";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { ListingCard } from "@/components/listing-card";
import { getListingCardVariant } from "@/lib/listing-card-variant";
import { useFavorites } from "@/contexts/favorites-context";
import { useTranslation } from "@/contexts/locale-context";
import type { Advertentie } from "@/lib/types";

interface FavorietenGridProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  fallbackPremium?: Advertentie[];
  fallbackLatest?: Advertentie[];
  fallbackFotos?: Map<string, string | undefined>;
}

export function FavorietenGrid({
  advertenties,
  fotos,
  fallbackPremium = [],
  fallbackLatest = [],
  fallbackFotos = new Map(),
}: FavorietenGridProps) {
  const { isFavorited } = useFavorites();
  const { t } = useTranslation();

  const visible = advertenties.filter((ad) => isFavorited(ad.id));

  if (visible.length === 0) {
    return (
      <div className="favorieten-page-content">
        <div className="favorieten-empty favorieten-empty--compact">
          <h2 className="favorieten-empty__title">{t("favorites.emptyTitle")}</h2>
          <p className="favorieten-empty__text">{t("favorites.emptyText")}</p>
          <Link href="/zoeken" className="favorieten-empty__cta">
            {t("favorites.searchCta")}
          </Link>
        </div>

        <HorizontalListingsCarousel
          title={t("search.recommended")}
          subtitle={t("search.recommendedSub")}
          items={fallbackLatest}
          fotos={fallbackFotos}
          variant="premium"
          viewAllHref="/zoeken"
          embedded
          className="search-embedded-carousel"
        />

        <HorizontalListingsCarousel
          title={t("search.premiumCarousel")}
          subtitle={t("search.premiumCarouselSub")}
          items={fallbackPremium}
          fotos={fallbackFotos}
          variant="premium"
          viewAllHref="/zoeken?premium_profiel=true"
          embedded
          className="search-embedded-carousel"
        />
      </div>
    );
  }

  return (
    <div className="listing-grid listing-grid--search listing-grid--compact-cards favorieten-grid">
      {visible.map((advertentie) => (
        <ListingCard
          key={advertentie.id}
          advertentie={advertentie}
          afbeeldingUrl={fotos.get(advertentie.id)}
          variant={getListingCardVariant(advertentie)}
        />
      ))}
    </div>
  );
}
