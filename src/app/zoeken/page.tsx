import { Suspense } from "react";
import type { Metadata } from "next";
import { ZoekFilterBar } from "@/components/zoek/zoek-filter-bar";
import { ZoekActiveChips } from "@/components/zoek/zoek-active-chips";
import { ZoekResults } from "@/components/zoek/zoek-results";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import {
  beschrijvingMatchtFilter,
  categorieMatcht,
  isNieuwProfiel,
  isTruthyFilter,
  matchtLengteFilter,
  typeAfspraakMatcht,
} from "@/lib/zoek-filters";
import {
  metaBevatTerm,
  parseAdvertentieBeschrijving,
} from "@/lib/advertentie-metadata";
import { sorteerAdvertenties } from "@/lib/advertentie-boost";

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
    const { tekst, meta } = parseAdvertentieBeschrijving(ad.beschrijving);
    const fullTekst = `${ad.titel} ${tekst}`;
    const {
      categorie,
      type_afspraak,
      haarkleur,
      oogkleur,
      taal,
      lengte_van,
      lengte_tot,
    } = params;

    if (categorie) {
      const catMatch =
        meta.categorie === categorie ||
        categorieMatcht(fullTekst, categorie);
      if (!catMatch) return false;
    }
    if (type_afspraak && !typeAfspraakMatcht(fullTekst, type_afspraak)) return false;
    if (haarkleur) {
      const match =
        meta.haarkleur?.toLowerCase() === haarkleur ||
        beschrijvingMatchtFilter(fullTekst, "haarkleur", haarkleur);
      if (!match) return false;
    }
    if (oogkleur) {
      const match =
        meta.oogkleur?.toLowerCase() === oogkleur ||
        beschrijvingMatchtFilter(fullTekst, "oogkleur", oogkleur);
      if (!match) return false;
    }
    if (taal) {
      const match =
        meta.talen?.some((t) => t.toLowerCase().includes(taal)) ||
        beschrijvingMatchtFilter(fullTekst, "taal", taal);
      if (!match) return false;
    }
    if (isTruthyFilter(params.koppels_welkom)) {
      const match =
        meta.mogelijkheden?.includes("koppels") ||
        metaBevatTerm(meta, "koppel");
      if (!match) return false;
    }
    if (isTruthyFilter(params.thuis_ontvangen) && !beschrijvingMatchtFilter(fullTekst, "thuis_ontvangen")) return false;
    if (isTruthyFilter(params.hotel_mogelijk) && !beschrijvingMatchtFilter(fullTekst, "hotel_mogelijk") && !meta.mogelijkheden?.includes("hotel")) return false;
    if (isTruthyFilter(params.video_mogelijk) && !beschrijvingMatchtFilter(fullTekst, "video_mogelijk") && !meta.mogelijkheden?.includes("video")) return false;
    if (isTruthyFilter(params.discreet_contact) && !beschrijvingMatchtFilter(fullTekst, "discreet_contact") && !meta.mogelijkheden?.includes("discreet")) return false;
    if (isTruthyFilter(params.verplaatsing_mogelijk) && !beschrijvingMatchtFilter(fullTekst, "verplaatsing_mogelijk")) return false;
    if (!matchtLengteFilter(fullTekst, lengte_van, lengte_tot)) {
      if (meta.lengteCm) {
        const min = lengte_van ? Number(lengte_van) : null;
        const max = lengte_tot ? Number(lengte_tot) : null;
        if (min != null && meta.lengteCm < min) return false;
        if (max != null && meta.lengteCm > max) return false;
      } else if (lengte_van || lengte_tot) {
        return false;
      }
    }
    if (isTruthyFilter(params.beschikbaar) && !ad.beschikbaar) return false;
    if (isTruthyFilter(params.nieuw_profiel) && !isNieuwProfiel(ad.aangemaakt_op)) return false;
    if (isTruthyFilter(params.premium_profiel) && ad.premium !== true) return false;

    return true;
  });
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
    ai,
  } = params;

  const supabase = await createClient();

  let query = supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false });

  if (stad?.trim()) query = query.ilike("stad", `%${stad.trim()}%`);
  if (q?.trim() && ai !== "1") {
    const term = q.trim();
    query = query.or(`titel.ilike.%${term}%,beschrijving.ilike.%${term}%,stad.ilike.%${term}%`);
  }
  if (isTruthyFilter(geverifieerd)) query = query.eq("geverifieerd", true);
  if (isTruthyFilter(params.premium_profiel)) {
    query = query.eq("premium", true);
  }
  if (isTruthyFilter(params.beschikbaar)) {
    query = query.eq("beschikbaar", true);
  }

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
  let advertenties = filterAdvertenties((advertentiesRaw ?? []) as Advertentie[], params);

  if (ai === "1" && q?.trim()) {
    const term = q.trim().toLowerCase();
    advertenties = advertenties.filter((ad) => {
      const haystack = `${ad.titel} ${ad.beschrijving} ${ad.stad}`.toLowerCase();
      return haystack.includes(term) || term.split(/\s+/).some((w) => haystack.includes(w));
    });
  }

  advertenties = sorteerAdvertenties(advertenties);

  const fotos = await haalEersteFotos(supabase, advertenties.map((a) => a.id));
  const filtersActive = hasActiveFilters(params);

  return (
    <div className="search-page search-page--compact">
      <div className="search-page-top search-page-top--compact">
        <div className="container">
          <h1 className="search-page-top__title">Profielen zoeken</h1>
          <p className="search-page-top__subtitle">
            Zoek snel of verfijn met filters.
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

        {ai === "1" && q?.trim() && (
          <div className="zoek-ai-banner">
            <SparklesIcon />
            <span>
              AI zoekopdracht: <strong>{q.trim()}</strong>
            </span>
          </div>
        )}

        <ZoekResults
          advertenties={advertenties}
          fotos={fotos}
          filtersActive={filtersActive}
        />
      </div>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-[var(--champagne)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
