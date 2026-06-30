"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrijs, statusLabel } from "@/lib/helpers";
import {
  categorieLabel,
  parseAdvertentieBeschrijving,
} from "@/lib/advertentie-metadata";
import {
  boostActief,
  boostLabel,
  isPlaatsingActief,
  isPremiumListing as heeftPremiumPlaatsing,
  plaatsingType,
} from "@/lib/advertentie-boost";
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
    showPremium || heeftPremiumPlaatsing(advertentie) || boostActief(meta);
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
          {showOnline && !dashboard && (
            <Badge variant="online" className="text-[0.5625rem] gap-1">
              <span className="online-dot" aria-hidden />
              Online
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

interface DashboardAdvertentieCardProps {
  advertentie: Advertentie;
  afbeeldingUrl?: string | null;
}

export function DashboardAdvertentieCard({
  advertentie,
  afbeeldingUrl,
}: DashboardAdvertentieCardProps) {
  const { meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const boost = boostLabel(meta);
  const isPremium = advertentie.premium === true || boostActief(meta);
  const isConcept = advertentie.status === "concept";
  const bewerkUrl = `/dashboard/advertenties/${advertentie.id}/bewerken`;

  return (
    <article className="dashboard-ad-card">
      <div className="dashboard-ad-card__inner">
        <Link href={bewerkUrl} className="dashboard-ad-card__thumb">
          {afbeeldingUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={afbeeldingUrl} alt={advertentie.titel} />
          ) : (
            <span className="dashboard-ad-card__placeholder">Profiel</span>
          )}
        </Link>
        <div className="dashboard-ad-card__content">
          <div className="dashboard-ad-card__badges">
            <Badge variant={statusVariant(advertentie.status)} className="text-[0.5625rem]">
              {statusLabel(advertentie.status)}
            </Badge>
            {isPremium && (
              <Badge variant="premium" className="text-[0.5625rem]">
                Premium
              </Badge>
            )}
            {boost && (
              <Badge variant="new" className="text-[0.5625rem]">
                {boost}
              </Badge>
            )}
          </div>
          <h3 className="dashboard-ad-card__title">{advertentie.titel}</h3>
          <p className="dashboard-ad-card__meta">
            {advertentie.stad}
            {advertentie.prijs_vanaf != null && (
              <> · Vanaf {formatPrijs(advertentie.prijs_vanaf)}</>
            )}
          </p>
        </div>
      </div>
      <div className="dashboard-ad-card__actions">
        <Link href={bewerkUrl} className="dashboard-btn dashboard-btn--secondary dashboard-btn--sm">
          Bewerken
        </Link>
        {isConcept && (
          <Link
            href={`${bewerkUrl}?stap=publiceren`}
            className="dashboard-btn dashboard-btn--primary dashboard-btn--sm"
          >
            Publiceren
          </Link>
        )}
        <Link
          href={`${bewerkUrl}?stap=promotie`}
          className="dashboard-btn dashboard-btn--outline dashboard-btn--sm"
        >
          Boost instellen
        </Link>
      </div>
    </article>
  );
}

interface AdvertentieCardHorizontalProps {
  advertentie: Advertentie;
  afbeeldingUrl?: string | null;
}

export function AdvertentieCardHorizontal({
  advertentie,
  afbeeldingUrl,
}: AdvertentieCardHorizontalProps) {
  const { meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const categorie = categorieLabel(meta.categorie);
  const href = `/advertentie/${advertentie.id}`;
  const whatsapp = meta.whatsapp?.replace(/\D/g, "");

  return (
    <article className="listing-row-card">
      <Link href={href} className="listing-row-card__media">
        {afbeeldingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={afbeeldingUrl} alt={advertentie.titel} className="h-full w-full object-cover" />
        ) : (
          <ListingPlaceholder />
        )}
      </Link>
      <div className="listing-row-card__body">
        <div className="listing-row-card__badges">
          {heeftPremiumPlaatsing(advertentie) && <Badge variant="premium">Premium</Badge>}
          {isPlaatsingActief(advertentie) && plaatsingType(advertentie) === "homepage" && (
            <Badge variant="new">Spotlight</Badge>
          )}
          {categorie && <Badge variant="wine">{categorie}</Badge>}
        </div>
        <h3 className="listing-row-card__title">
          <Link href={href}>{advertentie.titel}</Link>
        </h3>
        <p className="listing-row-card__meta">
          {advertentie.stad}
          {advertentie.leeftijd != null && ` · ${advertentie.leeftijd} jaar`}
          {advertentie.prijs_vanaf != null && (
            <span className="listing-row-card__price">
              {" "}
              · Vanaf {formatPrijs(advertentie.prijs_vanaf)}
            </span>
          )}
        </p>
        <div className="listing-row-card__actions">
          {advertentie.telefoon && (
            <a href={`tel:${advertentie.telefoon}`} className="listing-row-card__contact">
              {advertentie.telefoon}
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="listing-row-card__contact"
            >
              WhatsApp
            </a>
          )}
          <Button asChild size="sm" variant="primary">
            <Link href={href}>Bekijk profiel</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
