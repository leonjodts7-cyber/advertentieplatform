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
): "success" | "warning" | "muted" {
  switch (status) {
    case "actief":
      return "success";
    case "in_review":
      return "warning";
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
        "group block w-full overflow-hidden rounded-2xl border border-border/60 bg-card/80 transition-all duration-300",
        "hover:border-champagne/30 hover:shadow-premium hover:shadow-glow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "md:hover:-translate-y-0.5"
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
          <div className="gradient-placeholder h-full w-full bg-gradient-to-br from-bordeaux/70 via-bordeaux-light/50 to-champagne/25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {advertentie.beschikbaar && (
            <Badge variant="success">{beschikbaarLabel(true)}</Badge>
          )}
          {advertentie.geverifieerd && (
            <Badge variant="gold">Geverifieerd</Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <Badge variant="bordeaux" className="mb-2">
            {advertentie.stad}
          </Badge>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-display text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-champagne line-clamp-2 sm:text-xl">
          {advertentie.titel}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{advertentie.leeftijd} jaar</span>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <span className="font-semibold text-champagne">
            {formatPrijs(advertentie.prijs_vanaf)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!advertentie.beschikbaar && (
            <Badge variant="muted">{beschikbaarLabel(false)}</Badge>
          )}
          {dashboard && (
            <Badge variant={statusVariant(advertentie.status)}>
              {statusLabel(advertentie.status)}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
