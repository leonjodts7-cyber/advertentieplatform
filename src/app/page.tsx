import Link from "next/link";
import { HomeHeroCompact } from "@/components/home/home-hero";
import { HomeListingSection } from "@/components/home/home-listing-section";
import { HomeNearbySection } from "@/components/home/home-nearby-section";
import { CategoryCompactGrid } from "@/components/home/category-compact-grid";
import { CityLinksSection } from "@/components/home/city-links-section";
import { SpotlightSection } from "@/components/advertentie-card";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import {
  fetchActieveAdvertenties,
  fetchPremiumAdvertenties,
  fetchSpotlightAdvertenties,
} from "@/lib/advertentie-queries";
import { createClient } from "@/lib/supabase/server";

interface HomePageProps {
  searchParams: Promise<{ stad?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { stad } = await searchParams;
  const supabase = await createClient();

  const [spotlight, premium, nieuwste, buurt] = await Promise.all([
    fetchSpotlightAdvertenties(supabase, 6),
    fetchPremiumAdvertenties(supabase, 8),
    fetchActieveAdvertenties(supabase, { limit: 8 }),
    stad?.trim()
      ? fetchActieveAdvertenties(supabase, { stad: stad.trim(), limit: 8 })
      : Promise.resolve([]),
  ]);

  const allIds = [
    ...spotlight.map((a) => a.id),
    ...premium.map((a) => a.id),
    ...nieuwste.map((a) => a.id),
    ...buurt.map((a) => a.id),
  ];
  const fotos = await haalEersteFotos(supabase, [...new Set(allIds)]);

  return (
    <div className="home-page home-page--marketplace">
      <HomeHeroCompact />

      <SpotlightSection advertenties={spotlight} fotos={fotos} />

      <HomeListingSection
        title="Premium advertenties"
        subtitle="Uitgelichte profielen met extra zichtbaarheid."
        advertenties={premium}
        fotos={fotos}
        viewAllHref="/zoeken?premium_profiel=true"
        variant="premium"
        emptyState={{
          title: "Premium advertenties",
          text: "Hier verschijnen binnenkort premium profielen.",
          compact: true,
        }}
      />

      <HomeNearbySection
        selectedStad={stad}
        advertenties={buurt}
        fotos={fotos}
      />

      <HomeListingSection
        title="Nieuwste advertenties"
        subtitle="Recent geplaatste actieve profielen."
        advertenties={nieuwste}
        fotos={fotos}
        viewAllHref="/zoeken"
        emptyState={{
          title: "Nieuwste advertenties",
          text: "Er zijn nog geen actieve profielen.",
          compact: true,
        }}
      />

      <CategoryCompactGrid />
      <CityLinksSection />

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
