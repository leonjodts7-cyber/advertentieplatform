import { HomeHeroCompact } from "@/components/home/home-hero";
import { HomeProviderCta } from "@/components/home/home-provider-cta";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { HomeNearbyCarouselSection } from "@/components/home/home-nearby-carousel-section";
import { RecentBekekenSection } from "@/components/recent-bekeken-section";
import { haalEersteFotos, haalFotoAantallen } from "@/lib/advertentie-fotos";
import { isPremiumListing } from "@/lib/advertentie-boost";
import {
  fetchActieveAdvertenties,
  fetchPopulaireAdvertenties,
  fetchPremiumAdvertenties,
  fetchSpotlightAdvertenties,
} from "@/lib/advertentie-queries";
import { createClient } from "@/lib/supabase/server";
import type { Advertentie } from "@/lib/types";

const LISTING_LIMIT = 24;

function sortPremiumFirst(advertenties: Advertentie[]): Advertentie[] {
  return [...advertenties].sort((a, b) => {
    const ap = isPremiumListing(a) ? 1 : 0;
    const bp = isPremiumListing(b) ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return (
      new Date(b.aangemaakt_op).getTime() - new Date(a.aangemaakt_op).getTime()
    );
  });
}

export default async function HomePage() {
  const supabase = await createClient();

  const [spotlight, premium, nieuwste, nearbyRaw, populaire] = await Promise.all([
    fetchSpotlightAdvertenties(supabase, LISTING_LIMIT),
    fetchPremiumAdvertenties(supabase, LISTING_LIMIT),
    fetchActieveAdvertenties(supabase, { limit: LISTING_LIMIT }),
    fetchActieveAdvertenties(supabase, { limit: LISTING_LIMIT }),
    fetchPopulaireAdvertenties(supabase, LISTING_LIMIT),
  ]);

  const nearby = sortPremiumFirst(nearbyRaw);

  const allIds = [
    ...spotlight.map((a) => a.id),
    ...premium.map((a) => a.id),
    ...nieuwste.map((a) => a.id),
    ...nearby.map((a) => a.id),
    ...populaire.map((a) => a.id),
  ];
  const fotos = await haalEersteFotos(supabase, [...new Set(allIds)]);
  const fotoCounts = await haalFotoAantallen(supabase, [...new Set(allIds)]);

  return (
    <div className="home-page home-page--marketplace overflow-x-hidden">
      <HomeHeroCompact />

      <HorizontalListingsCarousel
        title="Homepage Spotlight"
        subtitle="Topprofielen met maximale zichtbaarheid."
        items={spotlight}
        fotos={fotos}
        variant="spotlight"
        viewAllHref="/zoeken?spotlight=1"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title="Premium advertenties"
        subtitle="Uitgelichte profielen met extra zichtbaarheid."
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
        title="Nieuwste advertenties"
        subtitle="Recent geplaatste actieve profielen."
        items={nieuwste}
        fotos={fotos}
        variant="latest"
        viewAllHref="/zoeken"
        fotoCounts={fotoCounts}
      />

      <HorizontalListingsCarousel
        title="Populaire advertenties"
        subtitle="Veel bekeken en uitgelichte profielen op Veloura."
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
