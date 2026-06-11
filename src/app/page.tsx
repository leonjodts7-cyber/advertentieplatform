import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import { CategoryGrid } from "@/components/category-grid";
import { MarketplaceHeroSearch } from "@/components/marketplace-hero-search";
import { MarketplacePreview } from "@/components/marketplace-preview";
import { Button } from "@/components/ui/button";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: advertentiesRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false })
    .limit(6);

  const advertenties = (advertentiesRaw ?? []) as Advertentie[];
  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  const voordelen = [
    {
      titel: "Premium presentatie",
      tekst: "Jouw profiel oogt verzorgd en professioneel — de eerste indruk telt.",
    },
    {
      titel: "Mobiel-first ervaring",
      tekst: "Bezoekers browsen op hun telefoon. Veloura is daar volledig op gebouwd.",
    },
    {
      titel: "Discreet zoeken",
      tekst: "Zoek op stad en categorie zonder opdringerige of expliciete uitstraling.",
    },
    {
      titel: "Dashboard voor aanbieders",
      tekst: "Beheer concepten, vraag publicatie aan en houd je listing up-to-date.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="container py-8 sm:py-10 lg:py-12">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="animate-fade-in">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-veloura-soft sm:text-xs">
                Alleen 18+ · Discreet · Professioneel · Mobiel eerst
              </p>

              <h1 className="font-display mt-3 text-[1.65rem] font-medium leading-[1.15] text-veloura-ivory sm:text-4xl lg:text-[2.35rem]">
                Ontdek{" "}
                <span className="text-veloura-champagne">discrete profielen</span>{" "}
                in jouw regio
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-veloura-soft sm:text-base">
                Veloura brengt zelfstandige aanbieders en bezoekers samen op een
                stijlvol, veilig en professioneel advertentieplatform.
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/zoeken">Bekijk advertenties</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/dashboard/advertenties/nieuw">
                    Plaats jouw advertentie
                  </Link>
                </Button>
              </div>

              <div className="luxury-card mt-6 p-4 sm:p-5">
                <MarketplaceHeroSearch />
              </div>
            </div>

            <div className="lg:pt-2">
              <MarketplacePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Categorieën */}
      <section className="section-spacing border-b border-white/10">
        <div className="container">
          <h2 className="section-title">Populaire categorieën</h2>
          <p className="section-subtitle mt-1">
            Ontdek profielen per dienst
          </p>
          <div className="mt-5">
            <CategoryGrid />
          </div>
        </div>
      </section>

      {/* Waarom Veloura */}
      <section className="section-spacing border-b border-white/10">
        <div className="container">
          <h2 className="section-title">Waarom Veloura?</h2>
          <p className="section-subtitle mt-1 max-w-lg">
            Gebouwd voor aanbieders die kwaliteit en discretie serieus nemen.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {voordelen.map((v) => (
              <div
                key={v.titel}
                className="luxury-card p-4 transition-colors hover:border-veloura-rose/25 sm:p-5"
              >
                <h3 className="font-display text-base font-medium text-veloura-ivory sm:text-lg">
                  {v.titel}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-veloura-soft">
                  {v.tekst}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nieuwste advertenties */}
      <section className="section-spacing">
        <div className="container">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="section-title">Nieuwste advertenties</h2>
              <p className="section-subtitle mt-1">Actief op Veloura</p>
            </div>
            <Link
              href="/zoeken"
              className="hidden text-sm text-veloura-champagne hover:text-veloura-champagne/80 sm:inline"
            >
              Alles bekijken →
            </Link>
          </div>

          {advertenties.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {advertenties.map((advertentie) => (
                <AdvertentieCard
                  key={advertentie.id}
                  advertentie={advertentie}
                  afbeeldingUrl={fotos.get(advertentie.id)}
                />
              ))}
            </div>
          ) : (
            <div className="luxury-card mt-6 p-8 text-center sm:p-12">
              <p className="font-display text-xl text-veloura-ivory">
                Er zijn nog geen actieve advertenties.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-veloura-soft">
                Wees de eerste op Veloura en bereik bezoekers in jouw regio.
              </p>
              <Button asChild size="lg" className="mt-5">
                <Link href="/dashboard/advertenties/nieuw">
                  Plaats eerste advertentie
                </Link>
              </Button>
            </div>
          )}

          <div className="mt-4 text-center sm:hidden">
            <Link href="/zoeken" className="text-sm text-veloura-champagne">
              Alles bekijken →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
