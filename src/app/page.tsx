import Link from "next/link";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
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
      titel: "Professioneel profiel",
      beschrijving:
        "Presenteer jouw diensten op een nette, discrete manier die vertrouwen wekt.",
    },
    {
      titel: "Lokaal vindbaar",
      beschrijving:
        "Bezoekers zoeken op stad en vinden snel jouw actieve advertentie.",
    },
    {
      titel: "Volledige controle",
      beschrijving:
        "Beheer concepten, vraag publicatie aan en houd je gegevens up-to-date.",
    },
  ];

  return (
    <div>
      <section className="container py-12 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            Alleen 18+
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Jouw professionele advertentie,{" "}
            <span className="text-primary">lokaal vindbaar</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Privé Ontvangst is het advertentieplatform voor zelfstandige
            aanbieders. Zoek advertenties in jouw stad of plaats er zelf een.
          </p>
        </div>

        <div className="card-premium mx-auto mt-10 max-w-2xl p-6 sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Zoek in jouw stad
          </h2>
          <ZoekFormulier />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard/advertenties/nieuw">
              Plaats jouw advertentie
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/zoeken">Bekijk alle advertenties</Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30 py-12 sm:py-16">
        <div className="container">
          <h2 className="section-title text-center">Waarom Privé Ontvangst?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {voordelen.map((voordeel) => (
              <div key={voordeel.titel} className="card-premium p-6">
                <h3 className="font-semibold text-foreground">
                  {voordeel.titel}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {voordeel.beschrijving}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="section-title">Laatste advertenties</h2>
          <Link
            href="/zoeken"
            className="text-sm text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
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
          <div className="card-premium mt-8 p-8 text-center">
            <p className="text-muted-foreground">
              Er zijn nog geen actieve advertenties. Wees de eerste!
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/advertenties/nieuw">
                Plaats jouw advertentie
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
