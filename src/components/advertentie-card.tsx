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
}

function statusVariant(
  status: Advertentie["status"]
): "default" | "success" | "warning" | "muted" {
  switch (status) {
    case "actief":
      return "success";
    case "in_review":
      return "warning";
    case "concept":
      return "muted";
    default:
      return "muted";
  }
}

export function AdvertentieCard({
  advertentie,
  dashboard = false,
  href,
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
        "group block rounded-xl border border-border bg-card p-5 transition-all",
        "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {advertentie.titel}
        </h3>
        {advertentie.geverifieerd && (
          <Badge variant="success" className="shrink-0">
            Geverifieerd
          </Badge>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
        <span>{advertentie.stad}</span>
        <span aria-hidden="true">·</span>
        <span>{advertentie.leeftijd} jaar</span>
        <span aria-hidden="true">·</span>
        <span className="font-medium text-foreground">
          {formatPrijs(advertentie.prijs_vanaf)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge
          variant={advertentie.beschikbaar ? "success" : "muted"}
        >
          {beschikbaarLabel(advertentie.beschikbaar)}
        </Badge>
        {dashboard && (
          <Badge variant={statusVariant(advertentie.status)}>
            {statusLabel(advertentie.status)}
          </Badge>
        )}
      </div>
    </Link>
  );
}
