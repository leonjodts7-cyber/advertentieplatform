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
      titel: "Sneller gevonden",
      tekst: "Jouw profiel verschijnt direct in relevante zoekresultaten per stad en regio.",
    },
    {
      titel: "Mobiel-first profielpagina's",
      tekst: "Bezoekers browsen op hun telefoon — jouw listing is daarop geoptimaliseerd.",
    },
    {
      titel: "Slimme zoekfilters",
      tekst: "Categorieën, stad en beschikbaarheid helpen de juiste klant jou te vinden.",
    },
    {
      titel: "Professioneel dashboard",
      tekst: "Beheer concepten, vraag publicatie aan en houd je profiel commercieel sterk.",
    },
  ];

  return (
    <div>
      {/* Hero — compact op desktop */}
      <section className="relative overflow-hidden border-b border-border/20">
        <div className="container relative py-8 sm:py-10 lg:py-12">
          <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div>
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-champagne/90 sm:text-xs">
                Alleen 18+ · Discreet · Geverifieerde profielen · Mobiel eerst
              </p>

              <h1 className="font-display mt-3 text-[1.75rem] font-medium leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]">
                Ontdek{" "}
                <span className="text-champagne">premium profielen</span> in
                jouw regio
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Zoek discreet naar zelfstandige aanbieders, escort, privé
                ontvangst en online diensten.
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/zoeken">Bekijk advertenties</Link>
                </Button>
                <Button
                  asChild
                  variant="bordeaux"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/dashboard/advertenties/nieuw">
                    Plaats jouw advertentie
                  </Link>
                </Button>
              </div>

              <div className="premium-card mt-6 p-4 sm:p-5">
                <MarketplaceHeroSearch />
              </div>
            </div>

            <div className="hidden md:block">
              <MarketplacePreview />
            </div>
          </div>

          <div className="mt-6 md:hidden">
            <MarketplacePreview />
          </div>
        </div>
      </section>

      {/* Categorieën */}
      <section className="section-spacing border-b border-border/20">
        <div className="container">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="section-title">Populaire categorieën</h2>
              <p className="section-subtitle mt-1">
                Kies een categorie en ontdek profielen
              </p>
            </div>
            <Link
              href="/zoeken"
              className="shrink-0 text-xs text-champagne hover:text-champagne/80 sm:text-sm"
            >
              Alles →
            </Link>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Waarom RedLight */}
      <section className="section-spacing border-b border-border/20">
        <div className="container">
          <h2 className="section-title">Waarom RedLight beter werkt</h2>
          <p className="section-subtitle mt-1 max-w-lg">
            Gebouwd voor aanbieders die serieus willen converteren — niet voor
            lege pagina&apos;s.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {voordelen.map((v) => (
              <div
                key={v.titel}
                className="premium-card p-4 transition-colors hover:border-champagne/20 sm:p-5"
              >
                <h3 className="font-display text-base font-medium text-foreground sm:text-lg">
                  {v.titel}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
              <p className="section-subtitle mt-1">Actief op het platform</p>
            </div>
            <Link
              href="/zoeken"
              className="hidden text-sm text-champagne hover:text-champagne/80 sm:inline"
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
            <div className="premium-card relative mt-6 overflow-hidden p-8 text-center sm:p-12">
              <div className="gradient-placeholder-gold absolute inset-0 opacity-15" />
              <div className="relative">
                <p className="font-display text-xl text-foreground">
                  Nog geen actieve advertenties
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Wees de eerste op RedLight en bereik bezoekers in jouw regio.
                </p>
                <Button asChild size="lg" className="mt-5">
                  <Link href="/dashboard/advertenties/nieuw">
                    Plaats eerste advertentie
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center sm:hidden">
            <Link href="/zoeken" className="text-sm text-champagne">
              Alles bekijken →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
