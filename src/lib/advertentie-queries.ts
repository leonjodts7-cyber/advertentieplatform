import type { SupabaseClient } from "@supabase/supabase-js";
import type { Advertentie } from "@/lib/types";
import {
  isPlaatsingActief,
  isPremiumListing,
  plaatsingType,
  plaatsingEindigtOp,
} from "@/lib/advertentie-boost";

function nowIso() {
  return new Date().toISOString();
}

function filterSpotlight(ads: Advertentie[], limit: number): Advertentie[] {
  return ads
    .filter((ad) => {
      const type = plaatsingType(ad);
      return type === "homepage" && isPlaatsingActief(ad);
    })
    .sort((a, b) => {
      const ea = plaatsingEindigtOp(a) ?? "";
      const eb = plaatsingEindigtOp(b) ?? "";
      return eb.localeCompare(ea);
    })
    .slice(0, limit);
}

function filterPremium(ads: Advertentie[], limit: number): Advertentie[] {
  return ads
    .filter(isPremiumListing)
    .sort(
      (a, b) =>
        new Date(b.aangemaakt_op).getTime() - new Date(a.aangemaakt_op).getTime()
    )
    .slice(0, limit);
}

export async function fetchSpotlightAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const { data, error } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .eq("plaatsing_type", "homepage")
    .gt("plaatsing_eindigt_op", nowIso())
    .order("plaatsing_eindigt_op", { ascending: false })
    .limit(limit);

  if (!error && data?.length) {
    return data as Advertentie[];
  }

  const { data: fallback } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false })
    .limit(80);

  return filterSpotlight((fallback ?? []) as Advertentie[], limit);
}

export async function fetchPremiumAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const { data, error } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .or("premium.eq.true,plaatsing_type.in.(stad,categorie)")
    .order("aangemaakt_op", { ascending: false })
    .limit(limit * 3);

  if (!error && data?.length) {
    const filtered = filterPremium(data as Advertentie[], limit);
    if (filtered.length) return filtered;
  }

  const { data: fallback } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false })
    .limit(80);

  return filterPremium((fallback ?? []) as Advertentie[], limit);
}

export async function fetchActieveAdvertenties(
  supabase: SupabaseClient,
  options: { stad?: string; limit?: number } = {}
) {
  const { stad, limit = 24 } = options;

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
