import type { Advertentie } from "@/lib/types";
import type { AdvertentieMetadata } from "@/lib/advertentie-metadata";
import { parseAdvertentieBeschrijving } from "@/lib/advertentie-metadata";

export const BOOST_PRIJZEN = {
  stad: { 1: 2.99, 3: 6.99, 7: 12.99, 14: 19.99, 30: 34.99 },
  categorie: { 1: 4.99, 7: 19.99, 30: 49.99 },
  homepage: { 1: 9.99, 7: 49.99, 30: 149.99 },
} as const;

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
