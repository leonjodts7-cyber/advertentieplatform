import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import { ZoekFilterBar } from "@/components/zoek-filter-bar";
import { Button } from "@/components/ui/button";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profielen zoeken",
  description: "Zoek discrete profielen op Veloura. Alleen 18+.",
};

interface ZoekenPageProps {
  searchParams: Promise<{
    q?: string;
    stad?: string;
    categorie?: string;
    leeftijd_van?: string;
    leeftijd_tot?: string;
    prijs_min?: string;
    prijs_max?: string;
    geverifieerd?: string;
    ai?: string;
  }>;
}

function isTruthyFilter(value?: string) {
  return value === "1" || value === "true";
}

function parseNumber(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function hasActiveFilters(params: {
  q?: string;
  stad?: string;
  categorie?: string;
  leeftijd_van?: string;
  leeftijd_tot?: string;
  prijs_min?: string;
  prijs_max?: string;
  geverifieerd?: string;
  ai?: string;
}) {
  return !!(
    params.q?.trim() ||
    params.stad?.trim() ||
    params.categorie ||
    params.leeftijd_van ||
    params.leeftijd_tot ||
    params.prijs_min ||
    params.prijs_max ||
    isTruthyFilter(params.geverifieerd) ||
    params.ai === "1"
  );
}

export default async function ZoekenPage({ searchParams }: ZoekenPageProps) {
  const params = await searchParams;
  const {
    q,
    stad,
    leeftijd_van,
    leeftijd_tot,
    prijs_min,
    prijs_max,
    geverifieerd,
  } = params;

  const supabase = await createClient();

  let query = supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false });

  if (stad?.trim()) query = query.ilike("stad", `%${stad.trim()}%`);

  if (q?.trim()) {
    const term = q.trim();
    query = query.or(
      `titel.ilike.%${term}%,beschrijving.ilike.%${term}%,stad.ilike.%${term}%`
    );
  }

  if (isTruthyFilter(geverifieerd)) query = query.eq("geverifieerd", true);

  const leeftijdVan = parseNumber(leeftijd_van);
  const leeftijdTotRaw = leeftijd_tot?.trim();
  if (leeftijdVan != null) query = query.gte("leeftijd", leeftijdVan);
  if (leeftijdTotRaw && leeftijdTotRaw !== "65+") {
    const leeftijdTot = parseNumber(leeftijdTotRaw);
    if (leeftijdTot != null) query = query.lte("leeftijd", leeftijdTot);
  }

  const prijsMin = parseNumber(prijs_min);
  const prijsMax = parseNumber(prijs_max);
  if (prijsMin != null) query = query.gte("prijs_vanaf", prijsMin);
  if (prijsMax != null) query = query.lte("prijs_vanaf", prijsMax);

  const { data: advertentiesRaw } = await query;
  const advertenties = (advertentiesRaw ?? []) as Advertentie[];

  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  const filtersActive = hasActiveFilters(params);

  const resultLabel =
    advertenties.length === 0
      ? "0 profielen gevonden"
      : advertenties.length === 1
        ? "1 profiel gevonden"
        : `${advertenties.length} profielen gevonden`;

  return (
    <div className="search-page">
      <div className="search-page-hero">
        <div className="container">
          <h1 className="search-page-hero__title">Profielen zoeken</h1>
          <p className="search-page-hero__subtitle">
            Gebruik filters of beschrijf wat je zoekt.
          </p>
        </div>
      </div>

      <div className="content-section content-section--light">
        <div className="container py-5 sm:py-6">
          <Suspense
            fallback={
              <div className="filter-panel-premium h-56 animate-pulse rounded-2xl bg-[#f8f0e8]" />
            }
          >
            <ZoekFilterBar />
          </Suspense>

          <p className="results-count mt-6">{resultLabel}</p>

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
            <div className="empty-state-card mx-auto mt-5 max-w-md">
              <h3 className="font-display text-lg sm:text-xl">
                Geen profielen gevonden
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-dark)]">
                Pas je filters aan of bekijk alle actieve profielen.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                {filtersActive && (
                  <Button asChild variant="secondary-light" size="md">
                    <Link href="/zoeken">Filters wissen</Link>
                  </Button>
                )}
                <Button asChild size="md">
                  <Link href="/zoeken">Bekijk alle profielen</Link>
                </Button>
              </div>
              <p className="mt-5 text-xs text-[var(--muted-dark)]">
                Aanbieder?{" "}
                <Link
                  href="/dashboard/advertenties/nieuw"
                  className="font-medium text-[var(--wine)] hover:underline"
                >
                  Plaats advertentie
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
