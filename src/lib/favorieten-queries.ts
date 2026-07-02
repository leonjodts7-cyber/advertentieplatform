import type { SupabaseClient } from "@supabase/supabase-js";
import type { Advertentie, Favoriet } from "@/lib/types";

export async function haalFavorietIds(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("favorieten")
    .select("advertentie_id")
    .eq("user_id", userId);

  if (error) {
    console.error("haalFavorietIds:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.advertentie_id as string);
}

export async function isAdvertentieFavoriet(
  supabase: SupabaseClient,
  userId: string,
  advertentieId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("favorieten")
    .select("id")
    .eq("user_id", userId)
    .eq("advertentie_id", advertentieId)
    .maybeSingle();

  if (error) {
    console.error("isAdvertentieFavoriet:", error.message);
    return false;
  }

  return Boolean(data);
}

export async function haalFavorietAdvertenties(
  supabase: SupabaseClient,
  userId: string
): Promise<Advertentie[]> {
  const { data: favorietRows, error } = await supabase
    .from("favorieten")
    .select("advertentie_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("haalFavorietAdvertenties:", error.message);
    return [];
  }

  const orderedIds = (favorietRows ?? []).map(
    (row) => row.advertentie_id as string
  );
  if (orderedIds.length === 0) return [];

  const { data: advertentiesRaw, error: adsError } = await supabase
    .from("advertenties")
    .select("*")
    .in("id", orderedIds)
    .eq("status", "actief");

  if (adsError) {
    console.error("haalFavorietAdvertenties ads:", adsError.message);
    return [];
  }

  const byId = new Map(
    ((advertentiesRaw ?? []) as Advertentie[]).map((ad) => [ad.id, ad])
  );

  return orderedIds
    .map((id) => byId.get(id))
    .filter((ad): ad is Advertentie => ad != null);
}

export type FavorietRow = Favoriet;
