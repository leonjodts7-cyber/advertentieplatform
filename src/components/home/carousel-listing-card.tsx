"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrijs } from "@/lib/helpers";
import {
  categorieLabel,
  parseAdvertentieBeschrijving,
} from "@/lib/advertentie-metadata";
import {
  boostActief,
  isPlaatsingActief,
  isPremiumListing,
  plaatsingType,
} from "@/lib/advertentie-boost";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";

const FAV_KEY = "veloura_favorites";

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function ListingPlaceholder() {
  return (
    <div className="listing-placeholder absolute inset-0">
      <div className="listing-placeholder__glow" />
      <div className="listing-placeholder__arch" />
      <div className="listing-placeholder__line" />
      <span className="listing-placeholder__label">Profiel</span>
    </div>
  );
}

export type CarouselCardVariant = "default" | "premium" | "spotlight";

interface CarouselListingCardProps {
  advertentie: Advertentie;
  afbeeldingUrl?: string | null;
  href?: string;
  variant?: CarouselCardVariant;
  priority?: boolean;
  wide?: boolean;
}

export function CarouselListingCard({
  advertentie,
  afbeeldingUrl,
  href,
  variant = "default",
  priority = false,
  wide = false,
}: CarouselListingCardProps) {
  const { meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const categorie = categorieLabel(meta.categorie);
  const linkHref = href ?? `/advertentie/${advertentie.id}`;
  const isPremium =
    isPremiumListing(advertentie) || boostActief(meta);
  const isSpotlight =
    variant === "spotlight" ||
    (isPlaatsingActief(advertentie) && plaatsingType(advertentie) === "homepage");

  const [favoriet, setFavoriet] = useState(false);

  useEffect(() => {
    setFavoriet(readFavorites().includes(advertentie.id));
  }, [advertentie.id]);

  function toggleFavoriet(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const ids = readFavorites();
    const next = ids.includes(advertentie.id)
      ? ids.filter((id) => id !== advertentie.id)
      : [...ids, advertentie.id];
    writeFavorites(next);
    setFavoriet(next.includes(advertentie.id));
  }

  return (
    <article
      className={cn(
        "carousel-listing-card group",
        wide && "carousel-listing-card--wide",
        variant === "premium" && "carousel-listing-card--premium",
        isPremium && "carousel-listing-card--is-premium"
      )}
    >
      <Link href={linkHref} className="carousel-listing-card__link">
        <div className="carousel-listing-card__media">
          {afbeeldingUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={afbeeldingUrl}
              alt={advertentie.titel}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="carousel-listing-card__img"
            />
          ) : (
            <ListingPlaceholder />
          )}
          <div className="carousel-listing-card__overlay" />

          <div className="carousel-listing-card__badges">
            {isSpotlight && (
              <Badge variant="premium" className="carousel-listing-card__badge">
                Spotlight
              </Badge>
            )}
            {isPremium && (
              <Badge variant="premium" className="carousel-listing-card__badge">
                Premium
              </Badge>
            )}
            {advertentie.geverifieerd && (
              <Badge variant="verified" className="carousel-listing-card__badge">
                Geverifieerd
              </Badge>
            )}
          </div>
        </div>

        <div className="carousel-listing-card__body">
          <h3 className="carousel-listing-card__title">{advertentie.titel}</h3>
          <p className="carousel-listing-card__meta">
            {advertentie.leeftijd != null && (
              <span>{advertentie.leeftijd} jaar</span>
            )}
            {advertentie.leeftijd != null && advertentie.stad && (
              <span aria-hidden> · </span>
            )}
            {advertentie.stad && <span>{advertentie.stad}</span>}
          </p>
          {advertentie.prijs_vanaf != null && (
            <p className="carousel-listing-card__price">
              Vanaf {formatPrijs(advertentie.prijs_vanaf)}
            </p>
          )}
          {categorie && (
            <span className="carousel-listing-card__category">{categorie}</span>
          )}
          <span className="carousel-listing-card__cta">Bekijk profiel</span>
        </div>
      </Link>

      <button
        type="button"
        className={cn(
          "carousel-listing-card__fav",
          favoriet && "carousel-listing-card__fav--active"
        )}
        aria-label={favoriet ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}
        aria-pressed={favoriet}
        onClick={toggleFavoriet}
      >
        <Heart
          className="h-4 w-4"
          fill={favoriet ? "currentColor" : "none"}
          aria-hidden
        />
      </button>
    </article>
  );
}
