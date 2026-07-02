import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorite-button";
import { formatPrijs } from "@/lib/helpers";
import type { CarouselPlaceholderItem } from "@/lib/home-carousel-placeholders";
import type { CarouselTier } from "@/components/home/carousel-listing-card";
import { cn } from "@/lib/utils";

function DemoPhotoFrame({ label }: { label: string }) {
  return (
    <div className="demo-photo-frame" aria-hidden>
      <div className="demo-photo-frame__gradient" />
      <span className="demo-photo-frame__label">{label}</span>
    </div>
  );
}

interface CarouselPlaceholderCardProps {
  item: CarouselPlaceholderItem;
  carouselTier?: CarouselTier;
  wide?: boolean;
  compact?: boolean;
}

export function CarouselPlaceholderCard({
  item,
  carouselTier,
  wide = false,
  compact = false,
}: CarouselPlaceholderCardProps) {
  const tier = carouselTier ?? (compact ? "latest" : wide ? "spotlight" : undefined);
  const isLatest = tier === "latest";

  return (
    <article
      className={cn(
        "carousel-listing-card carousel-listing-card--placeholder group",
        tier === "latest" && "carousel-listing-card--compact"
      )}
      data-carousel-tier={tier}
      aria-label={`${item.title} — binnenkort beschikbaar`}
    >
      <FavoriteButton advertentieId={item.id} disabled />
      <div className="carousel-listing-card__link">
        <div className="carousel-listing-card__media">
          <DemoPhotoFrame label={item.photoLabel} />
          <div className="carousel-listing-card__overlay" />
          <div className="carousel-listing-card__badges">
            <Badge variant="premium" className="carousel-listing-card__badge demo-badge">
              {item.badge}
            </Badge>
          </div>
        </div>

        <div className="carousel-listing-card__body">
          <h3 className="carousel-listing-card__title">{item.title}</h3>
          <p className="carousel-listing-card__meta">
            <span>{item.leeftijd} jaar</span>
            <span aria-hidden> · </span>
            <span>{item.stad}</span>
          </p>
          <p className="carousel-listing-card__price">
            Vanaf {formatPrijs(item.prijs)}
          </p>
          {!isLatest && tier !== "nearby" && (
            <span className="carousel-listing-card__category">{item.categorie}</span>
          )}
          {!isLatest && (
            <span className="carousel-listing-card__cta carousel-listing-card__cta--disabled carousel-listing-card__cta--compact">
              Bekijk profiel
            </span>
          )}
          {isLatest && (
            <span className="carousel-listing-card__cta carousel-listing-card__cta--disabled carousel-listing-card__cta--link-only">
              Bekijk
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
