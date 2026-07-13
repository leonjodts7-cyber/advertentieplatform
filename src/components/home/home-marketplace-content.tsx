"use client";

import { useEffect, useState } from "react";
import { HomeHeroCompact } from "@/components/home/home-hero";
import { AiLoungeTeaser } from "@/components/home/ai-lounge-teaser";
import { CategoryCompactGrid } from "@/components/home/category-compact-grid";
import { CityQuickLinks } from "@/components/home/city-quick-links";
import { HomeProviderCta } from "@/components/home/home-provider-cta";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { HomeNearbyCarouselSection } from "@/components/home/home-nearby-carousel-section";
import { WhyVelouraDiscovery } from "@/components/home/why-veloura-discovery";
import { RecentBekekenSection } from "@/components/recent-bekeken-section";
import { useTranslation } from "@/contexts/locale-context";
import { getTopInterestCategory, getTopInterestCity } from "@/lib/interest-signals";
import type { Advertentie } from "@/lib/types";

interface HomeMarketplaceContentProps {
  spotlight: Advertentie[];
  premium: Advertentie[];
  nearby: Advertentie[];
  trending: Advertentie[];
  nieuwVandaag: Advertentie[];
  meestOpgeslagen: Advertentie[];
  onlineNu: Advertentie[];
  editorsChoice: Advertentie[];
  bestBeoordeeld: Advertentie[];
  snelStijgende: Advertentie[];
  nieuweAanbieders: Advertentie[];
  recentBijgewerkt: Advertentie[];
  fotos: Map<string, string | undefined>;
  fotoCounts: Map<string, number>;
}

export function HomeMarketplaceContent({
  spotlight,
  premium,
  nearby,
  trending,
  nieuwVandaag,
  meestOpgeslagen,
  onlineNu,
  editorsChoice,
  bestBeoordeeld,
  snelStijgende,
  nieuweAanbieders,
  recentBijgewerkt,
  fotos,
  fotoCounts,
}: HomeMarketplaceContentProps) {
  const { t } = useTranslation();
  const [interestCity, setInterestCity] = useState<string | null>(null);
  const [interestCategory, setInterestCategory] = useState<string | null>(null);

  useEffect(() => {
    setInterestCity(getTopInterestCity());
    setInterestCategory(getTopInterestCategory());
  }, []);

  return (
    <div className="home-page home-page--marketplace home-page--discovery overflow-x-hidden">
      <HomeHeroCompact />

      <CategoryCompactGrid />
      <CityQuickLinks />

      <HorizontalListingsCarousel
        title={t("home.spotlightTitle")}
        subtitle={t("home.spotlightSubtitle")}
        items={spotlight}
        fotos={fotos}
        variant="spotlight"
        viewAllHref="/zoeken?spotlight=1"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("discovery.editorsChoiceTitle")}
        subtitle={t("discovery.editorsChoiceSubtitle")}
        items={editorsChoice}
        fotos={fotos}
        variant="premium"
        viewAllHref="/zoeken?premium_profiel=true"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("discovery.onlineNowTitle")}
        subtitle={t("discovery.onlineNowSubtitle")}
        items={onlineNu}
        fotos={fotos}
        variant="latest"
        viewAllHref="/zoeken?beschikbaar=true"
        fotoCounts={fotoCounts}
      />

      <HomeNearbyCarouselSection
        advertenties={nearby}
        fotos={fotos}
        fotoCounts={fotoCounts}
      />

      {(interestCity || interestCategory) && (
        <HorizontalListingsCarousel
          title={t("discovery.forYouTitle")}
          subtitle={t("discovery.forYouSubtitle")}
          items={trending}
          fotos={fotos}
          variant="popular"
          viewAllHref={
            interestCategory
              ? `/zoeken?categorie=${interestCategory}${interestCity ? `&stad=${encodeURIComponent(interestCity)}` : ""}`
              : interestCity
                ? `/zoeken?stad=${encodeURIComponent(interestCity)}`
                : "/zoeken"
          }
          fotoCounts={fotoCounts}
        />
      )}

      <HorizontalListingsCarousel
        title={t("home.trendingTitle")}
        subtitle={t("home.trendingSubtitle")}
        items={trending}
        fotos={fotos}
        variant="popular"
        viewAllHref="/zoeken?sort=aanbevolen"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("discovery.risingTitle")}
        subtitle={t("discovery.risingSubtitle")}
        items={snelStijgende}
        fotos={fotos}
        variant="popular"
        viewAllHref="/zoeken?sort=aanbevolen"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("home.newTodayTitle")}
        subtitle={t("home.newTodaySubtitle")}
        items={nieuwVandaag}
        fotos={fotos}
        variant="latest"
        viewAllHref="/zoeken?sort=nieuwste"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("discovery.newProvidersTitle")}
        subtitle={t("discovery.newProvidersSubtitle")}
        items={nieuweAanbieders}
        fotos={fotos}
        variant="latest"
        viewAllHref="/zoeken?nieuw_profiel=true"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("home.mostSavedTitle")}
        subtitle={t("home.mostSavedSubtitle")}
        items={meestOpgeslagen}
        fotos={fotos}
        variant="popular"
        viewAllHref="/zoeken?sort=premium"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("discovery.bestRatedTitle")}
        subtitle={t("discovery.bestRatedSubtitle")}
        items={bestBeoordeeld}
        fotos={fotos}
        variant="premium"
        viewAllHref="/zoeken?sort=aanbevolen"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("home.premiumTitle")}
        subtitle={t("home.premiumSubtitle")}
        items={premium}
        fotos={fotos}
        variant="premium"
        viewAllHref="/zoeken?premium_profiel=true"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("discovery.recentUpdatesTitle")}
        subtitle={t("discovery.recentUpdatesSubtitle")}
        items={recentBijgewerkt}
        fotos={fotos}
        variant="latest"
        viewAllHref="/zoeken?sort=nieuwste"
        fotoCounts={fotoCounts}
      />

      <RecentBekekenSection />

      <AiLoungeTeaser />
      <WhyVelouraDiscovery />
      <HomeProviderCta />
    </div>
  );
}
