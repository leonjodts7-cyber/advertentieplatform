import { POPULAIRE_STEDEN } from "@/lib/marketplace";

export type CarouselPlaceholderVariant = "spotlight" | "premium" | "nearby" | "latest";

export interface CarouselPlaceholderItem {
  id: string;
  badge: string;
  title: string;
  stad: string;
  leeftijd: number;
  prijs: number;
  categorie: string;
  photoLabel: string;
}

const CATEGORIEEN = ["Escort", "Massage", "Privé ontvangst", "Video", "Escort", "Massage"];
const VOORNAMEN = [
  "Sophie",
  "Luna",
  "Elena",
  "Mila",
  "Noa",
  "Amber",
  "Lisa",
  "Nina",
  "Eva",
  "Zara",
  "Iris",
  "Fleur",
  "Emma",
  "Julia",
  "Sara",
  "Lena",
  "Maya",
  "Olivia",
  "Clara",
  "Vera",
];

function maakPlaceholders(
  prefix: string,
  badge: string,
  count: number,
  titelSuffix: string
): CarouselPlaceholderItem[] {
  return Array.from({ length: count }, (_, i) => {
    const stad = POPULAIRE_STEDEN[i % POPULAIRE_STEDEN.length];
    const naam = VOORNAMEN[i % VOORNAMEN.length];
    return {
      id: `placeholder-${prefix}-${i}`,
      badge,
      title: `${naam} — ${titelSuffix}`,
      stad,
      leeftijd: 22 + (i % 12),
      prijs: 120 + (i % 8) * 25,
      categorie: CATEGORIEEN[i % CATEGORIEEN.length],
      photoLabel: badge,
    };
  });
}

export const SPOTLIGHT_PLACEHOLDERS = maakPlaceholders(
  "spotlight",
  "SPOTLIGHT",
  6,
  "Spotlight profiel"
);

export const PREMIUM_PLACEHOLDERS = maakPlaceholders(
  "premium",
  "PREMIUM",
  8,
  "Premium profiel"
);

export const NEARBY_PLACEHOLDERS = maakPlaceholders(
  "nearby",
  "BUURT",
  8,
  "Profiel in de buurt"
);

export const LATEST_PLACEHOLDERS = maakPlaceholders(
  "latest",
  "NIEUW",
  8,
  "Nieuw profiel"
);

export function getCarouselPlaceholders(
  variant: CarouselPlaceholderVariant
): CarouselPlaceholderItem[] {
  switch (variant) {
    case "spotlight":
      return SPOTLIGHT_PLACEHOLDERS;
    case "premium":
      return PREMIUM_PLACEHOLDERS;
    case "nearby":
      return NEARBY_PLACEHOLDERS;
    case "latest":
      return LATEST_PLACEHOLDERS;
  }
}
