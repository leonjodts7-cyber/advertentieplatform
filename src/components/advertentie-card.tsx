import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrijs, statusLabel } from "@/lib/helpers";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProfilePhotoPlaceholder } from "@/components/profile-photo-placeholder";

interface AdvertentieCardProps {
  advertentie: Advertentie;
  dashboard?: boolean;
  href?: string;
  afbeeldingUrl?: string | null;
  showPremium?: boolean;
}

function statusVariant(
  status: Advertentie["status"]
): "green" | "review" | "muted" {
  switch (status) {
    case "actief":
      return "green";
    case "in_review":
      return "review";
    default:
      return "muted";
  }
}

export function AdvertentieCard({
  advertentie,
  dashboard = false,
  href,
  afbeeldingUrl,
  showPremium = false,
}: AdvertentieCardProps) {
  const linkHref =
    href ??
    (dashboard
      ? `/dashboard/advertenties/${advertentie.id}/bewerken`
      : `/advertentie/${advertentie.id}`);

  const isPremium = showPremium || advertentie.geverifieerd;

  return (
    <Link
      href={linkHref}
      className={cn(
        "profile-card group block overflow-hidden transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-warm-glow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/25"
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {afbeeldingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={afbeeldingUrl}
            alt={advertentie.titel}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ProfilePhotoPlaceholder variant="warm-wine" className="!aspect-auto h-full" />
        )}

        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-3">
          {advertentie.beschikbaar && (
            <Badge variant="online">Beschikbaar</Badge>
          )}
          {advertentie.geverifieerd && (
            <Badge variant="verified">Geverifieerd</Badge>
          )}
          {isPremium && !dashboard && (
            <Badge variant="premium">Premium</Badge>
          )}
          {!dashboard && (
            <Badge variant="muted">{advertentie.stad}</Badge>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--background)]/95 via-[var(--background)]/55 to-transparent p-4 pt-16">
          <h3 className="font-display line-clamp-2 text-base font-medium leading-snug text-foreground transition-colors group-hover:text-soft-champagne sm:text-lg">
            {advertentie.titel}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
            <span>{advertentie.stad}</span>
            {advertentie.leeftijd != null && (
              <span>{advertentie.leeftijd} jaar</span>
            )}
            {advertentie.prijs_vanaf != null && (
              <span className="font-semibold text-soft-champagne">
                Vanaf {formatPrijs(advertentie.prijs_vanaf)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-3">
        {dashboard ? (
          <Badge variant={statusVariant(advertentie.status)}>
            {statusLabel(advertentie.status)}
          </Badge>
        ) : (
          <span className="text-xs font-medium tracking-wide text-muted-foreground transition-colors group-hover:text-champagne">
            Bekijk profiel →
          </span>
        )}
        {!advertentie.beschikbaar && !dashboard && (
          <Badge variant="muted">Niet beschikbaar</Badge>
        )}
      </div>
    </Link>
  );
}
