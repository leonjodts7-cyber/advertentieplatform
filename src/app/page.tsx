import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import { CategoryGrid } from "@/components/category-grid";
import { MarketplaceHeroSearch } from "@/components/marketplace-hero-search";
import { MarketplacePreview } from "@/components/marketplace-preview";
import { PopularSearches } from "@/components/popular-searches";
import { AiLoungeHomeSection } from "@/components/ai/ai-lounge-home-section";
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

  return (
    <div>
      <section className="border-b border-white/10">
        <div className="container py-6 sm:py-8 lg:py-10">
          <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="order-2 lg:order-1 animate-fade-in">
              <p className="trustline-text text-[0.625rem] font-medium uppercase sm:text-[0.6875rem]">
                Alleen 18+ · Discreet · Geverifieerd · Direct contact
              </p>

              <h1 className="font-display mt-3 text-[1.625rem] font-medium leading-[1.12] text-foreground sm:text-4xl lg:text-[2.375rem]">
                Vind{" "}
                <span className="text-gradient-hero">discrete profielen</span>{" "}
                bij jou in de buurt
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                Ontdek zelfstandige aanbieders voor privé ontvangst, escort,
                video en meer. Veilig, discreet en mobiel-first.
              </p>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Button asChild size="lg" variant="primary" className="w-full sm:w-auto">
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
              <div className="glass-panel p-4 sm:p-5">
                <MarketplaceHeroSearch />
              </div>
            </div>
          </div>

          <div className="mt-6 hidden lg:block">
            <MarketplacePreview />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 py-6 sm:py-8">
        <div className="container">
          <h2 className="section-title text-lg sm:text-xl">
            Populaire zoekopdrachten
          </h2>
          <div className="mt-4">
            <PopularSearches />
          </div>
        </div>
      </section>

      <section className="section-spacing border-b border-white/10">
        <div className="container">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="section-title">Nieuwste profielen</h2>
              <p className="section-subtitle mt-1">Actief op Veloura</p>
            </div>
            <Link
              href="/zoeken"
              className="hidden text-sm font-medium text-champagne-light hover:text-champagne sm:inline"
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
            <div className="velvet-card mt-5 p-8 text-center sm:p-12">
              <p className="font-display text-xl text-foreground">
                Er zijn nog geen actieve profielen.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Wees de eerste aanbieder op Veloura en bereik bezoekers in jouw
                regio.
              </p>
              <Button asChild size="lg" variant="primary" className="mt-5">
                <Link href="/dashboard/advertenties/nieuw">
                  Plaats eerste advertentie
                </Link>
              </Button>
            </div>
          )}

          <div className="mt-4 text-center sm:hidden">
            <Link
              href="/zoeken"
              className="text-sm font-medium text-champagne-light"
            >
              Alles bekijken →
            </Link>
          </div>
        </div>
      </section>

      <AiLoungeHomeSection />

      <section className="section-spacing">
        <div className="container">
          <h2 className="section-title">Populaire categorieën</h2>
          <p className="section-subtitle mt-1">
            Zoek profielen per type dienst
          </p>
          <div className="mt-5">
            <CategoryGrid />
          </div>
        </div>
      </section>
    </div>
  );
}
