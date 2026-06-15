import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import { categorieMatcht } from "@/lib/zoek-filters";

interface AdvertentieTekst {
  titel: string;
  beschrijving: string;
}

export function telCategorieen(advertenties: AdvertentieTekst[]) {
  return Object.fromEntries(
    MARKETPLACE_CATEGORIEEN.map((cat) => [
      cat.slug,
      advertenties.filter((ad) =>
        categorieMatcht(`${ad.titel} ${ad.beschrijving}`, cat.slug)
      ).length,
    ])
  ) as Record<string, number>;
}
