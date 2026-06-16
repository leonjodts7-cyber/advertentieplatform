import type { SupabaseClient } from "@supabase/supabase-js";
import type { Advertentie } from "@/lib/types";

function isPremiumActief(ad: Advertentie): boolean {
  if (ad.premium !== true) return false;
  if (!ad.premium_tot) return true;
  return new Date(ad.premium_tot).getTime() > Date.now();
}

export async function fetchPremiumAdvertenties(
  supabase: SupabaseClient,
  limit = 8
): Promise<Advertentie[]> {
  const { data, error } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .eq("premium", true)
    .order("aangemaakt_op", { ascending: false })
    .limit(limit * 2);

  if (error) {
    const { data: fallback } = await supabase
      .from("advertenties")
      .select("*")
      .eq("status", "actief")
      .order("aangemaakt_op", { ascending: false })
      .limit(0);
    void fallback;
    return [];
  }

  return ((data ?? []) as Advertentie[])
    .filter(isPremiumActief)
    .slice(0, limit);
}

export async function fetchActieveAdvertenties(
  supabase: SupabaseClient,
  options: { stad?: string; limit?: number } = {}
) {
  const { stad, limit = 8 } = options;

  let query = supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false })
    .limit(limit);

  if (stad?.trim()) {
    query = query.ilike("stad", `%${stad.trim()}%`);
  }

  const { data } = await query;
  return (data ?? []) as Advertentie[];
}
