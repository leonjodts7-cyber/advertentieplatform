export const HERO_STEDEN = [
  "Antwerpen",
  "Gent",
  "Brussel",
  "Leuven",
  "Brugge",
] as const;

export const RECENTE_STEDEN = [
  "Antwerpen",
  "Gent",
  "Brussel",
  "Leuven",
  "Brugge",
  "Hasselt",
  "Kortrijk",
  "Mechelen",
] as const;

export const MARKETPLACE_STEDEN = RECENTE_STEDEN;

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
