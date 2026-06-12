export type ProfilePhotoVariant =
  | "warm-wine"
  | "champagne-rose"
  | "burgundy"
  | "ivory-champagne"
  | "velvet-purple"
  | "deep-gold";

export interface HomePreviewProfiel {
  id: string;
  naam: string;
  leeftijd: number;
  stad: string;
  type: string;
  photoVariant: ProfilePhotoVariant;
  badges: { label: string; variant: "online" | "verified" | "premium" | "new" | "popular" }[];
}

export const HOME_PREVIEW_PROFIELEN: HomePreviewProfiel[] = [
  {
    id: "valentina",
    naam: "Valentina",
    leeftijd: 21,
    stad: "Antwerpen",
    type: "Jong & spontaan",
    photoVariant: "warm-wine",
    badges: [
      { label: "Online", variant: "online" },
      { label: "Geverifieerd", variant: "verified" },
    ],
  },
  {
    id: "mila",
    naam: "Mila",
    leeftijd: 24,
    stad: "Gent",
    type: "Lief & romantisch",
    photoVariant: "champagne-rose",
    badges: [
      { label: "Online", variant: "online" },
      { label: "Nieuw", variant: "new" },
    ],
  },
  {
    id: "scarlett",
    naam: "Scarlett",
    leeftijd: 28,
    stad: "Brussel",
    type: "Zelfverzekerd",
    photoVariant: "burgundy",
    badges: [
      { label: "Online", variant: "online" },
      { label: "Premium", variant: "premium" },
    ],
  },
  {
    id: "sophia",
    naam: "Sophia",
    leeftijd: 32,
    stad: "Antwerpen",
    type: "Elegant & discreet",
    photoVariant: "ivory-champagne",
    badges: [
      { label: "Online", variant: "online" },
      { label: "Premium", variant: "premium" },
    ],
  },
  {
    id: "victoria",
    naam: "Victoria",
    leeftijd: 38,
    stad: "Leuven",
    type: "Direct & stijlvol",
    photoVariant: "velvet-purple",
    badges: [
      { label: "Online", variant: "online" },
      { label: "Premium", variant: "premium" },
    ],
  },
  {
    id: "isabella",
    naam: "Isabella",
    leeftijd: 50,
    stad: "Brugge",
    type: "Ervaren & verfijnd",
    photoVariant: "deep-gold",
    badges: [
      { label: "Online", variant: "online" },
      { label: "Geverifieerd", variant: "verified" },
    ],
  },
];

export const POPULAIRE_STEDEN = [
  "Antwerpen",
  "Gent",
  "Brussel",
  "Leuven",
  "Hasselt",
  "Brugge",
  "Oostende",
  "Mechelen",
] as const;
