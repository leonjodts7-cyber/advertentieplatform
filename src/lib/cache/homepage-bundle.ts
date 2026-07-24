import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { LISTING_CARD_COLUMNS, type ListingCardRow } from "@/lib/listing-columns";
import type { Advertentie } from "@/lib/types";
import {
  isPlaatsingActief,
  isPremiumListing,
  plaatsingType,
  plaatsingEindigtOp,
} from "@/lib/advertentie-boost";

const POOL_LIMIT = 120;
const SECTION_LIMIT = 24;

function sortPremiumFirst(ads: Advertentie[]): Advertentie[] {
  return [...ads].sort((a, b) => {
    const ap = isPremiumListing(a) ? 1 : 0;
    const bp = isPremiumListing(b) ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return new Date(b.aangemaakt_op).getTime() - new Date(a.aangemaakt_op).getTime();
  });
}

function pickUnique(
  ads: Advertentie[],
  used: Set<string>,
  limit: number
): Advertentie[] {
  const result: Advertentie[] = [];
  for (const ad of ads) {
    if (used.has(ad.id)) continue;
    result.push(ad);
    used.add(ad.id);
    if (result.length >= limit) break;
  }
  return result;
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
    return new Date(b.aangemaakt_op).getTime() - new Date(a.aangemaakt_op).getTime();
  });
}

async function loadHomepageBundle(): Promise<{
  sections: Record<string, Advertentie[]>;
  allIds: string[];
}> {
  const supabase = await createClient();

  const [{ data: poolRaw }, { data: favorietRows }, { data: reviewRows }] =
    await Promise.all([
      supabase
        .from("advertenties")
        .select(LISTING_CARD_COLUMNS)
        .eq("status", "actief")
        .order("aangemaakt_op", { ascending: false })
        .limit(POOL_LIMIT),
      supabase.from("favorieten").select("advertentie_id"),
      supabase.from("advertentie_reviews").select("advertentie_id, rating"),
    ]);

  const pool = (poolRaw ?? []) as Advertentie[];
  const favorietTellingen = new Map<string, number>();
  for (const row of favorietRows ?? []) {
    const id = row.advertentie_id as string;
    favorietTellingen.set(id, (favorietTellingen.get(id) ?? 0) + 1);
  }

  const ratings = new Map<string, { sum: number; count: number }>();
  for (const row of reviewRows ?? []) {
    const id = row.advertentie_id as string;
    const rating = row.rating as number;
    const cur = ratings.get(id) ?? { sum: 0, count: 0 };
    ratings.set(id, { sum: cur.sum + rating, count: cur.count + 1 });
  }

  const used = new Set<string>();
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const since3d = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const spotlightCandidates = sortPremiumFirst(
    pool.filter((a) => {
      const type = plaatsingType(a);
      return type === "homepage" && isPlaatsingActief(a);
    })
  );

  const premiumCandidates = sortPremiumFirst(pool.filter(isPremiumListing));
  const trendingBase = pool.filter((a) => a.aangemaakt_op >= since7d);
  const trendingCandidates = sortPopulaire(
    trendingBase.length >= SECTION_LIMIT ? trendingBase : pool,
    favorietTellingen
  );
  const onlineCandidates = sortPremiumFirst(pool.filter((a) => a.beschikbaar));
  const todayCandidates = sortPremiumFirst(
    pool.filter((a) => a.aangemaakt_op >= todayStart.toISOString())
  );
  const risingCandidates = sortPopulaire(
    pool.filter((a) => a.aangemaakt_op >= since3d).length >= SECTION_LIMIT
      ? pool.filter((a) => a.aangemaakt_op >= since3d)
      : pool,
    favorietTellingen
  );
  const updatedCandidates = sortPremiumFirst(
    [...pool].sort(
      (a, b) =>
        new Date(b.bijgewerkt_op).getTime() - new Date(a.bijgewerkt_op).getTime()
    )
  );

  const rankedReviewIds = [...ratings.entries()]
    .sort((a, b) => {
      const avgA = a[1].sum / a[1].count;
      const avgB = b[1].sum / b[1].count;
      if (avgB !== avgA) return avgB - avgA;
      return b[1].count - a[1].count;
    })
    .map(([id]) => id);
  const bestRatedCandidates =
    rankedReviewIds.length > 0
      ? rankedReviewIds
          .map((id) => pool.find((a) => a.id === id))
          .filter((a): a is Advertentie => a != null)
      : sortPopulaire(pool, favorietTellingen);

  const newProviderCandidates: Advertentie[] = [];
  const seenProviders = new Set<string>();
  for (const ad of sortPremiumFirst(pool.filter((a) => a.aangemaakt_op >= since30d))) {
    if (seenProviders.has(ad.aanbieder_id)) continue;
    seenProviders.add(ad.aanbieder_id);
    newProviderCandidates.push(ad);
  }

  const sections: Record<string, Advertentie[]> = {
    spotlight: pickUnique(
      spotlightCandidates.length ? spotlightCandidates : sortPremiumFirst(pool),
      used,
      SECTION_LIMIT
    ),
    editorsChoice: pickUnique(
      [...spotlightCandidates, ...premiumCandidates],
      used,
      SECTION_LIMIT
    ),
    onlineNu: pickUnique(onlineCandidates, used, SECTION_LIMIT),
    nearby: pickUnique(trendingCandidates, used, SECTION_LIMIT),
    trending: pickUnique(trendingCandidates, used, SECTION_LIMIT),
    snelStijgende: pickUnique(risingCandidates, used, SECTION_LIMIT),
    nieuwVandaag: pickUnique(
      todayCandidates.length ? todayCandidates : sortPremiumFirst(pool),
      used,
      SECTION_LIMIT
    ),
    nieuweAanbieders: pickUnique(newProviderCandidates, used, SECTION_LIMIT),
    meestOpgeslagen: pickUnique(sortPopulaire(pool, favorietTellingen), used, SECTION_LIMIT),
    bestBeoordeeld: pickUnique(bestRatedCandidates, used, SECTION_LIMIT),
    premium: pickUnique(premiumCandidates, used, SECTION_LIMIT),
    recentBijgewerkt: pickUnique(updatedCandidates, used, SECTION_LIMIT),
  };

  const allIds = [...used];
  return { sections, allIds };
}

export const getHomepageBundle = unstable_cache(
  loadHomepageBundle,
  ["veloura-homepage-bundle"],
  { revalidate: 60, tags: ["homepage"] }
);

export type HomepageSectionKey = keyof Awaited<
  ReturnType<typeof loadHomepageBundle>
>["sections"];

export async function getHomepageSection(
  key: HomepageSectionKey
): Promise<Advertentie[]> {
  const { sections } = await getHomepageBundle();
  return sections[key] ?? [];
}
