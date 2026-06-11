import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import { HeroPreviewCards } from "@/components/hero-preview-cards";
import { QuickCityLinks } from "@/components/quick-city-links";
import { ZoekFormulier } from "@/components/zoek-formulier";
import { Button } from "@/components/ui/button";
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

  const voordelen = [
    {
      titel: "Mobiel eerst",
      beschrijving:
        "Jouw profiel ziet er op elke smartphone perfect uit — waar je klanten je ook vinden.",
      icon: "◆",
    },
    {
      titel: "Geverifieerde profielen",
      beschrijving:
        "Vertrouwen begint bij authenticiteit. Geverifieerde aanbieders vallen positief op.",
      icon: "◇",
    },
    {
      titel: "Slim zoeken",
      beschrijving:
        "Bezoekers vinden jou snel op stad en regio — precies wanneer ze zoeken.",
      icon: "◈",
    },
    {
      titel: "Professioneel dashboard",
      beschrijving:
        "Beheer concepten, vraag publicatie aan en houd alles overzichtelijk bij.",
      icon: "◎",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-glow -left-20 top-0 h-64 w-64 bg-bordeaux/20" />
        <div className="hero-glow -right-20 top-20 h-48 w-48 bg-champagne/10" />

        <div className="container relative py-10 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="animate-fade-in">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-champagne">
                Alleen 18+ · Discreet & professioneel
              </p>
              <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Premium advertenties,{" "}
                <span className="text-champagne">lokaal vindbaar</span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                Ontdek zelfstandige aanbieders in jouw regio of plaats jouw
                profiel professioneel online.
              </p>

              <div className="card-premium mt-8 p-5 sm:p-6">
                <ZoekFormulier inputId="hero-stad" />
                <p className="mt-4 text-xs text-muted-foreground">
                  Populaire steden:
                </p>
                <QuickCityLinks className="mt-2" size="sm" />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                    Plaats advertentie
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden sm:block lg:pl-4">
              <HeroPreviewCards />
            </div>
          </div>

          <div className="mt-8 sm:hidden">
            <HeroPreviewCards />
          </div>
        </div>
      </section>

      {/* Waarom */}
      <section className="border-t border-border/40 py-12 sm:py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title">
              Waarom kiezen voor Privé Ontvangst?
            </h2>
            <p className="section-subtitle mt-3">
              Een stijlvol platform dat jouw professionaliteit weerspiegelt.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {voordelen.map((voordeel) => (
              <div
                key={voordeel.titel}
                className="card-premium group p-6 transition-colors hover:border-champagne/20"
              >
                <span className="text-lg text-champagne/60">{voordeel.icon}</span>
                <h3 className="mt-3 font-display text-lg font-medium text-foreground">
                  {voordeel.titel}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {voordeel.beschrijving}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nieuwste advertenties */}
      <section className="border-t border-border/40 py-12 sm:py-16">
        <div className="container">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Nieuwste advertenties</h2>
              <p className="section-subtitle mt-1">
                Actieve profielen in jouw regio
              </p>
            </div>
            <Link
              href="/zoeken"
              className="hidden shrink-0 text-sm text-champagne transition-colors hover:text-champagne/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm sm:inline"
            >
              Alles bekijken →
            </Link>
          </div>

          {advertenties.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {advertenties.map((advertentie) => (
                <AdvertentieCard
                  key={advertentie.id}
                  advertentie={advertentie}
                />
              ))}
            </div>
          ) : (
            <div className="card-premium relative mt-8 overflow-hidden p-10 text-center sm:p-14">
              <div className="gradient-placeholder-gold absolute inset-0 opacity-20" />
              <div className="relative">
                <p className="font-display text-xl text-foreground sm:text-2xl">
                  Nog geen advertenties live
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                  Wees de eerste die een premium profiel plaatst en bereik
                  bezoekers in jouw regio.
                </p>
                <Button asChild size="lg" className="mt-6">
                  <Link href="/dashboard/advertenties/nieuw">
                    Plaats jouw advertentie
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/zoeken"
              className="text-sm text-champagne hover:text-champagne/80"
            >
              Alles bekijken →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
