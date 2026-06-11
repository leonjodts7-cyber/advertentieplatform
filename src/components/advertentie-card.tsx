import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrijs, statusLabel } from "@/lib/helpers";
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
        "group block w-full overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.045] transition-all duration-300",
        "hover:border-veloura-rose/25 hover:shadow-glow md:hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veloura-champagne/35"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {afbeeldingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={afbeeldingUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="thumbnail-gradient h-full w-full profile-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140b12]/85 via-[#140b12]/15 to-transparent" />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
          {advertentie.beschikbaar && (
            <Badge variant="green">Beschikbaar</Badge>
          )}
          {advertentie.geverifieerd && (
            <Badge variant="champagne">Geverifieerd</Badge>
          )}
        </div>
        <div className="absolute bottom-2.5 left-2.5">
          <Badge variant="rose">{advertentie.stad}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-medium leading-snug text-veloura-ivory line-clamp-2 transition-colors group-hover:text-veloura-champagne/95">
          {advertentie.titel}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-veloura-soft">
          <span>{advertentie.stad}</span>
          <span aria-hidden="true">·</span>
          <span>{advertentie.leeftijd} jaar</span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-veloura-champagne/90">
            {formatPrijs(advertentie.prijs_vanaf)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          {dashboard ? (
            <Badge variant={statusVariant(advertentie.status)}>
              {statusLabel(advertentie.status)}
            </Badge>
          ) : (
            <span className="text-xs font-medium tracking-wide text-veloura-soft transition-colors group-hover:text-veloura-rose">
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
