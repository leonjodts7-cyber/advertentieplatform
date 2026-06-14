import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import { HomeHeroCompact } from "@/components/home/home-hero";
import { CategoryGrid } from "@/components/home/discovery-quick-pick";
import { Button } from "@/components/ui/button";
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

const WAAROM_VELOURA = [
  {
    titel: "Discreet zoeken",
    tekst: "Zoek op regio en categorie zonder opdringerige uitstraling.",
  },
  {
    titel: "Snelle filters",
    tekst: "Filter op leeftijd, prijs en verificatie in enkele klikken.",
  },
  {
    titel: "Mobiel-first ervaring",
    tekst: "Veloura is gebouwd voor je telefoon — snel en overzichtelijk.",
  },
] as const;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: advertentiesRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false })
    .limit(8);

  const advertenties = (advertentiesRaw ?? []) as Advertentie[];
  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  return (
    <div className="home-page">
      <HomeHeroCompact />
      <CategoryGrid />

      <section className="content-section content-section--light">
        <div className="container">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="content-section__title">Nieuwste advertenties</h2>
              <p className="content-section__subtitle">
                Recent geplaatste actieve profielen
              </p>
            </div>
            {advertenties.length > 0 && (
              <Link
                href="/zoeken"
                className="hidden text-sm font-medium text-[var(--wine)] hover:underline sm:inline"
              >
                Alles bekijken →
              </Link>
            )}
          </div>

          {advertenties.length > 0 ? (
            <div className="listing-grid mt-5">
              {advertenties.map((advertentie) => (
                <AdvertentieCard
                  key={advertentie.id}
                  advertentie={advertentie}
                  afbeeldingUrl={fotos.get(advertentie.id)}
                  theme="light"
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-card mt-5">
              <h3 className="font-display text-lg">Nog geen actieve profielen</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-dark)]">
                De eerste profielen worden binnenkort zichtbaar. Ben jij
                aanbieder? Plaats jouw advertentie als eerste.
              </p>
              <Button asChild size="md" className="mt-4">
                <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="content-section content-section--light border-t border-[var(--border-light)]">
        <div className="container">
          <h2 className="content-section__title">Populaire zoekopdrachten</h2>
          <div className="popular-chip-grid mt-4">
            {POPULAIRE_ZOEKOPDRACHTEN.map((item) => (
              <Link key={item.href} href={item.href} className="popular-chip">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section content-section--light border-t border-[var(--border-light)]">
        <div className="container">
          <h2 className="content-section__title">Waarom Veloura?</h2>
          <div className="trust-grid mt-5">
            {WAAROM_VELOURA.map((item) => (
              <div key={item.titel} className="trust-card">
                <h3 className="trust-card__title">{item.titel}</h3>
                <p className="trust-card__text">{item.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
