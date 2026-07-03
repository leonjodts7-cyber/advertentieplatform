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
  nieuwste: Advertentie[];
  nearby: Advertentie[];
  populaire: Advertentie[];
  fotos: Map<string, string | undefined>;
  fotoCounts: Map<string, number>;
}

export function HomeMarketplaceContent({
  spotlight,
  premium,
  nieuwste,
  nearby,
  populaire,
  fotos,
  fotoCounts,
}: HomeMarketplaceContentProps) {
  const { t } = useTranslation();

  return (
    <div className="home-page home-page--marketplace home-page--polished overflow-x-hidden">
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
        title={t("home.latestTitle")}
        subtitle={t("home.latestSubtitle")}
        items={nieuwste}
        fotos={fotos}
        variant="latest"
        viewAllHref="/zoeken"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title={t("home.popularTitle")}
        subtitle={t("home.popularSubtitle")}
        items={populaire}
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
