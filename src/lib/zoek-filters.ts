import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";

export const CATEGORIE_LABELS = Object.fromEntries(
  MARKETPLACE_CATEGORIEEN.map((c) => [c.slug, c.label])
);

export const HAARKLEUR_OPTIES = [
  { value: "", label: "Alle haarkleuren" },
  { value: "blond", label: "Blond" },
  { value: "bruin", label: "Bruin" },
  { value: "zwart", label: "Zwart" },
  { value: "rood", label: "Rood" },
  { value: "grijs", label: "Grijs" },
  { value: "anders", label: "Anders" },
] as const;

export const OOGKLEUR_OPTIES = [
  { value: "", label: "Alle oogkleuren" },
  { value: "blauw", label: "Blauw" },
  { value: "bruin", label: "Bruin" },
  { value: "groen", label: "Groen" },
  { value: "grijs", label: "Grijs" },
  { value: "anders", label: "Anders" },
] as const;

export const NATIONALITEIT_OPTIES = [
  { value: "", label: "Alle nationaliteiten" },
  { value: "belgisch", label: "Belgisch" },
  { value: "nederlands", label: "Nederlands" },
  { value: "frans", label: "Frans" },
  { value: "duits", label: "Duits" },
  { value: "spaans", label: "Spaans" },
  { value: "italiaans", label: "Italiaans" },
  { value: "anders", label: "Anders" },
] as const;

export const TAAL_OPTIES = [
  { value: "", label: "Alle talen" },
  { value: "nl", label: "Nederlands" },
  { value: "fr", label: "Frans" },
  { value: "en", label: "Engels" },
  { value: "de", label: "Duits" },
  { value: "es", label: "Spaans" },
] as const;

export type ZoekFilterValues = {
  q: string;
  stad: string;
  afstand: string;
  categorie: string | null;
  leeftijdVan: string;
  leeftijdTot: string;
  prijsMin: string;
  prijsMax: string;
  lengteVan: string;
  lengteTot: string;
  gewichtVan: string;
  gewichtTot: string;
  haarkleur: string;
  oogkleur: string;
  nationaliteit: string;
  taal: string;
  geverifieerd: boolean;
  beschikbaar: boolean;
  hotelMogelijk: boolean;
  thuisOntvangen: boolean;
  videoMogelijk: boolean;
  koppelsWelkom: boolean;
  rokenToegestaan: boolean;
};

export type ParsedZoekFilters = Partial<{
  q: string;
  stad: string;
  afstand: string;
  categorie: string;
  leeftijd_van: string;
  leeftijd_tot: string;
  prijs_min: string;
  prijs_max: string;
  lengte_van: string;
  lengte_tot: string;
  gewicht_van: string;
  gewicht_tot: string;
  haarkleur: string;
  oogkleur: string;
  nationaliteit: string;
  taal: string;
  geverifieerd: string;
  beschikbaar: string;
  hotel_mogelijk: string;
  thuis_ontvangen: string;
  video_mogelijk: string;
  koppels_welkom: string;
  roken_toegestaan: string;
}>;

export function buildFilterParams(values: ZoekFilterValues) {
  const params = new URLSearchParams();
  if (values.q.trim()) params.set("q", values.q.trim());
  if (values.stad.trim()) params.set("stad", values.stad.trim());
  if (values.afstand) params.set("afstand", values.afstand);
  if (values.categorie) params.set("categorie", values.categorie);
  if (values.leeftijdVan.trim()) params.set("leeftijd_van", values.leeftijdVan.trim());
  if (values.leeftijdTot.trim()) params.set("leeftijd_tot", values.leeftijdTot.trim());
  if (values.prijsMin.trim()) params.set("prijs_min", values.prijsMin.trim());
  if (values.prijsMax.trim()) params.set("prijs_max", values.prijsMax.trim());
  if (values.lengteVan.trim()) params.set("lengte_van", values.lengteVan.trim());
  if (values.lengteTot.trim()) params.set("lengte_tot", values.lengteTot.trim());
  if (values.gewichtVan.trim()) params.set("gewicht_van", values.gewichtVan.trim());
  if (values.gewichtTot.trim()) params.set("gewicht_tot", values.gewichtTot.trim());
  if (values.haarkleur) params.set("haarkleur", values.haarkleur);
  if (values.oogkleur) params.set("oogkleur", values.oogkleur);
  if (values.nationaliteit) params.set("nationaliteit", values.nationaliteit);
  if (values.taal) params.set("taal", values.taal);
  if (values.geverifieerd) params.set("geverifieerd", "true");
  if (values.beschikbaar) params.set("beschikbaar", "true");
  if (values.hotelMogelijk) params.set("hotel_mogelijk", "true");
  if (values.thuisOntvangen) params.set("thuis_ontvangen", "true");
  if (values.videoMogelijk) params.set("video_mogelijk", "true");
  if (values.koppelsWelkom) params.set("koppels_welkom", "true");
  if (values.rokenToegestaan) params.set("roken_toegestaan", "true");
  return params;
}

