import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import {
  ZoekCategoryBar,
  ZoekFilterBar,
} from "@/components/zoek-filter-bar";
import { Button } from "@/components/ui/button";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profielen zoeken",
  description: "Zoek discrete profielen op Veloura. Alleen 18+.",
};

const POPULAIRE_ZOEKOPDRACHTEN = [
  { label: "Escort Antwerpen", href: "/zoeken?stad=Antwerpen&categorie=escort" },
  {
    label: "Privé ontvangst Gent",
    href: "/zoeken?stad=Gent&categorie=prive-ontvangst",
  },
  { label: "Massage Brussel", href: "/zoeken?stad=Brussel&categorie=massage" },
  { label: "Video afspraak", href: "/zoeken?categorie=video" },
  { label: "Geverifieerde profielen", href: "/zoeken?geverifieerd=true" },
  { label: "Koppels Vlaanderen", href: "/zoeken?categorie=koppels" },
] as const;

interface ZoekenPageProps {
  searchParams: Promise<{
    q?: string;
    stad?: string;
    afstand?: string;
    categorie?: string;
    leeftijd_van?: string;
    leeftijd_tot?: string;
    prijs_min?: string;
    prijs_max?: string;
    geverifieerd?: string;
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
  afstand?: string;
  categorie?: string;
  leeftijd_van?: string;
  leeftijd_tot?: string;
  prijs_min?: string;
  prijs_max?: string;
  geverifieerd?: string;
}) {
  return !!(
    params.q?.trim() ||
    params.stad?.trim() ||
    params.afstand ||
    params.categorie ||
    params.leeftijd_van ||
    params.leeftijd_tot ||
    params.prijs_min ||
    params.prijs_max ||
    isTruthyFilter(params.geverifieerd)
  );
}

export default async function ZoekenPage({ searchParams }: ZoekenPageProps) {
  const params = await searchParams;
  const {
    q,
    stad,
    categorie,
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
      <div className="search-page-header">
        <div className="container">
          <h1 className="section-title text-xl sm:text-2xl">Profielen zoeken</h1>
          <p className="section-subtitle mt-1 max-w-lg">
            Filter op regio, categorie en voorkeuren.
          </p>
        </div>
      </div>

      <Suspense fallback={null}>
        <ZoekCategoryBar activeSlug={categorie} />
      </Suspense>

      <div className="section-light">
        <div className="container py-5 sm:py-7">
          <Suspense
            fallback={
              <div className="filter-panel-premium mb-5 h-64 animate-pulse rounded-2xl bg-[#f8f0e8]" />
            }
          >
            <ZoekFilterBar />
          </Suspense>

          <p className="results-count mt-6">{resultLabel}</p>

          {advertenties.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <p className="mt-2 text-sm leading-relaxed text-[#74665f]">
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
              <p className="mt-5 text-xs text-[#74665f]">
                Aanbieder?{" "}
                <Link
                  href="/dashboard/advertenties/nieuw"
                  className="font-medium text-[#7b2f49] hover:underline"
                >
                  Plaats advertentie
                </Link>
              </p>
            </div>
          )}

          <section className="mt-10 border-t border-[#e6d8cf] pt-8">
            <h2 className="font-display text-lg font-medium text-[#24191f]">
              Populaire zoekopdrachten
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {POPULAIRE_ZOEKOPDRACHTEN.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="popular-search-link"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
