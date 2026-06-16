import {
  HOMEPAGE_CATEGORIEEN,
  MARKETPLACE_CATEGORIEEN,
  TYPE_AFSPRAAK_OPTIES,
} from "@/lib/marketplace";

export const CATEGORIE_LABELS = Object.fromEntries([
  ...MARKETPLACE_CATEGORIEEN.map((c) => [c.slug, c.label]),
  ...HOMEPAGE_CATEGORIEEN.map((c) => [c.slug, c.label]),
]);

export const ALLE_CATEGORIE_OPTIES = [
  { value: "", label: "Alle categorieën" },
  ...HOMEPAGE_CATEGORIEEN.map((c) => ({ value: c.slug, label: c.label })),
];

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
  typeAfspraak: string;
  leeftijdVan: string;
  leeftijdTot: string;
  prijsMin: string;
  prijsMax: string;
  lengteVan: string;
  lengteTot: string;
  haarkleur: string;
  oogkleur: string;
  taal: string;
  geverifieerd: boolean;
  beschikbaar: boolean;
  hotelMogelijk: boolean;
  thuisOntvangen: boolean;
  videoMogelijk: boolean;
  discreetContact: boolean;
  nieuwProfiel: boolean;
  premiumProfiel: boolean;
  verplaatsingMogelijk: boolean;
  koppelsWelkom: boolean;
};

export type ParsedZoekFilters = Partial<{
  q: string;
  stad: string;
  afstand: string;
  categorie: string;
  type_afspraak: string;
  leeftijd_van: string;
  leeftijd_tot: string;
  prijs_min: string;
  prijs_max: string;
  lengte_van: string;
  lengte_tot: string;
  haarkleur: string;
  oogkleur: string;
  taal: string;
  geverifieerd: string;
  beschikbaar: string;
  hotel_mogelijk: string;
  thuis_ontvangen: string;
  video_mogelijk: string;
  discreet_contact: string;
  nieuw_profiel: string;
  premium_profiel: string;
  verplaatsing_mogelijk: string;
  koppels_welkom: string;
}>;

export function buildFilterParams(values: ZoekFilterValues) {
  const params = new URLSearchParams();
  if (values.q.trim()) params.set("q", values.q.trim());
  if (values.stad.trim()) params.set("stad", values.stad.trim());
  if (values.afstand) params.set("afstand", values.afstand);
  if (values.categorie) params.set("categorie", values.categorie);
  if (values.typeAfspraak) params.set("type_afspraak", values.typeAfspraak);
  if (values.leeftijdVan.trim()) params.set("leeftijd_van", values.leeftijdVan.trim());
  if (values.leeftijdTot.trim()) params.set("leeftijd_tot", values.leeftijdTot.trim());
  if (values.prijsMin.trim()) params.set("prijs_min", values.prijsMin.trim());
  if (values.prijsMax.trim()) params.set("prijs_max", values.prijsMax.trim());
  if (values.lengteVan.trim()) params.set("lengte_van", values.lengteVan.trim());
  if (values.lengteTot.trim()) params.set("lengte_tot", values.lengteTot.trim());
  if (values.haarkleur) params.set("haarkleur", values.haarkleur);
  if (values.oogkleur) params.set("oogkleur", values.oogkleur);
  if (values.taal) params.set("taal", values.taal);
  if (values.geverifieerd) params.set("geverifieerd", "true");
  if (values.beschikbaar) params.set("beschikbaar", "true");
  if (values.hotelMogelijk) params.set("hotel_mogelijk", "true");
  if (values.thuisOntvangen) params.set("thuis_ontvangen", "true");
  if (values.videoMogelijk) params.set("video_mogelijk", "true");
  if (values.discreetContact) params.set("discreet_contact", "true");
  if (values.nieuwProfiel) params.set("nieuw_profiel", "true");
  if (values.premiumProfiel) params.set("premium_profiel", "true");
  if (values.verplaatsingMogelijk) params.set("verplaatsing_mogelijk", "true");
  if (values.koppelsWelkom) params.set("koppels_welkom", "true");
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
  discreet_contact: ["discreet", "discrete"],
  verplaatsing_mogelijk: ["verplaats", "outcall", "bezoek"],
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

const TAAL_TERMS: Record<string, string[]> = {
  nl: ["nederlands", "nederlandse"],
  fr: ["frans", "franse"],
  en: ["engels", "english"],
  de: ["duits", "duitse"],
  es: ["spaans", "spanish"],
};

const CATEGORIE_TERMS: Record<string, string[]> = {
  privehuizen: ["privéhuis", "privehuis", "privé huis"],
  "prive-ontvangst": ["privé", "prive", "ontvang", "incall"],
  escort: ["escort"],
  massagesalons: ["massagesalon", "salon"],
  "bars-clubs": ["bar", "club", "privéclub"],
  "rendez-vous-hotels": ["rendez-vous", "rendezvous", "hotel"],
  "prive-saunas": ["sauna", "privé sauna"],
  parenclubs: ["parenclub", "paren club"],
  massage: ["massage", "wellness"],
  video: ["video", "virtueel", "cam"],
  koppels: ["koppel", "koppels"],
  trans: ["trans"],
  mannen: ["man", "mannelijk"],
  vrouwen: ["vrouw", "vrouwelijk"],
};

const TYPE_AFSPRAAK_TERMS: Record<string, string[]> = {
  "prive-ontvangst": ["privé", "prive", "ontvang", "incall"],
  escort: ["escort"],
  massage: ["massage"],
  video: ["video", "virtueel"],
  hotel: ["hotel"],
  club: ["club"],
  "thuis-ontvangen": ["thuis", "ontvang"],
  verplaatsing: ["verplaats", "outcall"],
};

export function categorieMatcht(tekst: string, categorie: string): boolean {
  const terms = CATEGORIE_TERMS[categorie] ?? [categorie];
  const lower = tekst.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

export function typeAfspraakMatcht(tekst: string, type: string): boolean {
  const terms = TYPE_AFSPRAAK_TERMS[type] ?? [type];
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

export function isNieuwProfiel(aangemaaktOp: string, dagen = 14): boolean {
  const created = new Date(aangemaaktOp).getTime();
  const cutoff = Date.now() - dagen * 24 * 60 * 60 * 1000;
  return created >= cutoff;
}

export { TYPE_AFSPRAAK_OPTIES };
