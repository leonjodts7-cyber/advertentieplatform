"use client";

import { HomeHeroCompact } from "@/components/home/home-hero";
import { HomeProviderCta } from "@/components/home/home-provider-cta";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { HomeNearbyCarouselSection } from "@/components/home/home-nearby-carousel-section";
import { RecentBekekenSection } from "@/components/recent-bekeken-section";
import { useTranslation } from "@/contexts/locale-context";
import type { Advertentie } from "@/lib/types";

interface HomeMarketplaceContentProps {
  spotlight: Advertentie[];
  premium: Advertentie[];
  nearby: Advertentie[];
  trending: Advertentie[];
  nieuwVandaag: Advertentie[];
  meestOpgeslagen: Advertentie[];
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
  fotos,
  fotoCounts,
}: HomeMarketplaceContentProps) {
  const { t } = useTranslation();

  return (
    <div className="home-page home-page--marketplace home-page--v2 overflow-x-hidden">
      <HomeHeroCompact />

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
        title={t("home.premiumTitle")}
        subtitle={t("home.premiumSubtitle")}
        items={premium}
        fotos={fotos}
        variant="premium"
        viewAllHref="/zoeken?premium_profiel=true"
        fotoCounts={fotoCounts}
      />

      <HomeNearbyCarouselSection
        advertenties={nearby}
        fotos={fotos}
        fotoCounts={fotoCounts}
      />

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
        title={t("home.newTodayTitle")}
        subtitle={t("home.newTodaySubtitle")}
        items={nieuwVandaag}
        fotos={fotos}
        variant="latest"
        viewAllHref="/zoeken?sort=nieuwste"
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

      <RecentBekekenSection />

      <HomeProviderCta />
    </div>
  );
}
