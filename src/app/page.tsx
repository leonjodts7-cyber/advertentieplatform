import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import { AiLoungeHomeSection } from "@/components/ai/ai-lounge-home-section";
import { MarketplaceHeroSearch } from "@/components/marketplace-hero-search";
import { PopularSearches } from "@/components/popular-searches";
import { ProfilePreviewCard } from "@/components/profile-preview-card";
import { PopularCitiesGrid } from "@/components/popular-cities-grid";
import { WhyVeloura } from "@/components/why-veloura";
import { Button } from "@/components/ui/button";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import { HOME_PREVIEW_PROFIELEN } from "@/lib/home-preview-profielen";
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

  return (
    <div>
      {/* A. Hero + zoekfunctie */}
      <section className="marketplace-section border-b border-white/10">
        <div className="container">
          <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="order-2 lg:order-1 animate-fade-in">
              <p className="trustline-text text-[0.625rem] font-medium uppercase sm:text-[0.6875rem]">
                Alleen 18+ · Discreet · Geverifieerd · Direct contact
              </p>

              <h1 className="font-display mt-3 text-[1.625rem] font-medium leading-[1.12] sm:text-4xl lg:text-[2.375rem]">
                Ontdek{" "}
                <span className="text-gradient-hero">geverifieerde profielen</span>{" "}
                in jouw regio
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                Zoek privé ontvangst, escort, video en meer. Direct contact met
                zelfstandige aanbieders, discreet en mobiel-first.
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/zoeken">Zoek profielen</Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/dashboard/advertenties/nieuw">
                    Plaats advertentie
                  </Link>
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="glass-card p-4 sm:p-5">
                <MarketplaceHeroSearch />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. Online profielen preview */}
      <section className="marketplace-section border-b border-white/10 bg-white/[0.02]">
        <div className="container">
          <h2 className="section-title text-lg sm:text-xl">Online nu</h2>
          <p className="section-subtitle mt-1">
            Populaire profielen in jouw regio — preview
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {HOME_PREVIEW_PROFIELEN.map((p) => (
              <ProfilePreviewCard key={p.id} profiel={p} href="/zoeken" />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Voorbeeldweergave — geen echte personen
          </p>
        </div>
      </section>

      {/* C. Populaire zoekopdrachten */}
      <section className="marketplace-section border-b border-white/10">
        <div className="container">
          <h2 className="section-title text-lg sm:text-xl">
            Populaire zoekopdrachten
          </h2>
          <div className="mt-4">
            <PopularSearches />
          </div>
        </div>
      </section>

      {/* D. AI Lounge preview */}
      <AiLoungeHomeSection />

      {/* E. Nieuwste advertenties */}
      <section className="marketplace-section border-b border-white/10">
        <div className="container">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="section-title">Nieuwste advertenties</h2>
              <p className="section-subtitle mt-1">Actief op Veloura</p>
            </div>
            <Link
              href="/zoeken"
              className="hidden text-sm font-medium text-soft-champagne hover:text-champagne sm:inline"
            >
              Alles bekijken →
            </Link>
          </div>

          {advertenties.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {advertenties.map((advertentie) => (
                <AdvertentieCard
                  key={advertentie.id}
                  advertentie={advertentie}
                  afbeeldingUrl={fotos.get(advertentie.id)}
                />
              ))}
            </div>
          ) : (
            <div className="profile-card mt-5 p-8 text-center sm:p-12">
              <p className="font-display text-xl text-foreground">
                Nog geen actieve advertenties
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Plaats jouw profiel en word als eerste zichtbaar.
              </p>
              <Button asChild size="lg" className="mt-5">
                <Link href="/dashboard/advertenties/nieuw">
                  Plaats eerste advertentie
                </Link>
              </Button>
            </div>
          )}

          <div className="mt-4 text-center sm:hidden">
            <Link
              href="/zoeken"
              className="text-sm font-medium text-soft-champagne"
            >
              Alles bekijken →
            </Link>
          </div>
        </div>
      </section>

      {/* F. Populaire steden */}
      <section className="marketplace-section border-b border-white/10">
        <div className="container">
          <h2 className="section-title text-lg sm:text-xl">Populaire steden</h2>
          <p className="section-subtitle mt-1">Zoek profielen per locatie</p>
          <div className="mt-5">
            <PopularCitiesGrid />
          </div>
        </div>
      </section>

      {/* G. Waarom Veloura */}
      <WhyVeloura />
    </div>
  );
}
