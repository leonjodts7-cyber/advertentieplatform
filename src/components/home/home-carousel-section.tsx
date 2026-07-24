import { Suspense } from "react";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { HomeCarouselSkeleton } from "@/components/home/home-carousel-skeleton";
import { getHomepageSection, type HomepageSectionKey } from "@/lib/cache/homepage-bundle";
import { getCachedListingPhotos } from "@/lib/cache/listing-photos";
import { getServerTranslation } from "@/lib/i18n/server";
import type { CarouselTier } from "@/components/home/carousel-listing-card";

const SECTION_CONFIG: Record<
  HomepageSectionKey,
  {
    titleKey: string;
    subtitleKey: string;
    variant: CarouselTier;
    viewAllHref: string;
  }
> = {
  spotlight: {
    titleKey: "home.spotlightTitle",
    subtitleKey: "home.spotlightSubtitle",
    variant: "spotlight",
    viewAllHref: "/zoeken?spotlight=1",
  },
  editorsChoice: {
    titleKey: "discovery.editorsChoiceTitle",
    subtitleKey: "discovery.editorsChoiceSubtitle",
    variant: "premium",
    viewAllHref: "/zoeken?premium_profiel=true",
  },
  onlineNu: {
    titleKey: "discovery.onlineNowTitle",
    subtitleKey: "discovery.onlineNowSubtitle",
    variant: "latest",
    viewAllHref: "/zoeken?beschikbaar=true",
  },
  nearby: {
    titleKey: "home.nearbyTitle",
    subtitleKey: "home.nearbySubtitle",
    variant: "nearby",
    viewAllHref: "/zoeken?sort=aanbevolen",
  },
  trending: {
    titleKey: "home.trendingTitle",
    subtitleKey: "home.trendingSubtitle",
    variant: "popular",
    viewAllHref: "/zoeken?sort=aanbevolen",
  },
  snelStijgende: {
    titleKey: "discovery.risingTitle",
    subtitleKey: "discovery.risingSubtitle",
    variant: "popular",
    viewAllHref: "/zoeken?sort=aanbevolen",
  },
  nieuwVandaag: {
    titleKey: "home.newTodayTitle",
    subtitleKey: "home.newTodaySubtitle",
    variant: "latest",
    viewAllHref: "/zoeken?sort=nieuwste",
  },
  nieuweAanbieders: {
    titleKey: "discovery.newProvidersTitle",
    subtitleKey: "discovery.newProvidersSubtitle",
    variant: "latest",
    viewAllHref: "/zoeken?nieuw_profiel=true",
  },
  meestOpgeslagen: {
    titleKey: "home.mostSavedTitle",
    subtitleKey: "home.mostSavedSubtitle",
    variant: "popular",
    viewAllHref: "/zoeken?sort=premium",
  },
  bestBeoordeeld: {
    titleKey: "discovery.bestRatedTitle",
    subtitleKey: "discovery.bestRatedSubtitle",
    variant: "premium",
    viewAllHref: "/zoeken?sort=aanbevolen",
  },
  premium: {
    titleKey: "home.premiumTitle",
    subtitleKey: "home.premiumSubtitle",
    variant: "premium",
    viewAllHref: "/zoeken?premium_profiel=true",
  },
  recentBijgewerkt: {
    titleKey: "discovery.recentUpdatesTitle",
    subtitleKey: "discovery.recentUpdatesSubtitle",
    variant: "latest",
    viewAllHref: "/zoeken?sort=nieuwste",
  },
};

async function HomeCarouselSectionInner({
  sectionKey,
}: {
  sectionKey: HomepageSectionKey;
}) {
  const [{ t }, items] = await Promise.all([
    getServerTranslation(),
    getHomepageSection(sectionKey),
  ]);

  const config = SECTION_CONFIG[sectionKey];
  const ids = items.map((a) => a.id);
  if (items.length === 0) return null;

  const { urls, counts } = await getCachedListingPhotos(ids);

  return (
    <HorizontalListingsCarousel
      title={t(config.titleKey)}
      subtitle={t(config.subtitleKey)}
      items={items}
      fotos={urls}
      variant={config.variant}
      viewAllHref={config.viewAllHref}
      fotoCounts={counts}
    />
  );
}

export function HomeCarouselSection({
  sectionKey,
}: {
  sectionKey: HomepageSectionKey;
}) {
  return (
    <Suspense fallback={<HomeCarouselSkeleton />}>
      <HomeCarouselSectionInner sectionKey={sectionKey} />
    </Suspense>
  );
}
