import type { createTranslator } from "@/lib/i18n";

type T = ReturnType<typeof createTranslator>;

const CATEGORY_KEYS: Record<string, string> = {
  "prive-ontvangst": "filters.categories.priveOntvangst",
  escort: "filters.categories.escort",
  massage: "filters.categories.massage",
  video: "filters.categories.video",
  koppels: "filters.categories.koppels",
  trans: "filters.categories.trans",
  mannen: "filters.categories.mannen",
  vrouwen: "filters.categories.vrouwen",
};

export function categoryLabelI18n(t: T, slug: string | null | undefined, fallback?: string): string {
  if (!slug) return fallback ?? "";
  const key = CATEGORY_KEYS[slug];
  return key ? t(key) : (fallback ?? slug);
}

export function haarkleurLabelI18n(t: T, value: string): string {
  const map: Record<string, string> = {
    "": "filters.options.all",
    blond: "filters.hair.blond",
    bruin: "filters.hair.bruin",
    zwart: "filters.hair.zwart",
    rood: "filters.hair.rood",
    grijs: "filters.hair.grijs",
    other: "filters.hair.other",
  };
  return t(map[value] ?? "filters.options.all");
}

export function oogkleurLabelI18n(t: T, value: string): string {
  const map: Record<string, string> = {
    "": "filters.options.all",
    blauw: "filters.eyes.blue",
    bruin: "filters.eyes.brown",
    groen: "filters.eyes.green",
    grijs: "filters.eyes.gray",
    other: "filters.eyes.other",
  };
  return t(map[value] ?? "filters.options.all");
}

export function taalLabelI18n(t: T, value: string): string {
  const map: Record<string, string> = {
    "": "filters.options.all",
    nl: "filters.languages.nl",
    fr: "filters.languages.fr",
    en: "filters.languages.en",
    de: "filters.languages.de",
  };
  return t(map[value] ?? "filters.options.all");
}

export function afstandLabelI18n(t: T, value: string): string {
  const map: Record<string, string> = {
    "": "filters.options.all",
    "5": "filters.distance.5",
    "10": "filters.distance.10",
    "25": "filters.distance.25",
    "50": "filters.distance.50",
  };
  return t(map[value] ?? "filters.options.all");
}
