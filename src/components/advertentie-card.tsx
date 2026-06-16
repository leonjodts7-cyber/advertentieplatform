import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrijs, statusLabel } from "@/lib/helpers";
import {
  categorieLabel,
  parseAdvertentieBeschrijving,
} from "@/lib/advertentie-metadata";
import { boostActief } from "@/lib/advertentie-boost";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdvertentieCardProps {
  advertentie: Advertentie;
  dashboard?: boolean;
  href?: string;
  afbeeldingUrl?: string | null;
  showPremium?: boolean;
  showOnline?: boolean;
  premium?: boolean;
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

export function AdvertentieCard({
  advertentie,
  dashboard = false,
  href,
  afbeeldingUrl,
  showPremium = false,
  showOnline = false,
  premium = false,
  theme = "dark",
}: AdvertentieCardProps) {
  const { meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const categorie = categorieLabel(meta.categorie);

  const linkHref =
    href ??
    (dashboard
      ? `/dashboard/advertenties/${advertentie.id}/bewerken`
      : `/advertentie/${advertentie.id}`);

  const isPremiumListing =
    showPremium || advertentie.premium === true || boostActief(meta);
  const isLight = theme === "light" && !dashboard;

  return (
    <Link
      href={linkHref}
      className={cn(
        "group block overflow-hidden rounded-2xl transition-all duration-300",
        premium && "listing-card-premium",
        premium
          ? isPremiumListing
            ? "hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(123,47,73,0.22)]"
            : "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(123,47,73,0.14)]"
          : "hover:-translate-y-0.5 hover:shadow-warm-glow",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/25",
        isLight
          ? cn(
              "border border-[var(--border-light)] bg-[var(--card-light)] shadow-[0_2px_16px_rgba(36,25,31,0.06)]",
              isPremiumListing && "listing-card-premium--active"
            )
          : "listing-card-dark border border-white/[0.12]"
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
          <ListingPlaceholder />
        )}

        <div className="profile-card__overlay absolute inset-0" />

        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1 p-2.5 sm:p-3">
          {isPremiumListing && !dashboard && (
            <Badge variant="premium" className="text-[0.5625rem]">
              Premium
            </Badge>
          )}
          {advertentie.geverifieerd && (
            <Badge variant="verified" className="text-[0.5625rem]">
              Geverifieerd
            </Badge>
          )}
          {(showOnline || advertentie.beschikbaar) && !dashboard && (
            <Badge variant="online" className="text-[0.5625rem] gap-1">
              <span className="online-dot" aria-hidden />
              Beschikbaar
            </Badge>
          )}
          {categorie && !dashboard && (
            <Badge variant="wine" className="text-[0.5625rem]">
              {categorie}
            </Badge>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 pt-12 sm:p-4 sm:pt-14">
          <h3 className="profile-card__overlay-text font-display line-clamp-2 text-base font-medium leading-snug sm:text-lg">
            {advertentie.titel}
          </h3>
          <div className="profile-card__overlay-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:gap-x-3 sm:text-sm">
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
          "flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3",
          isLight ? "text-[var(--muted-dark)]" : "text-[#c2b4ab]"
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
                ? "group-hover:text-[var(--wine)]"
                : "group-hover:text-[var(--champagne)]"
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