export function parsedFiltersToParams(filters: ParsedZoekFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value != null && String(value).trim() !== "") {
      params.set(key, String(value).trim());
    }
  }
  return params;
}

export function isTruthyFilter(value?: string) {
  return value === "1" || value === "true";
}

export function labelFromOptions(
  value: string,
  options: readonly { value: string; label: string }[]
) {
  return options.find((o) => o.value === value)?.label ?? value;
}

const KEYWORD_FILTERS: Record<string, string[]> = {
  thuis_ontvangen: ["thuis", "ontvang", "incall", "privé"],
  hotel_mogelijk: ["hotel"],
  video_mogelijk: ["video", "virtueel", "cam"],
  koppels_welkom: ["koppel", "koppels", "stel"],
  roken_toegestaan: ["roken", "roker"],
};

const HAARKLEUR_TERMS: Record<string, string[]> = {
  blond: ["blond", "blonde"],
  bruin: ["bruin", "bruine", "brunette"],
  zwart: ["zwart", "zwarte"],
  rood: ["rood", "rode", "roodharig"],
  grijs: ["grijs", "grijze"],
};

const OOGKLEUR_TERMS: Record<string, string[]> = {
  blauw: ["blauw", "blauwe"],
  bruin: ["bruin", "bruine"],
  groen: ["groen", "groene"],
  grijs: ["grijs", "grijze"],
};

const NATIONALITEIT_TERMS: Record<string, string[]> = {
  belgisch: ["belg", "belgië"],
  nederlands: ["nederland"],
  frans: ["frans", "frankrijk"],
  duits: ["duits", "duitsland"],
  spaans: ["spaans", "spanje"],
  italiaans: ["italiaans", "italië"],
};

const TAAL_TERMS: Record<string, string[]> = {
  nl: ["nederlands", "nederlandse"],
  fr: ["frans", "franse"],
  en: ["engels", "english"],
  de: ["duits", "duitse"],
  es: ["spaans", "spanish"],
};

const CATEGORIE_TERMS: Record<string, string[]> = {
  "prive-ontvangst": ["privé", "prive", "ontvang", "incall"],
  escort: ["escort"],
  massage: ["massage", "wellness"],
  video: ["video", "virtueel", "cam"],
  koppels: ["koppel", "koppels"],
  trans: ["trans"],
  mannen: ["man", "mannelijk"],
  vrouwen: ["vrouw", "vrouwelijk"],
};

export function categorieMatcht(tekst: string, categorie: string): boolean {
  const terms = CATEGORIE_TERMS[categorie] ?? [categorie];
  const lower = tekst.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

function extractNumber(tekst: string, pattern: RegExp): number | null {
  const match = tekst.match(pattern);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

export function beschrijvingMatchtFilter(
  tekst: string,
  filterKey: string,
  filterValue?: string
): boolean {
  const lower = tekst.toLowerCase();

  if (filterKey === "haarkleur" && filterValue) {
    const terms = HAARKLEUR_TERMS[filterValue] ?? [filterValue];
    return terms.some((t) => lower.includes(t));
  }
  if (filterKey === "oogkleur" && filterValue) {
    const terms = OOGKLEUR_TERMS[filterValue] ?? [filterValue];
    return terms.some((t) => lower.includes(t));
  }
  if (filterKey === "nationaliteit" && filterValue) {
    const terms = NATIONALITEIT_TERMS[filterValue] ?? [filterValue];
    return terms.some((t) => lower.includes(t));
  }
  if (filterKey === "taal" && filterValue) {
    const terms = TAAL_TERMS[filterValue] ?? [filterValue];
    return terms.some((t) => lower.includes(t));
  }

  const keywords = KEYWORD_FILTERS[filterKey];
  if (keywords) return keywords.some((k) => lower.includes(k));
  return true;
}

export function matchtLengteFilter(
  tekst: string,
  van?: string,
  tot?: string
): boolean {
  const lengte = extractNumber(tekst, /(\d{3})\s*cm/i);
  if (lengte == null) return van == null && tot == null;
  const min = van ? Number(van) : null;
  const max = tot ? Number(tot) : null;
  if (min != null && lengte < min) return false;
  if (max != null && lengte > max) return false;
  return true;
}

export function matchtGewichtFilter(
  tekst: string,
  van?: string,
  tot?: string
): boolean {
  const gewicht = extractNumber(tekst, /(\d{2,3})\s*kg/i);
  if (gewicht == null) return van == null && tot == null;
  const min = van ? Number(van) : null;
  const max = tot ? Number(tot) : null;
  if (min != null && gewicht < min) return false;
  if (max != null && gewicht > max) return false;
  return true;
}
