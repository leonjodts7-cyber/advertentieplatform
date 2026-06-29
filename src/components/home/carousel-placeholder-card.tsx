import { Badge } from "@/components/ui/badge";
import { formatPrijs } from "@/lib/helpers";
import type { CarouselPlaceholderItem } from "@/lib/home-carousel-placeholders";
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
  wide?: boolean;
}

export function CarouselPlaceholderCard({
  item,
  wide = false,
}: CarouselPlaceholderCardProps) {
  return (
    <article
      className={cn(
        "carousel-listing-card carousel-listing-card--placeholder group",
        wide && "carousel-listing-card--wide"
      )}
      aria-label={`${item.title} — binnenkort beschikbaar`}
    >
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
          <span className="carousel-listing-card__category">{item.categorie}</span>
          <span className="carousel-listing-card__cta carousel-listing-card__cta--disabled">
            Binnenkort beschikbaar
          </span>
        </div>
      </div>
    </article>
  );
}
