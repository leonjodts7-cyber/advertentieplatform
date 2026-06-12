import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import { MarketplaceHeroSearch } from "@/components/marketplace-hero-search";
import { ProfilePreviewCard } from "@/components/profile-preview-card";
import { PopularCitiesGrid } from "@/components/popular-cities-grid";
import { WhyVeloura } from "@/components/why-veloura";
import { Button } from "@/components/ui/button";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import { HOME_PREVIEW_PROFIELEN } from "@/lib/home-preview-profielen";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
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

              <h1 className="font-display mt-3 text-[1.75rem] font-medium leading-[1.1] sm:text-4xl lg:text-[2.5rem]">
                Vind discrete profielen in jouw regio
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

      {/* B. Online nu */}
      <section className="marketplace-section border-b border-white/10 bg-white/[0.02]">
        <div className="container">
          <h2 className="section-title text-lg sm:text-xl">Online nu</h2>
          <p className="section-subtitle mt-1">
            Populaire profielen in jouw regio
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {HOME_PREVIEW_PROFIELEN.map((p) => (
              <ProfilePreviewCard
                key={p.id}
                profiel={p}
                href={`/zoeken?stad=${encodeURIComponent(p.stad)}`}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground/80">
            Voorbeeldweergave — geen echte personen
          </p>
        </div>
      </section>

      {/* C. Populaire steden */}
      <section className="marketplace-section border-b border-white/10">
        <div className="container">
          <h2 className="section-title text-lg sm:text-xl">Populaire steden</h2>
          <p className="section-subtitle mt-1">Zoek profielen per locatie</p>
          <div className="mt-5">
            <PopularCitiesGrid />
          </div>
        </div>
      </section>

      {/* D. Populaire categorieën */}
      <section className="marketplace-section border-b border-white/10 bg-white/[0.02]">
        <div className="container">
          <h2 className="section-title text-lg sm:text-xl">
            Populaire categorieën
          </h2>
          <p className="section-subtitle mt-1">Vind wat bij jou past</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {MARKETPLACE_CATEGORIEEN.map((cat) => (
              <Link
                key={cat.slug}
                href={`/zoeken?categorie=${cat.slug}`}
                className="category-card"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                  Plaats advertentie
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

      {/* F. Waarom Veloura */}
      <WhyVeloura />

      {/* G. Voor aanbieders */}
      <section className="marketplace-section border-t border-white/10 bg-white/[0.02]">
        <div className="container">
          <div className="profile-card mx-auto max-w-2xl p-8 text-center sm:p-10">
            <h2 className="font-display text-xl text-foreground sm:text-2xl">
              Word zichtbaar bij bezoekers in jouw regio
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Plaats jouw advertentie, beheer je profiel en bereik sneller
              geïnteresseerde bezoekers.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
