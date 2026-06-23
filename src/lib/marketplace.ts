export const HERO_STEDEN = [
  "Antwerpen",
  "Gent",
  "Brussel",
  "Leuven",
  "Brugge",
] as const;

export const BUURT_STEDEN = [
  "Antwerpen",
  "Gent",
  "Brussel",
  "Leuven",
  "Hasselt",
  "Brugge",
  "Kortrijk",
  "Mechelen",
  "Oostende",
  "Knokke",
] as const;

export const POPULAIRE_STEDEN = [
  "Antwerpen",
  "Gent",
  "Brussel",
  "Leuven",
  "Hasselt",
  "Brugge",
  "Kortrijk",
  "Mechelen",
  "Oostende",
  "Aalst",
  "Sint-Niklaas",
  "Charleroi",
] as const;

export const RECENTE_STEDEN = POPULAIRE_STEDEN;
export const MARKETPLACE_STEDEN = POPULAIRE_STEDEN;

export const MARKETPLACE_TYPES = [
  { slug: "prive-ontvangst", label: "Privé ontvangst" },
  { slug: "escort", label: "Escort" },
  { slug: "video", label: "Video" },
  { slug: "massage", label: "Massage" },
] as const;

export const MARKETPLACE_CATEGORIEEN = [
  { slug: "prive-ontvangst", label: "Privé ontvangst" },
  { slug: "escort", label: "Escort" },
  { slug: "massage", label: "Massage" },
  { slug: "video", label: "Video" },
  { slug: "koppels", label: "Koppels" },
  { slug: "trans", label: "Trans" },
  { slug: "mannen", label: "Mannen" },
  { slug: "vrouwen", label: "Vrouwen" },
] as const;

export const HOMEPAGE_CATEGORIEEN = [
  { slug: "privehuizen", label: "Privéhuizen", subtitle: "Discrete locaties" },
  { slug: "prive-ontvangst", label: "Privé ontvangst", subtitle: "Ontvangst thuis" },
  { slug: "escort", label: "Escort", subtitle: "In jouw regio" },
  { slug: "massagesalons", label: "Massagesalons", subtitle: "Wellness & massage" },
  { slug: "bars-clubs", label: "Bars & privéclubs", subtitle: "Uitgaan & ontmoeten" },
  { slug: "rendez-vous-hotels", label: "Rendez-vous hotels", subtitle: "Discreet afspreken" },
  { slug: "prive-saunas", label: "Privé sauna's", subtitle: "Sauna & wellness" },
  { slug: "parenclubs", label: "Parenclubs", subtitle: "Voor koppels" },
  { slug: "massage", label: "Massage", subtitle: "Ontspanning" },
  { slug: "video", label: "Video", subtitle: "Virtueel contact" },
  { slug: "koppels", label: "Koppels", subtitle: "Samen ontdekken" },
  { slug: "trans", label: "Trans", subtitle: "Trans profielen" },
  { slug: "mannen", label: "Mannen", subtitle: "Mannelijk" },
  { slug: "vrouwen", label: "Vrouwen", subtitle: "Vrouwelijk" },
] as const;

export const TYPE_AFSPRAAK_OPTIES = [
  { value: "", label: "Alle types" },
  { value: "prive-ontvangst", label: "Privé ontvangst" },
  { value: "escort", label: "Escort" },
  { value: "massage", label: "Massage" },
  { value: "video", label: "Video" },
  { value: "hotel", label: "Hotel" },
  { value: "club", label: "Club" },
  { value: "thuis-ontvangen", label: "Thuis ontvangen" },
  { value: "verplaatsing", label: "Verplaatsing mogelijk" },
] as const;

export const AFSTAND_OPTIES = [
  { value: "", label: "Alle afstanden" },
  { value: "5", label: "Binnen 5 km" },
  { value: "10", label: "Binnen 10 km" },
  { value: "25", label: "Binnen 25 km" },
  { value: "50", label: "Binnen 50 km" },
  { value: "100", label: "Binnen 100 km" },
] as const;

export type MarketplaceCategorieSlug =
  (typeof MARKETPLACE_CATEGORIEEN)[number]["slug"];
