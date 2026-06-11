import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  beschikbaarLabel,
  formatPrijs,
  statusLabel,
} from "@/lib/helpers";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdvertentieCardProps {
  advertentie: Advertentie;
  dashboard?: boolean;
  href?: string;
  afbeeldingUrl?: string | null;
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
}: AdvertentieCardProps) {
  const linkHref =
    href ??
    (dashboard
      ? `/dashboard/advertenties/${advertentie.id}/bewerken`
      : `/advertentie/${advertentie.id}`);

  return (
    <Link
      href={linkHref}
      className={cn(
        "group block w-full overflow-hidden rounded-2xl border border-border/50 bg-card/90 transition-all duration-300",
        "hover:border-champagne/25 hover:shadow-premium md:hover:-translate-y-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {afbeeldingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={afbeeldingUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="gradient-placeholder h-full w-full gold-gradient opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/25 to-transparent" />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
          {advertentie.beschikbaar && (
            <Badge variant="green">Beschikbaar</Badge>
          )}
          {advertentie.geverifieerd && (
            <Badge variant="gold">Geverifieerd</Badge>
          )}
        </div>
        <div className="absolute bottom-2.5 left-2.5">
          <Badge variant="bordeaux">{advertentie.stad}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-medium leading-snug text-foreground line-clamp-2 group-hover:text-champagne">
          {advertentie.titel}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{advertentie.stad}</span>
          <span aria-hidden="true">·</span>
          <span>{advertentie.leeftijd} jaar</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-champagne">
            {formatPrijs(advertentie.prijs_vanaf)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          {!dashboard ? (
            <span className="text-xs font-semibold uppercase tracking-wider text-champagne/80 transition-colors group-hover:text-champagne">
              Bekijk profiel →
            </span>
          ) : (
            <Badge variant={statusVariant(advertentie.status)}>
              {statusLabel(advertentie.status)}
            </Badge>
          )}
          {!advertentie.beschikbaar && !dashboard && (
            <Badge variant="muted">{beschikbaarLabel(false)}</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
