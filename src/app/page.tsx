import {
  fetchActieveAdvertenties,
  fetchPopulaireAdvertenties,
  fetchPremiumAdvertenties,
  fetchSpotlightAdvertenties,
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

export default async function HomePage() {
  const supabase = await createClient();

  const [spotlight, premium, nieuwste, nearbyRaw, populaire] = await Promise.all([
    fetchSpotlightAdvertenties(supabase, LISTING_LIMIT),
    fetchPremiumAdvertenties(supabase, LISTING_LIMIT),
    fetchActieveAdvertenties(supabase, { limit: LISTING_LIMIT }),
    fetchActieveAdvertenties(supabase, { limit: LISTING_LIMIT }),
    fetchPopulaireAdvertenties(supabase, LISTING_LIMIT),
  ]);

  const nearby = sortPremiumFirst(nearbyRaw);

  const allIds = [
    ...spotlight.map((a) => a.id),
    ...premium.map((a) => a.id),
    ...nieuwste.map((a) => a.id),
    ...nearby.map((a) => a.id),
    ...populaire.map((a) => a.id),
  ];
  const uniqueIds = [...new Set(allIds)];
  const fotos = await haalEersteFotos(supabase, uniqueIds);
  const fotoCounts = await haalFotoAantallen(supabase, uniqueIds);

  return (
    <HomeMarketplaceContent
      spotlight={spotlight}
      premium={premium}
      nieuwste={nieuwste}
      nearby={nearby}
      populaire={populaire}
      fotos={fotos}
      fotoCounts={fotoCounts}
    />
  );
}
