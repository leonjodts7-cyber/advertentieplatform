import type { Advertentie } from "@/lib/types";
import type { AdvertentieMetadata } from "@/lib/advertentie-metadata";
import { parseAdvertentieBeschrijving } from "@/lib/advertentie-metadata";

export const BOOST_PRIJZEN = {
  stad: { 1: 2.99, 3: 6.99, 7: 12.99, 14: 19.99, 30: 34.99 },
  categorie: { 1: 4.99, 7: 19.99, 30: 49.99 },
  homepage: { 1: 9.99, 7: 49.99, 30: 149.99 },
} as const;

export const PREMIUM_MAAND_PRIJS = 19.99;

export type BoostPrijsType = keyof typeof BOOST_PRIJZEN;

export function formatEuro(amount: number): string {
  return `€${amount.toFixed(2).replace(".", ",")}`;
}

export function boostPrijs(type: BoostPrijsType, dagen: number): number {
  const tabel = BOOST_PRIJZEN[type];
  return tabel[dagen as keyof typeof tabel] ?? 0;
}

export function boostPrijsLabel(type: BoostPrijsType, dagen: number): string {
  const prijs = boostPrijs(type, dagen);
  return prijs > 0 ? formatEuro(prijs) : "—";
}

export function boostSamenvatting(
  type: BoostPrijsType | "none",
  dagen: number
): string | null {
  if (type === "none") return null;
  const labels: Record<BoostPrijsType, string> = {
    stad: "Stad Boost",
    categorie: "Categorie Boost",
    homepage: "Homepage Spotlight",
  };
  return `${labels[type]} — ${dagen} dag${dagen > 1 ? "en" : ""} — ${boostPrijsLabel(type, dagen)}`;
}

export const BOOST_DUUR_OPTIES: Record<BoostPrijsType | "none", number[]> = {
  none: [],
  stad: [1, 3, 7, 14, 30],
  categorie: [1, 7, 30],
  homepage: [1, 7, 30],
};

export const BOOST_BESCHRIJVINGEN: Record<BoostPrijsType, string> = {
  stad: "Sta bovenaan in een gekozen stad.",
  categorie: "Sta bovenaan binnen jouw categorie.",
  homepage: "Word zichtbaar bovenaan de homepage.",
};

export const BOOST_ZICHTBAARHEID: Record<BoostPrijsType, string> = {
  stad: "Bovenaan zoekresultaten in jouw stad",
  categorie: "Bovenaan binnen jouw categorie",
  homepage: "Spotlight bovenaan de homepage",
};

export function boostActief(meta: AdvertentieMetadata): boolean {
  if (!meta.boostType || meta.boostType === "none") return false;
  if (!meta.boostEindigtOp) return true;
  return new Date(meta.boostEindigtOp).getTime() > Date.now();
}

export function berekenBoostEinde(dagen: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dagen);
  return d.toISOString();
}

export function advertentieBoostScore(advertentie: Advertentie): number {
  const { meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  if (!boostActief(meta)) return advertentie.premium ? 1 : 0;
  switch (meta.boostType) {
    case "homepage":
      return 100;
    case "categorie":
      return 50;
    case "stad":
      return 30;
    default:
      return advertentie.premium ? 10 : 0;
  }
}

export function sorteerAdvertenties(advertenties: Advertentie[]): Advertentie[] {
  return [...advertenties].sort((a, b) => {
    const scoreDiff = advertentieBoostScore(b) - advertentieBoostScore(a);
    if (scoreDiff !== 0) return scoreDiff;
    const premiumDiff = Number(b.premium === true) - Number(a.premium === true);
    if (premiumDiff !== 0) return premiumDiff;
    return (
      new Date(b.aangemaakt_op).getTime() - new Date(a.aangemaakt_op).getTime()
    );
  });
}

export function boostLabel(meta: AdvertentieMetadata): string | null {
  if (!boostActief(meta) || !meta.boostType || meta.boostType === "none") {
    return null;
  }
  const types: Record<string, string> = {
    stad: "Stad Boost",
    categorie: "Categorie Boost",
    homepage: "Homepage Spotlight",
  };
  return types[meta.boostType] ?? "Boost actief";
}
