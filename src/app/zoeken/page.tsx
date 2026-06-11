import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import { ZoekFilterBar } from "@/components/zoek-filter-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Advertenties zoeken",
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

export default async function ZoekenPage({ searchParams }: ZoekenPageProps) {
  const { stad, categorie, beschikbaar, geverifieerd } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false });

  if (stad?.trim()) query = query.ilike("stad", `%${stad.trim()}%`);
  if (beschikbaar === "1") query = query.eq("beschikbaar", true);
  if (geverifieerd === "1") query = query.eq("geverifieerd", true);

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
          <p className="text-[0.6875rem] uppercase tracking-wider text-veloura-soft">
            Veloura
          </p>
          <h1 className="section-title mt-1">Advertenties zoeken</h1>
          <p className="section-subtitle mt-1.5 max-w-lg">
            Vind discrete profielen in jouw regio. Alleen 18+.
          </p>
        </div>
      </div>

      <div className="filter-bar-sticky">
        <div className="container">
          <Suspense
            fallback={
              <div className="h-20 animate-pulse rounded-2xl bg-white/[0.04]" />
            }
          >
            <ZoekFilterBar />
          </Suspense>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <p className="text-sm text-veloura-soft">
            <span className="font-medium text-veloura-ivory">
              {advertenties.length}
            </span>{" "}
            resultaten
            {stad?.trim() ? ` in ${stad.trim()}` : ""}
          </p>
          {categorieLabel && (
            <Badge variant="rose">Categorie: {categorieLabel}</Badge>
          )}
          {beschikbaar === "1" && <Badge variant="green">Beschikbaar</Badge>}
          {geverifieerd === "1" && (
            <Badge variant="champagne">Geverifieerd</Badge>
          )}
        </div>

        {advertenties.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {advertenties.map((advertentie) => (
              <AdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="luxury-card mx-auto max-w-md p-8 text-center sm:p-10">
            <p className="font-display text-xl text-veloura-ivory">
              Geen advertenties gevonden
            </p>
            <p className="mt-2 text-sm text-veloura-soft">
              Pas je filters aan of plaats zelf een profiel.
            </p>
            <Button asChild className="mt-5">
              <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
