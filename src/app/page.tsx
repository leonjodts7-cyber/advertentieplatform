import Link from "next/link";
import { HomeHeroCompact } from "@/components/home/home-hero";
import { CityLinksSection } from "@/components/home/city-links-section";
import { CategoryCompactGrid } from "@/components/home/category-compact-grid";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { HomeNearbyCarouselSection } from "@/components/home/home-nearby-carousel-section";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import { isPremiumListing } from "@/lib/advertentie-boost";
import {
  fetchActieveAdvertenties,
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

  const [spotlight, premium, nieuwste, nearbyRaw] = await Promise.all([
    fetchSpotlightAdvertenties(supabase, LISTING_LIMIT),
    fetchPremiumAdvertenties(supabase, LISTING_LIMIT),
    fetchActieveAdvertenties(supabase, { limit: LISTING_LIMIT }),
    fetchActieveAdvertenties(supabase, { limit: LISTING_LIMIT }),
  ]);

  const nearby = sortPremiumFirst(nearbyRaw);

  const allIds = [
    ...spotlight.map((a) => a.id),
    ...premium.map((a) => a.id),
    ...nieuwste.map((a) => a.id),
    ...nearby.map((a) => a.id),
  ];
  const fotos = await haalEersteFotos(supabase, [...new Set(allIds)]);

  return (
    <div className="home-page home-page--marketplace overflow-x-hidden">
      <HomeHeroCompact />

      <HorizontalListingsCarousel
        title="Homepage Spotlight"
        subtitle="Topprofielen met maximale zichtbaarheid."
        items={spotlight}
        fotos={fotos}
        variant="spotlight"
        viewAllHref="/zoeken?premium_profiel=true"
      />

      <HorizontalListingsCarousel
        title="Premium advertenties"
        subtitle="Uitgelichte profielen met extra zichtbaarheid."
        items={premium}
        fotos={fotos}
        variant="premium"
        viewAllHref="/zoeken?premium_profiel=true"
      />

      <HomeNearbyCarouselSection advertenties={nearby} fotos={fotos} />

      <HorizontalListingsCarousel
        title="Nieuwste advertenties"
        subtitle="Recent geplaatste actieve profielen."
        items={nieuwste}
        fotos={fotos}
        variant="latest"
        viewAllHref="/zoeken"
      />

      <CategoryCompactGrid />

      <CityLinksSection />

      <section className="home-provider-cta">
        <div className="container">
          <p className="home-provider-cta__text">
            Ben jij aanbieder?{" "}
            <Link
              href="/login?redirect=%2Fdashboard%2Fadvertenties%2Fnieuw"
              className="home-provider-cta__link"
            >
              Plaats je advertentie op Veloura
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
