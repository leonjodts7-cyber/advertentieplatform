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
  theme?: "dark" | "light";
}

function statusVariant(
  status: Advertentie["status"]
): "green" | "new" | "muted" {
  switch (status) {
    case "actief":
      return "green";
    case "in_review":
      return "new";
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
  theme = "dark",
}: AdvertentieCardProps) {
  const linkHref =
    href ??
    (dashboard
      ? `/dashboard/advertenties/${advertentie.id}/bewerken`
      : `/advertentie/${advertentie.id}`);

  const isPremium = showPremium || advertentie.geverifieerd;
  const isLight = theme === "light" && !dashboard;

  return (
    <Link
      href={linkHref}
      className={cn(
        "group block overflow-hidden rounded-2xl transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-warm-glow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/25",
        isLight
          ? "border border-[#eadfd8] bg-white shadow-sm"
          : "profile-card"
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

        <div className="profile-card__overlay absolute inset-0" />

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

        <div className="absolute inset-x-0 bottom-0 p-4 pt-14">
          <h3 className="profile-card__overlay-text font-display line-clamp-2 text-base font-medium leading-snug sm:text-lg">
            {advertentie.titel}
          </h3>
          <div className="profile-card__overlay-muted mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
            <span>{advertentie.stad}</span>
            {advertentie.leeftijd != null && (
              <span>{advertentie.leeftijd} jaar</span>
            )}
            {advertentie.prijs_vanaf != null && (
              <span className="profile-card__overlay-accent font-semibold">
                Vanaf {formatPrijs(advertentie.prijs_vanaf)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center justify-between gap-2 px-4 py-3",
          isLight ? "text-[#756760]" : ""
        )}
      >
        {dashboard ? (
          <Badge variant={statusVariant(advertentie.status)}>
            {statusLabel(advertentie.status)}
          </Badge>
        ) : (
          <span
            className={cn(
              "text-xs font-medium tracking-wide transition-colors",
              isLight
                ? "text-[#756760] group-hover:text-[#7a2f49]"
                : "text-[#b7aaa2] group-hover:text-[#d8b46a]"
            )}
          >
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
