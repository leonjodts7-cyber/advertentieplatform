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
import {
  fetchActieveAdvertenties,
  fetchPremiumAdvertenties,
  fetchSpotlightAdvertenties,
} from "@/lib/advertentie-queries";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const [spotlight, premium, nieuwste] = await Promise.all([
    fetchSpotlightAdvertenties(supabase, 6),
    fetchPremiumAdvertenties(supabase, 8),
    fetchActieveAdvertenties(supabase, { limit: 8 }),
  ]);

  const allIds = [
    ...spotlight.map((a) => a.id),
    ...premium.map((a) => a.id),
    ...nieuwste.map((a) => a.id),
  ];
  const fotos = await haalEersteFotos(supabase, [...new Set(allIds)]);

  return (
    <div className="home-page home-page--marketplace">
      <HomeHeroCompact />

      <SpotlightSection advertenties={spotlight} fotos={fotos} />

      <HomePremiumSection advertenties={premium} fotos={fotos} />

      <HomeNearbyCompact />

      <HomeNieuwsteSection advertenties={nieuwste} fotos={fotos} />

      <CategoryCompactGrid />

      <section className="home-provider-cta">
        <div className="container">
          <p className="home-provider-cta__text">
            Ben jij aanbieder?{" "}
            <Link href="/dashboard/advertenties/nieuw" className="home-provider-cta__link">
              Plaats je advertentie op Veloura
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
