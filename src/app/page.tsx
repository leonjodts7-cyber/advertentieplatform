import { Suspense } from "react";
import { HomeHeroCompact } from "@/components/home/home-hero";
import { CategoryCompactGrid } from "@/components/home/category-compact-grid";
import { CityQuickLinks } from "@/components/home/city-quick-links";
import { HomeCarouselSection } from "@/components/home/home-carousel-section";
import { HomeNearbySection } from "@/components/home/home-nearby-section-async";
import { HomeCarouselSkeleton } from "@/components/home/home-carousel-skeleton";
import { AiLoungeTeaser } from "@/components/home/ai-lounge-teaser";
import { WhyVelouraDiscovery } from "@/components/home/why-veloura-discovery";
import { HomeProviderCta } from "@/components/home/home-provider-cta";
import { RecentBekekenSection } from "@/components/recent-bekeken-section";
import { HomeForYouSection } from "@/components/home/home-for-you-section";
import { HomeDiscoverMore } from "@/components/home/home-discover-more";
import { buildPageMetadata } from "@/lib/metadata-i18n";

export async function generateMetadata() {
  return buildPageMetadata("pages.home.title", "pages.home.description", { path: "/" });
}

export default function HomePage() {
  return (
    <div className="home-page home-page--marketplace home-page--discovery overflow-x-hidden">
      <HomeHeroCompact />
      <CategoryCompactGrid />
      <CityQuickLinks />

      <HomeCarouselSection sectionKey="spotlight" />
      <HomeCarouselSection sectionKey="onlineNu" />

      <Suspense fallback={<HomeCarouselSkeleton />}>
        <HomeNearbySection />
      </Suspense>

      <HomeForYouSection />
      <HomeCarouselSection sectionKey="trending" />
      <HomeCarouselSection sectionKey="premium" />
      <HomeCarouselSection sectionKey="nieuwVandaag" />

      <HomeDiscoverMore />
      <RecentBekekenSection />
      <AiLoungeTeaser />
      <WhyVelouraDiscovery />
      <HomeProviderCta />
    </div>
  );
}
