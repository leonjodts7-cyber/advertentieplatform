import type { SupabaseClient } from "@supabase/supabase-js";

export async function haalEersteFotos(
  supabase: SupabaseClient,
  advertentieIds: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  if (advertentieIds.length === 0) return map;

  const { data } = await supabase
    .from("advertentie_fotos")
    .select("advertentie_id, url, volgorde")
    .in("advertentie_id", advertentieIds)
    .order("volgorde", { ascending: true });

  for (const foto of data ?? []) {
    if (!map.has(foto.advertentie_id)) {
      map.set(foto.advertentie_id, foto.url);
    }
  }

  return map;
}
