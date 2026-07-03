import {
  fetchMeestOpgeslagenAdvertenties,
  fetchNieuwVandaagAdvertenties,
  fetchPremiumAdvertenties,
  fetchSpotlightAdvertenties,
  fetchTrendingAdvertenties,
} from "@/lib/advertentie-queries";
import { haalEersteFotos, haalFotoAantallen } from "@/lib/advertentie-fotos";
import { isPremiumListing } from "@/lib/advertentie-boost";
import { HomeMarketplaceContent } from "@/components/home/home-marketplace-content";
import { createClient } from "@/lib/supabase/server";
import type { Advertentie } from "@/lib/types";

const LISTING_LIMIT = 24;

function sortPremiumFirst(advertenties: Advertentie[]): Advertentie[] {
  return [...advertenties].sort((a, b) => {
    const ap = isPremiumListing(a) ? 1 : 0;
    const bp = isPremiumListing(b) ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return (
      new Date(b.aangemaakt_op).getTime() - new Date(a.aangemaakt_op).getTime()
    );
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

export default async function HomePage() {
  const supabase = await createClient();
  const used = new Set<string>();

  const [spotlightRaw, premiumRaw, nearbyRaw, trendingRaw, nieuwRaw, savedRaw] =
    await Promise.all([
      fetchSpotlightAdvertenties(supabase, LISTING_LIMIT),
      fetchPremiumAdvertenties(supabase, LISTING_LIMIT),
      fetchTrendingAdvertenties(supabase, LISTING_LIMIT * 2),
      fetchTrendingAdvertenties(supabase, LISTING_LIMIT),
      fetchNieuwVandaagAdvertenties(supabase, LISTING_LIMIT),
      fetchMeestOpgeslagenAdvertenties(supabase, LISTING_LIMIT),
    ]);

  const spotlight = pickUnique(spotlightRaw, used, LISTING_LIMIT);
  const premium = pickUnique(premiumRaw, used, LISTING_LIMIT);
  const nearby = pickUnique(sortPremiumFirst(nearbyRaw), used, LISTING_LIMIT);
  const trending = pickUnique(trendingRaw, used, LISTING_LIMIT);
  const nieuwVandaag = pickUnique(nieuwRaw, used, LISTING_LIMIT);
  const meestOpgeslagen = pickUnique(savedRaw, used, LISTING_LIMIT);

  const uniqueIds = [...used];
  const fotos = await haalEersteFotos(supabase, uniqueIds);
  const fotoCounts = await haalFotoAantallen(supabase, uniqueIds);

  return (
    <HomeMarketplaceContent
      spotlight={spotlight}
      premium={premium}
      nearby={nearby}
      trending={trending}
      nieuwVandaag={nieuwVandaag}
      meestOpgeslagen={meestOpgeslagen}
      fotos={fotos}
      fotoCounts={fotoCounts}
    />
  );
}
