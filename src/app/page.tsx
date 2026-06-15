import Link from "next/link";
import { HomeHeroCompact } from "@/components/home/home-hero";
import { HomeListingSection } from "@/components/home/home-listing-section";
import { HomeNearbySection } from "@/components/home/home-nearby-section";
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
  { label: "Hotels Brussel", href: "/zoeken?stad=Brussel&categorie=rendez-vous-hotels" },
  { label: "Massage Antwerpen", href: "/zoeken?stad=Antwerpen&categorie=massage" },
] as const;

interface HomePageProps {
  searchParams: Promise<{ stad?: string }>;
}

async function fetchPremiumAdvertenties(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<Advertentie[]> {
  const { data, error } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .eq("premium", true)
    .order("aangemaakt_op", { ascending: false })
    .limit(8);

  if (error) return [];
  return (data ?? []) as Advertentie[];
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { stad } = await searchParams;
  const supabase = await createClient();

  const [premiumResult, nieuwsteResult, buurtResult] = await Promise.all([
    fetchPremiumAdvertenties(supabase),
    supabase
      .from("advertenties")
      .select("*")
      .eq("status", "actief")
      .order("aangemaakt_op", { ascending: false })
      .limit(8),
    stad?.trim()
      ? supabase
          .from("advertenties")
          .select("*")
          .eq("status", "actief")
          .ilike("stad", `%${stad.trim()}%`)
          .order("aangemaakt_op", { ascending: false })
          .limit(8)
      : Promise.resolve({ data: [] }),
  ]);

  const premium = premiumResult;
  const nieuwste = (nieuwsteResult.data ?? []) as Advertentie[];
  const buurt = (buurtResult.data ?? []) as Advertentie[];

  const allIds = [
    ...premium.map((a) => a.id),
    ...nieuwste.map((a) => a.id),
    ...buurt.map((a) => a.id),
  ];
  const fotos = await haalEersteFotos(supabase, [...new Set(allIds)]);

  return (
    <div className="home-page">
      <HomeHeroCompact />

      <HomeListingSection
        title="Premium advertenties"
        subtitle="Uitgelichte profielen met extra zichtbaarheid."
        advertenties={premium}
        fotos={fotos}
        viewAllHref="/zoeken?premium_profiel=true"
        variant="premium"
        emptyState={{
          title: "Nog geen premium advertenties",
          text: "Premium posities komen hier bovenaan te staan.",
          cta: { label: "Premium worden", href: "/dashboard/advertenties" },
        }}
      />

      <HomeNearbySection stad={stad} advertenties={buurt} fotos={fotos} />

      <HomeListingSection
        title="Nieuwste advertenties"
        subtitle="Recent geplaatste actieve profielen."
        advertenties={nieuwste}
        fotos={fotos}
        viewAllHref="/zoeken"
        emptyState={{
          title: "Nog geen actieve profielen",
          text: "De eerste profielen worden binnenkort zichtbaar.",
          showProviderLink: true,
        }}
      />

      <CategoryCompactGrid />
      <CityLinksSection />

      <section className="home-listing-block home-listing-block--compact">
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
