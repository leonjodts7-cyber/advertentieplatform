"use client";

import { useEffect, useState } from "react";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { getRecentBekekenIds } from "@/lib/recent-bekeken";
import type { Advertentie } from "@/lib/types";

interface RecentBekekenSectionProps {
  variant?: "home" | "embedded";
  className?: string;
}

export function RecentBekekenSection({
  variant = "home",
  className,
}: RecentBekekenSectionProps) {
  const [items, setItems] = useState<Advertentie[]>([]);
  const [fotos, setFotos] = useState<Map<string, string | undefined>>(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ids = getRecentBekekenIds();
    if (ids.length === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;

    fetch(`/api/advertenties/by-ids?ids=${encodeURIComponent(ids.join(","))}`)
      .then((res) => (res.ok ? res.json() : { advertenties: [], fotos: {} }))
      .then((data: { advertenties?: Advertentie[]; fotos?: Record<string, string> }) => {
        if (cancelled) return;
        const byId = new Map(
          (data.advertenties ?? []).map((ad) => [ad.id, ad])
        );
        const ordered = ids
          .map((id) => byId.get(id))
          .filter((ad): ad is Advertentie => ad != null);
        setItems(ordered);
        setFotos(new Map(Object.entries(data.fotos ?? {})));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready || items.length === 0) return null;

  return (
    <HorizontalListingsCarousel
      title="Recent bekeken"
      subtitle="Profielen die je recent hebt bekeken."
      items={items}
      fotos={fotos}
      variant="latest"
      viewAllHref="/zoeken"
      embedded={variant === "embedded"}
      className={className}
    />
  );
}
