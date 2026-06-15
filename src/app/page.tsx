import Link from "next/link";
import { HomeHeroCompact } from "@/components/home/home-hero";
import { HomeListingSection } from "@/components/home/home-listing-section";
import { CategoryCompactGrid } from "@/components/home/category-compact-grid";
import { CityLinksSection } from "@/components/home/city-links-section";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

const POPULAIRE_ZOEKOPDRACHTEN = [
  { label: "Escort Antwerpen", href: "/zoeken?stad=Antwerpen&categorie=escort" },
  {
    label: "Privé ontvangst Gent",
    href: "/zoeken?stad=Gent&categorie=prive-ontvangst",
  },
  { label: "Massage Brussel", href: "/zoeken?stad=Brussel&categorie=massage" },
  { label: "Video afspraak", href: "/zoeken?categorie=video" },
  { label: "Koppels Vlaanderen", href: "/zoeken?categorie=koppels" },
  { label: "Geverifieerde profielen", href: "/zoeken?geverifieerd=true" },
] as const;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: nieuwsteRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false })
    .limit(8);

  const nieuwste = (nieuwsteRaw ?? []) as Advertentie[];
  const fotos = await haalEersteFotos(
    supabase,
    nieuwste.map((a) => a.id)
  );

  return (
    <div className="home-page">
      <HomeHeroCompact />

      <HomeListingSection
        title="Nieuwste advertenties"
        subtitle="Recent geplaatste actieve profielen."
        advertenties={nieuwste}
        fotos={fotos}
        viewAllHref="/zoeken"
        emptyState={{
          title: "Nog geen actieve profielen",
          text: "De eerste profielen worden binnenkort zichtbaar.",
          showCta: true,
        }}
      />

      <CategoryCompactGrid />
      <CityLinksSection />

      <section className="home-listing-block home-listing-block--compact home-listing-block--last">
        <div className="container">
          <h2 className="home-listing-block__title">Populaire zoekopdrachten</h2>
          <div className="popular-chip-grid">
            {POPULAIRE_ZOEKOPDRACHTEN.map((item) => (
              <Link key={item.href} href={item.href} className="popular-chip">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
