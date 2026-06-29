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

function sortPremiumFirst(ads: Advertentie[]): Advertentie[] {
  return [...ads].sort((a, b) => {
    const ap = isPremiumListing(a) ? 1 : 0;
    const bp = isPremiumListing(b) ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return (
      new Date(b.aangemaakt_op).getTime() - new Date(a.aangemaakt_op).getTime()
    );
  });
}

function dedupeById(ads: Advertentie[]): Advertentie[] {
  const seen = new Set<string>();
  return ads.filter((ad) => {
    if (seen.has(ad.id)) return false;
    seen.add(ad.id);
    return true;
  });
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
  return sortPremiumFirst(ads.filter(isPremiumListing)).slice(0, limit);
}

async function fetchActievePool(
  supabase: SupabaseClient,
  poolLimit = 120
): Promise<Advertentie[]> {
  const { data } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false })
    .limit(poolLimit);

  return (data ?? []) as Advertentie[];
}

function fillToLimit(
  primary: Advertentie[],
  pool: Advertentie[],
  limit: number
): Advertentie[] {
  if (primary.length >= limit) return primary.slice(0, limit);
  const ids = new Set(primary.map((a) => a.id));
  const rest = pool.filter((a) => !ids.has(a.id));
  return dedupeById([...primary, ...rest]).slice(0, limit);
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

  const pool = await fetchActievePool(supabase);

  if (!error && data?.length) {
    return fillToLimit(data as Advertentie[], pool, limit);
  }

  const spotlight = filterSpotlight(pool, limit);
  if (spotlight.length) return spotlight;

  return sortPremiumFirst(pool).slice(0, limit);
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

  const pool = await fetchActievePool(supabase);

  if (!error && data?.length) {
    const filtered = filterPremium(data as Advertentie[], limit);
    if (filtered.length) {
      return fillToLimit(filtered, pool, limit);
    }
  }

  const fromPool = filterPremium(pool, limit);
  if (fromPool.length) return fillToLimit(fromPool, pool, limit);

  return sortPremiumFirst(pool).slice(0, limit);
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
