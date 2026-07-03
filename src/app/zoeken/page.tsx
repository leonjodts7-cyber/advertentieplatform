import type { Metadata } from "next";
import { ZoekenPageContent } from "@/components/zoek/zoeken-page-content";
import { haalEersteFotos, haalFotoAantallen } from "@/lib/advertentie-fotos";
import {
  fetchActieveAdvertenties,
  fetchPremiumAdvertenties,
} from "@/lib/advertentie-queries";
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
import { isPlaatsingActief, plaatsingType } from "@/lib/advertentie-boost";
import {
  parseZoekSort,
  sortAdvertentiesByOption,
} from "@/lib/zoek-sort";

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

    if (isTruthyFilter(params.spotlight)) {
      const spotlight =
        isPlaatsingActief(ad) && plaatsingType(ad) === "homepage";
      if (!spotlight) return false;
    }

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

  advertenties = sortAdvertentiesByOption(
    advertenties,
    parseZoekSort(params.sort)
  );

  const fotos = await haalEersteFotos(supabase, advertenties.map((a) => a.id));
  const fotoCounts = await haalFotoAantallen(
    supabase,
    advertenties.map((a) => a.id)
  );
  const filtersActive = hasActiveFilters(params);

  let fallbackPremium: Advertentie[] = [];
  let fallbackLatest: Advertentie[] = [];
  let fallbackFotos = new Map<string, string | undefined>();

  if (advertenties.length === 0) {
    [fallbackPremium, fallbackLatest] = await Promise.all([
      fetchPremiumAdvertenties(supabase, 24),
      fetchActieveAdvertenties(supabase, { limit: 24 }),
    ]);
    const fallbackIds = [
      ...fallbackPremium.map((a) => a.id),
      ...fallbackLatest.map((a) => a.id),
    ];
    fallbackFotos = await haalEersteFotos(supabase, [...new Set(fallbackIds)]);
  }

  return (
    <ZoekenPageContent
      advertenties={advertenties}
      fotos={fotos}
      fotoCounts={fotoCounts}
      filtersActive={filtersActive}
      fallbackPremium={fallbackPremium}
      fallbackLatest={fallbackLatest}
      fallbackFotos={fallbackFotos}
      aiQuery={ai === "1" && q?.trim() ? q.trim() : undefined}
    />
  );
}
