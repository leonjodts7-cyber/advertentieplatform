import Link from "next/link";
import { HomeHeroCompact } from "@/components/home/home-hero";
import { CategoryCompactGrid } from "@/components/home/category-compact-grid";
import {
  HomeNearbyCompact,
  HomeNieuwsteSection,
  HomePremiumSection,
  SpotlightSection,
} from "@/components/advertentie-card";
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

function sortNearby(advertenties: Advertentie[]): Advertentie[] {
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

  const nearby = sortNearby(nearbyRaw);

  const allIds = [
    ...spotlight.map((a) => a.id),
    ...premium.map((a) => a.id),
    ...nieuwste.map((a) => a.id),
    ...nearby.map((a) => a.id),
  ];
  const fotos = await haalEersteFotos(supabase, [...new Set(allIds)]);

  return (
    <div className="home-page home-page--marketplace">
      <HomeHeroCompact />

      <SpotlightSection advertenties={spotlight} fotos={fotos} />

      <HomePremiumSection advertenties={premium} fotos={fotos} />

      <HomeNearbyCompact advertenties={nearby} fotos={fotos} />

      <HomeNieuwsteSection advertenties={nieuwste} fotos={fotos} />

      <CategoryCompactGrid />

      <section className="home-provider-cta">
        <div className="container">
          <p className="home-provider-cta__text">
            Ben jij aanbieder?{" "}
            <Link href="/login?redirect=%2Fdashboard%2Fadvertenties%2Fnieuw" className="home-provider-cta__link">
              Plaats je advertentie op Veloura
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
