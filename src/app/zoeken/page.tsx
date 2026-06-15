import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import { ZoekFilterBar } from "@/components/zoek/zoek-filter-bar";
import { ZoekActiveChips } from "@/components/zoek/zoek-active-chips";
import { Button } from "@/components/ui/button";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import {
  beschrijvingMatchtFilter,
  categorieMatcht,
  isTruthyFilter,
  matchtLengteFilter,
} from "@/lib/zoek-filters";

export const metadata: Metadata = {
  title: "Profielen zoeken",
  description: "Zoek discrete profielen op Veloura. Alleen 18+.",
};

interface ZoekenPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function parseNumber(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function hasActiveFilters(params: Record<string, string | undefined>) {
  return Object.keys(params).some((k) => {
    if (k === "ai") return false;
    const v = params[k];
    return v != null && v.trim() !== "";
  });
}

function filterAdvertenties(
  advertenties: Advertentie[],
  params: Record<string, string | undefined>
) {
  return advertenties.filter((ad) => {
    const tekst = `${ad.titel} ${ad.beschrijving}`;
    const { categorie, haarkleur, taal, lengte_van, lengte_tot } = params;

    if (categorie && !categorieMatcht(tekst, categorie)) return false;
    if (haarkleur && !beschrijvingMatchtFilter(tekst, "haarkleur", haarkleur)) return false;
    if (taal && !beschrijvingMatchtFilter(tekst, "taal", taal)) return false;
    if (isTruthyFilter(params.thuis_ontvangen) && !beschrijvingMatchtFilter(tekst, "thuis_ontvangen")) return false;
    if (isTruthyFilter(params.hotel_mogelijk) && !beschrijvingMatchtFilter(tekst, "hotel_mogelijk")) return false;
    if (isTruthyFilter(params.video_mogelijk) && !beschrijvingMatchtFilter(tekst, "video_mogelijk")) return false;
    if (!matchtLengteFilter(tekst, lengte_van, lengte_tot)) return false;

    return true;
  });
}

export default async function ZoekenPage({ searchParams }: ZoekenPageProps) {
  const params = await searchParams;
  const { q, stad, leeftijd_van, leeftijd_tot, prijs_min, prijs_max, geverifieerd } = params;

  const supabase = await createClient();

  let query = supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false });

  if (stad?.trim()) query = query.ilike("stad", `%${stad.trim()}%`);
  if (q?.trim()) {
    const term = q.trim();
    query = query.or(`titel.ilike.%${term}%,beschrijving.ilike.%${term}%,stad.ilike.%${term}%`);
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
  const advertenties = filterAdvertenties((advertentiesRaw ?? []) as Advertentie[], params);
  const fotos = await haalEersteFotos(supabase, advertenties.map((a) => a.id));
  const filtersActive = hasActiveFilters(params);

  return (
    <div className="search-page">
      <div className="search-page-top">
        <div className="container">
          <h1 className="search-page-top__title">Profielen zoeken</h1>
          <p className="search-page-top__subtitle">
            Filter snel of gebruik uitgebreide filters.
          </p>
        </div>
      </div>

      <div className="container search-page__body">
        <Suspense fallback={<div className="zoek-filter-bar zoek-filter-bar--skeleton" />}>
          <ZoekFilterBar />
        </Suspense>

        <Suspense fallback={null}>
          <ZoekActiveChips />
        </Suspense>

        <main className="zoek-results">
          {advertenties.length > 0 ? (
            <div className="listing-grid listing-grid--search">
              {advertenties.map((advertentie) => (
                <AdvertentieCard
                  key={advertentie.id}
                  advertentie={advertentie}
                  afbeeldingUrl={fotos.get(advertentie.id)}
                  theme="light"
                  premium
                  showOnline={advertentie.beschikbaar}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-card">
              <h3 className="font-display text-lg">Geen profielen gevonden</h3>
              <p className="mt-2 text-sm text-[var(--muted-dark)]">
                Pas je filters aan of bekijk alle actieve profielen.
              </p>
              {filtersActive && (
                <Button asChild variant="secondary-light" size="md" className="mt-4">
                  <Link href="/zoeken">Filters wissen</Link>
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
