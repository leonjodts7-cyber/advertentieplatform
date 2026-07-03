"use client";

import Link from "next/link";
import { BadgeCheck, Camera, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorite-button";
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
import { isNieuwProfiel } from "@/lib/zoek-filters";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";

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

export type CarouselCardVariant = "default" | "premium" | "spotlight" | "latest";
export type CarouselTier = "spotlight" | "premium" | "nearby" | "latest" | "popular";

interface CarouselListingCardProps {
  advertentie: Advertentie;
  afbeeldingUrl?: string | null;
  href?: string;
  variant?: CarouselCardVariant;
  carouselTier?: CarouselTier;
  fotoCount?: number;
  priority?: boolean;
  wide?: boolean;
}

export function CarouselListingCard({
  advertentie,
  afbeeldingUrl,
  href,
  variant = "default",
  carouselTier,
  fotoCount = 0,
  priority = false,
  wide = false,
}: CarouselListingCardProps) {
  const tier =
    carouselTier ??
    (variant === "latest"
      ? "latest"
      : variant === "spotlight"
        ? "spotlight"
        : variant === "premium"
          ? "premium"
          : undefined);
  const { meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const categorie = categorieLabel(meta.categorie);
  const linkHref = href ?? `/advertentie/${advertentie.id}`;
  const isPremium = isPremiumListing(advertentie) || boostActief(meta);
  const isSpotlight =
    variant === "spotlight" ||
    (isPlaatsingActief(advertentie) && plaatsingType(advertentie) === "homepage");
  const isNieuw = isNieuwProfiel(advertentie.aangemaakt_op);
  const videoCount =
    (meta.videoUrls?.length ?? 0) + (meta.videoUrl ? 1 : 0);
  const showFotoCount = fotoCount > 1;
  const showVideoCount = videoCount > 0;
  const compactMeta = tier === "latest" || tier === "nearby";

  return (
    <article
      className={cn(
        "carousel-listing-card group",
        wide && "carousel-listing-card--wide",
        variant === "premium" && "carousel-listing-card--premium",
        tier === "latest" && "carousel-listing-card--compact",
        tier === "popular" && "carousel-listing-card--popular",
        isPremium && "carousel-listing-card--is-premium"
      )}
      data-carousel-tier={tier}
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

          {(showFotoCount || showVideoCount) && (
            <div className="carousel-listing-card__media-stats" aria-hidden>
              {showFotoCount && (
                <span className="carousel-listing-card__media-stat">
                  <Camera className="h-3 w-3" />
                  {fotoCount}
                </span>
              )}
              {showVideoCount && (
                <span className="carousel-listing-card__media-stat">
                  <Video className="h-3 w-3" />
                  {videoCount}
                </span>
              )}
            </div>
          )}

          <div className="carousel-listing-card__badges">
            {isNieuw && (
              <Badge
                variant="default"
                className="carousel-listing-card__badge carousel-listing-card__badge--nieuw"
              >
                Nieuw
              </Badge>
            )}
            {isSpotlight && !compactMeta && (
              <Badge variant="premium" className="carousel-listing-card__badge">
                Spotlight
              </Badge>
            )}
            {isPremium && !isSpotlight && (
              <Badge variant="premium" className="carousel-listing-card__badge">
                Premium
              </Badge>
            )}
            {advertentie.geverifieerd && (
              <Badge variant="verified" className="carousel-listing-card__badge">
                <BadgeCheck className="h-3 w-3" aria-hidden />
                Geverifieerd
              </Badge>
            )}
          </div>
        </div>

        <div className="carousel-listing-card__body">
          <h3 className="carousel-listing-card__title">{advertentie.titel}</h3>
          <p className="carousel-listing-card__meta">
            {advertentie.stad && <span>{advertentie.stad}</span>}
            {advertentie.leeftijd != null && advertentie.stad && (
              <span aria-hidden> · </span>
            )}
            {advertentie.leeftijd != null && (
              <span>{advertentie.leeftijd} jaar</span>
            )}
          </p>
          {advertentie.prijs_vanaf != null && (
            <p className="carousel-listing-card__price">
              Vanaf {formatPrijs(advertentie.prijs_vanaf)}
            </p>
          )}
          {categorie && !compactMeta && (
            <span className="carousel-listing-card__category">{categorie}</span>
          )}
          {tier !== "latest" && (
            <span
              className={cn(
                "carousel-listing-card__cta",
                (tier === "spotlight" || tier === "premium" || tier === "popular") &&
                  "carousel-listing-card__cta--compact",
                tier === "nearby" && "carousel-listing-card__cta--subtle"
              )}
            >
              Bekijk profiel
            </span>
          )}
          {tier === "latest" && (
            <span className="carousel-listing-card__cta carousel-listing-card__cta--link-only">
              Bekijk
            </span>
          )}
        </div>
      </Link>

      <FavoriteButton advertentieId={advertentie.id} />
    </article>
  );
}
