import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ListingPhotoMaps {
  urls: Map<string, string>;
  counts: Map<string, number>;
}

async function loadPhotosForIds(ids: string[]): Promise<ListingPhotoMaps> {
  const urls = new Map<string, string>();
  const counts = new Map<string, number>();
  if (ids.length === 0) return { urls, counts };

  const supabase = await createClient();
  const { data } = await supabase
    .from("advertentie_fotos")
    .select("advertentie_id, url, volgorde")
    .in("advertentie_id", ids)
    .order("volgorde", { ascending: true });

  for (const foto of data ?? []) {
    const id = foto.advertentie_id as string;
    counts.set(id, (counts.get(id) ?? 0) + 1);
    if (!urls.has(id)) {
      urls.set(id, foto.url as string);
    }
  }

  return { urls, counts };
}

export async function getCachedListingPhotos(
  ids: string[]
): Promise<ListingPhotoMaps> {
  const key = ids.slice().sort().join(",");
  if (!key) return { urls: new Map(), counts: new Map() };

  const cached = unstable_cache(
    () => loadPhotosForIds(ids),
    [`veloura-listing-photos-${key}`],
    { revalidate: 120, tags: ["listing-photos"] }
  );

  return cached();
}
