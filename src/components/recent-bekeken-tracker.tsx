"use client";

import { useEffect } from "react";
import { addRecentBekeken } from "@/lib/recent-bekeken";
import { recordListingInterest } from "@/lib/interest-signals";
import { parseAdvertentieBeschrijving } from "@/lib/advertentie-metadata";
import type { Advertentie } from "@/lib/types";

interface RecentBekekenTrackerProps {
  advertentieId: string;
  advertentie?: Pick<Advertentie, "stad" | "beschrijving">;
}

export function RecentBekekenTracker({
  advertentieId,
  advertentie,
}: RecentBekekenTrackerProps) {
  useEffect(() => {
    addRecentBekeken(advertentieId);
    if (advertentie) {
      const { meta } = parseAdvertentieBeschrijving(advertentie.beschrijving ?? "");
      recordListingInterest({ categorie: meta.categorie, stad: advertentie.stad });
    }
  }, [advertentieId, advertentie]);

  return null;
}
