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

export async function fetchAdvertentiesByIds(
  supabase: SupabaseClient,
  ids: string[]
): Promise<Advertentie[]> {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("advertenties")
    .select("*")
    .in("id", ids)
    .eq("status", "actief");

  if (error || !data?.length) return [];

  const byId = new Map((data as Advertentie[]).map((ad) => [ad.id, ad]));
  return ids
    .map((id) => byId.get(id))
    .filter((ad): ad is Advertentie => ad != null);
}

async function haalFavorietTellingen(
  supabase: SupabaseClient,
  advertentieIds: string[]
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (advertentieIds.length === 0) return map;

  const { data } = await supabase
    .from("favorieten")
    .select("advertentie_id")
    .in("advertentie_id", advertentieIds);

  for (const row of data ?? []) {
    const id = row.advertentie_id as string;
    map.set(id, (map.get(id) ?? 0) + 1);
  }

  return map;
}

function sortPopulaire(
  ads: Advertentie[],
  favorietTellingen: Map<string, number>
): Advertentie[] {
  return [...ads].sort((a, b) => {
    const ap = isPremiumListing(a) ? 1 : 0;
    const bp = isPremiumListing(b) ? 1 : 0;
    if (ap !== bp) return bp - ap;

    const af = favorietTellingen.get(a.id) ?? 0;
    const bf = favorietTellingen.get(b.id) ?? 0;
    if (af !== bf) return bf - af;

    return (
      new Date(b.aangemaakt_op).getTime() - new Date(a.aangemaakt_op).getTime()
    );
  });
}

export async function fetchPopulaireAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const pool = await fetchActievePool(supabase, 120);
  const ids = pool.map((a) => a.id);
  const favorietTellingen = await haalFavorietTellingen(supabase, ids);
  return sortPopulaire(pool, favorietTellingen).slice(0, limit);
}

export async function fetchTrendingAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const pool = await fetchActievePool(supabase, 120);
  const recentPool = pool.filter((a) => a.aangemaakt_op >= since);
  const base = recentPool.length >= limit ? recentPool : pool;
  const ids = base.map((a) => a.id);
  const favorietTellingen = await haalFavorietTellingen(supabase, ids);
  return sortPopulaire(base, favorietTellingen).slice(0, limit);
}

export async function fetchNieuwVandaagAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const { data } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .gte("aangemaakt_op", start.toISOString())
    .order("aangemaakt_op", { ascending: false })
    .limit(limit);

  const today = (data ?? []) as Advertentie[];
  if (today.length >= limit) return today;

  const pool = await fetchActievePool(supabase, limit);
  const ids = new Set(today.map((a) => a.id));
  const fill = pool.filter((a) => !ids.has(a.id)).slice(0, limit - today.length);
  return [...today, ...fill];
}

export async function fetchMeestOpgeslagenAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  return fetchPopulaireAdvertenties(supabase, limit);
}

export async function fetchOnlineNuAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const { data } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .eq("beschikbaar", true)
    .order("aangemaakt_op", { ascending: false })
    .limit(limit);

  const online = sortPremiumFirst((data ?? []) as Advertentie[]);
  if (online.length >= limit) return online.slice(0, limit);

  const pool = await fetchActievePool(supabase, limit);
  const ids = new Set(online.map((a) => a.id));
  const fill = pool.filter((a) => !ids.has(a.id) && a.beschikbaar).slice(0, limit - online.length);
  return [...online, ...fill];
}

export async function fetchRecentBijgewerktAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const { data } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("bijgewerkt_op", { ascending: false })
    .limit(limit);

  return sortPremiumFirst((data ?? []) as Advertentie[]);
}

export async function fetchEditorsChoiceAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const [spotlight, premium] = await Promise.all([
    fetchSpotlightAdvertenties(supabase, Math.ceil(limit / 2)),
    fetchPremiumAdvertenties(supabase, Math.ceil(limit / 2)),
  ]);
  return dedupeById([...spotlight, ...premium]).slice(0, limit);
}

export async function fetchNieuweAanbiedersAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const pool = await fetchActievePool(supabase, 120);
  const recent = pool.filter((a) => a.aangemaakt_op >= since);
  const seenProviders = new Set<string>();
  const result: Advertentie[] = [];

  for (const ad of sortPremiumFirst(recent)) {
    if (seenProviders.has(ad.aanbieder_id)) continue;
    seenProviders.add(ad.aanbieder_id);
    result.push(ad);
    if (result.length >= limit) break;
  }

  if (result.length >= limit) return result;
  const ids = new Set(result.map((a) => a.id));
  for (const ad of sortPremiumFirst(pool)) {
    if (ids.has(ad.id) || seenProviders.has(ad.aanbieder_id)) continue;
    seenProviders.add(ad.aanbieder_id);
    result.push(ad);
    if (result.length >= limit) break;
  }
  return result;
}

export async function fetchSnelStijgendeAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const pool = await fetchActievePool(supabase, 120);
  const recent = pool.filter((a) => a.aangemaakt_op >= since);
  const base = recent.length >= limit ? recent : pool;
  const ids = base.map((a) => a.id);
  const favorietTellingen = await haalFavorietTellingen(supabase, ids);
  return sortPopulaire(base, favorietTellingen).slice(0, limit);
}

export async function fetchBestBeoordeeldAdvertenties(
  supabase: SupabaseClient,
  limit = 24
): Promise<Advertentie[]> {
  const { data: reviews } = await supabase
    .from("advertentie_reviews")
    .select("advertentie_id, rating");

  const ratings = new Map<string, { sum: number; count: number }>();
  for (const row of reviews ?? []) {
    const id = row.advertentie_id as string;
    const rating = row.rating as number;
    const cur = ratings.get(id) ?? { sum: 0, count: 0 };
    ratings.set(id, { sum: cur.sum + rating, count: cur.count + 1 });
  }

  const rankedIds = [...ratings.entries()]
    .filter(([, v]) => v.count >= 1)
    .sort((a, b) => {
      const avgA = a[1].sum / a[1].count;
      const avgB = b[1].sum / b[1].count;
      if (avgB !== avgA) return avgB - avgA;
      return b[1].count - a[1].count;
    })
    .map(([id]) => id);

  if (rankedIds.length > 0) {
    const ads = await fetchAdvertentiesByIds(supabase, rankedIds.slice(0, limit * 2));
    const byId = new Map(ads.map((a) => [a.id, a]));
    const ranked = rankedIds
      .map((id) => byId.get(id))
      .filter((a): a is Advertentie => a != null)
      .slice(0, limit);
    if (ranked.length >= limit) return ranked;
  }

  return fetchPopulaireAdvertenties(supabase, limit);
}

export async function fetchInStadAdvertenties(
  supabase: SupabaseClient,
  stad: string,
  limit = 24
): Promise<Advertentie[]> {
  if (!stad.trim()) return fetchPopulaireAdvertenties(supabase, limit);
  const ads = await fetchActieveAdvertenties(supabase, { stad: stad.trim(), limit: limit * 2 });
  const ids = ads.map((a) => a.id);
  const favorietTellingen = await haalFavorietTellingen(supabase, ids);
  return sortPopulaire(ads, favorietTellingen).slice(0, limit);
}

export async function fetchVergelijkbareAdvertenties(
  supabase: SupabaseClient,
  advertentie: Advertentie,
  limit = 12
): Promise<Advertentie[]> {
  const { data } = await supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .neq("id", advertentie.id)
    .ilike("stad", `%${advertentie.stad}%`)
    .order("aangemaakt_op", { ascending: false })
    .limit(limit * 2);

  const pool = sortPremiumFirst((data ?? []) as Advertentie[]);
  return pool.slice(0, limit);
}
