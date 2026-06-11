import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import { ZoekFilterBar } from "@/components/zoek-filter-bar";
import { ZoekMobileBar } from "@/components/zoek-mobile-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profielen zoeken",
  description: "Zoek discrete profielen op Veloura. Alleen 18+.",
};

interface ZoekenPageProps {
  searchParams: Promise<{
    stad?: string;
    categorie?: string;
    beschikbaar?: string;
    geverifieerd?: string;
  }>;
}

function isTruthyFilter(value?: string) {
  return value === "1" || value === "true";
}

export default async function ZoekenPage({ searchParams }: ZoekenPageProps) {
  const { stad, categorie, beschikbaar, geverifieerd } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false });

  if (stad?.trim()) query = query.ilike("stad", `%${stad.trim()}%`);
  if (isTruthyFilter(beschikbaar)) query = query.eq("beschikbaar", true);
  if (isTruthyFilter(geverifieerd)) query = query.eq("geverifieerd", true);

  const { data: advertentiesRaw } = await query;
  const advertenties = (advertentiesRaw ?? []) as Advertentie[];

  const categorieLabel = categorie
    ? MARKETPLACE_CATEGORIEEN.find((c) => c.slug === categorie)?.label
    : null;

  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  return (
    <div>
      <div className="page-header-band">
        <div className="container">
          <p className="text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Veloura
          </p>
          <h1 className="section-title mt-1">Profielen zoeken</h1>
          <p className="section-subtitle mt-1.5 max-w-lg">
            Vind discrete profielen in jouw regio. Alleen 18+.
          </p>
        </div>
      </div>

      <div className="filter-bar-sticky lg:hidden">
        <div className="container">
          <Suspense
            fallback={
              <div className="h-11 animate-pulse rounded-xl bg-white/[0.04]" />
            }
          >
            <ZoekMobileBar />
          </Suspense>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-[5.5rem]">
              <Suspense
                fallback={
                  <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
                }
              >
                <ZoekFilterBar />
              </Suspense>
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {advertenties.length}
                </span>{" "}
                profielen
                {stad?.trim() ? ` in ${stad.trim()}` : ""}
              </p>
              {categorieLabel && (
                <Badge variant="wine">Categorie: {categorieLabel}</Badge>
              )}
              {isTruthyFilter(beschikbaar) && (
                <Badge variant="green">Beschikbaar</Badge>
              )}
              {isTruthyFilter(geverifieerd) && (
                <Badge variant="champagne">Geverifieerd</Badge>
              )}
            </div>

            {advertenties.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {advertenties.map((advertentie) => (
                  <AdvertentieCard
                    key={advertentie.id}
                    advertentie={advertentie}
                    afbeeldingUrl={fotos.get(advertentie.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="velvet-card mx-auto max-w-md p-8 text-center sm:p-10">
                <p className="font-display text-xl text-foreground">
                  Geen profielen gevonden
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pas je filters aan of plaats zelf een profiel als aanbieder.
                </p>
                <Button asChild variant="primary" className="mt-5">
                  <Link href="/dashboard/advertenties/nieuw">
                    Plaats advertentie
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
