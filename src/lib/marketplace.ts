export const MARKETPLACE_STEDEN = [
  "Antwerpen",
  "Gent",
  "Brussel",
  "Leuven",
  "Hasselt",
  "Brugge",
] as const;

export const MARKETPLACE_TYPES = [
  { slug: "prive-ontvangst", label: "Privé ontvangst" },
  { slug: "escort", label: "Escort" },
  { slug: "video", label: "Video" },
  { slug: "massage", label: "Massage" },
] as const;

export const MARKETPLACE_CATEGORIEEN = [
  { slug: "prive-ontvangst", label: "Privé ontvangst" },
  { slug: "escort", label: "Escort" },
  { slug: "video", label: "Video" },
  { slug: "massage", label: "Massage" },
  { slug: "koppels", label: "Koppels" },
  { slug: "trans", label: "Trans" },
  { slug: "mannen", label: "Mannen" },
  { slug: "vrouwen", label: "Vrouwen" },
] as const;

export type MarketplaceCategorieSlug =
  (typeof MARKETPLACE_CATEGORIEEN)[number]["slug"];
