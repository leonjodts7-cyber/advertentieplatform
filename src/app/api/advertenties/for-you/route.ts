import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { LISTING_CARD_COLUMNS } from "@/lib/listing-columns";
import { getCachedListingPhotos } from "@/lib/cache/listing-photos";
import { parseAdvertentieBeschrijving } from "@/lib/advertentie-metadata";
import { categorieMatcht } from "@/lib/zoek-filters";
import type { Advertentie } from "@/lib/types";

const getActivePool = unstable_cache(
  async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("advertenties")
      .select(LISTING_CARD_COLUMNS)
      .eq("status", "actief")
      .order("aangemaakt_op", { ascending: false })
      .limit(120);
    return (data ?? []) as Advertentie[];
  },
  ["veloura-for-you-pool"],
  { revalidate: 60, tags: ["homepage"] }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("stad")?.trim();
  const category = searchParams.get("categorie")?.trim();
  const limit = Math.min(Number(searchParams.get("limit") ?? 12), 24);

  if (!city && !category) {
    return NextResponse.json({ items: [], fotos: {} });
  }

  const pool = await getActivePool();
  const items = pool
    .filter((ad) => {
      if (city && !ad.stad?.toLowerCase().includes(city.toLowerCase())) {
        return false;
      }
      if (category) {
        const { tekst, meta } = parseAdvertentieBeschrijving(ad.beschrijving);
        const fullTekst = `${ad.titel} ${tekst}`;
        if (
          meta.categorie !== category &&
          !categorieMatcht(fullTekst, category)
        ) {
          return false;
        }
      }
      return true;
    })
    .slice(0, limit);

  const ids = items.map((a) => a.id);
  const { urls } = await getCachedListingPhotos(ids);
  const fotos = Object.fromEntries(urls);

  return NextResponse.json({ items, fotos });
}
