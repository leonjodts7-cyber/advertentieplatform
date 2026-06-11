import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrijs, statusLabel } from "@/lib/helpers";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MapPin, Sparkles } from "lucide-react";

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
        "group luxury-card flex flex-col overflow-hidden transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/35 hover:shadow-glow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
      )}
    >
      <div className="relative m-3 mb-0 aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[3/4]">
        {afbeeldingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={afbeeldingUrl}
            alt={advertentie.titel}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="thumbnail-gradient flex h-full w-full items-center justify-center rounded-2xl">
            <Sparkles className="h-8 w-8 text-primary/35" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-3">
          {advertentie.geverifieerd && (
            <Badge variant="success">Verifieerd</Badge>
          )}
          {isPremium && !dashboard && (
            <Badge variant="premium">Premium</Badge>
          )}
          {advertentie.beschikbaar && (
            <Badge variant="green">Beschikbaar</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 pt-3">
        <h3 className="font-display line-clamp-2 text-base font-medium leading-snug text-foreground transition-colors group-hover:text-primary-dark sm:text-lg">
          {advertentie.titel}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/50" />
            {advertentie.stad}
          </span>
          {advertentie.leeftijd != null && (
            <span>{advertentie.leeftijd} jaar</span>
          )}
        </div>

        {advertentie.prijs_vanaf != null && (
          <p className="text-sm font-semibold text-primary-dark">
            Vanaf {formatPrijs(advertentie.prijs_vanaf)}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {dashboard ? (
            <Badge variant={statusVariant(advertentie.status)}>
              {statusLabel(advertentie.status)}
            </Badge>
          ) : (
            <span className="text-xs font-medium tracking-wide text-muted-foreground transition-colors group-hover:text-primary">
              Bekijk profiel →
            </span>
          )}
          {!advertentie.beschikbaar && !dashboard && (
            <Badge variant="muted">Niet beschikbaar</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
