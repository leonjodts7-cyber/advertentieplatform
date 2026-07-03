import { isPremiumListing, sorteerAdvertenties } from "@/lib/advertentie-boost";
import type { Advertentie } from "@/lib/types";

export type ZoekSortOption =
  | "aanbevolen"
  | "nieuwste"
  | "premium"
  | "prijs_laag"
  | "prijs_hoog";

export const ZOEK_SORT_OPTIES: { value: ZoekSortOption; label: string }[] = [
  { value: "aanbevolen", label: "Aanbevolen" },
  { value: "nieuwste", label: "Nieuwste" },
  { value: "premium", label: "Premium eerst" },
  { value: "prijs_laag", label: "Prijs laag-hoog" },
  { value: "prijs_hoog", label: "Prijs hoog-laag" },
];

export function parseZoekSort(value?: string | null): ZoekSortOption {
  if (
    value === "nieuwste" ||
    value === "premium" ||
    value === "prijs_laag" ||
    value === "prijs_hoog"
  ) {
    return value;
  }
  return "aanbevolen";
}

export function sortAdvertentiesByOption(
  advertenties: Advertentie[],
  sort: ZoekSortOption
): Advertentie[] {
  const items = [...advertenties];

  switch (sort) {
    case "nieuwste":
      return items.sort(
        (a, b) =>
          new Date(b.aangemaakt_op).getTime() -
          new Date(a.aangemaakt_op).getTime()
      );
    case "premium":
      return items.sort((a, b) => {
        const pDiff =
          Number(isPremiumListing(b)) - Number(isPremiumListing(a));
        if (pDiff !== 0) return pDiff;
        return (
          new Date(b.aangemaakt_op).getTime() -
          new Date(a.aangemaakt_op).getTime()
        );
      });
    case "prijs_laag":
      return items.sort(
        (a, b) => (a.prijs_vanaf ?? 999_999) - (b.prijs_vanaf ?? 999_999)
      );
    case "prijs_hoog":
      return items.sort(
        (a, b) => (b.prijs_vanaf ?? 0) - (a.prijs_vanaf ?? 0)
      );
    case "aanbevolen":
    default:
      return sorteerAdvertenties(items);
  }
}
