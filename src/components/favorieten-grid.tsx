"use client";

import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { getListingCardVariant } from "@/lib/listing-card-variant";
import { useFavorites } from "@/contexts/favorites-context";
import type { Advertentie } from "@/lib/types";

interface FavorietenGridProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
}

export function FavorietenGrid({ advertenties, fotos }: FavorietenGridProps) {
  const { isFavorited } = useFavorites();

  const visible = advertenties.filter((ad) => isFavorited(ad.id));

  if (visible.length === 0) {
    return (
      <div className="favorieten-empty">
        <h2 className="favorieten-empty__title">Je hebt nog geen favorieten opgeslagen.</h2>
        <p className="favorieten-empty__text">
          Sla profielen op via het hart-icoon om ze hier terug te vinden.
        </p>
        <Link href="/zoeken" className="favorieten-empty__cta">
          Profielen zoeken
        </Link>
      </div>
    );
  }

  return (
    <div className="listing-grid listing-grid--search listing-grid--compact-cards favorieten-grid">
      {visible.map((advertentie) => (
        <ListingCard
          key={advertentie.id}
          advertentie={advertentie}
          afbeeldingUrl={fotos.get(advertentie.id)}
          variant={getListingCardVariant(advertentie)}
        />
      ))}
    </div>
  );
}
