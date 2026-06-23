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

  return (
    <article className="dashboard-ad-card overflow-hidden rounded-2xl border border-white/[0.12] bg-[rgba(255,255,255,0.04)]">
      <Link
        href={`/dashboard/advertenties/${advertentie.id}/bewerken`}
        className="relative block aspect-[3/4] overflow-hidden"
      >
        {afbeeldingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={afbeeldingUrl}
            alt={advertentie.titel}
            className="h-full w-full object-cover"
          />
        ) : (
          <ListingPlaceholder />
        )}
        <div className="profile-card__overlay absolute inset-0" />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1 p-2.5">
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
        <div className="absolute inset-x-0 bottom-0 p-3 pt-10">
          <h3 className="profile-card__overlay-text font-display line-clamp-2 text-base font-medium">
            {advertentie.titel}
          </h3>
          <p className="profile-card__overlay-muted mt-1 text-xs">
            {advertentie.stad}
            {advertentie.prijs_vanaf != null && (
              <> · Vanaf {formatPrijs(advertentie.prijs_vanaf)}</>
            )}
          </p>
        </div>
      </Link>
      <div className="flex gap-2 p-3">
        <Button asChild variant="secondary" size="sm" className="flex-1">
          <Link href={`/dashboard/advertenties/${advertentie.id}/bewerken`}>
            Bewerken
          </Link>
        </Button>
        <Button asChild variant="primary" size="sm" className="flex-1">
          <Link href={`/dashboard/advertenties/${advertentie.id}/bewerken?stap=promotie`}>
            Boost kopen
          </Link>
        </Button>
      </div>
    </article>
  );
}

interface SpotlightSectionProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
}

export function SpotlightSection({ advertenties, fotos }: SpotlightSectionProps) {
  return (
    <section className="home-spotlight">
      <div className="container">
        <div className="home-listing-block__header">
          <div>
            <h2 className="home-listing-block__title">Homepage Spotlight</h2>
            <p className="home-listing-block__subtitle">
              Topprofielen met maximale zichtbaarheid.
            </p>
          </div>
        </div>
        {advertenties.length > 0 ? (
          <div className="spotlight-track">
            {advertenties.map((ad) => (
              <SpotlightCard
                key={ad.id}
                advertentie={ad}
                afbeeldingUrl={fotos.get(ad.id)}
              />
            ))}
          </div>
        ) : (
          <p className="home-listing-inline-empty">
            Spotlight-posities komen hier binnenkort.
          </p>
        )}
      </div>
    </section>
  );
}

function SpotlightCard({
  advertentie,
  afbeeldingUrl,
}: {
  advertentie: Advertentie;
  afbeeldingUrl?: string | null;
}) {
  const { meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const categorie = categorieLabel(meta.categorie);
  const href = `/advertentie/${advertentie.id}`;

  return (
    <article className="spotlight-card">
      <Link href={href} className="spotlight-card__media">
        {afbeeldingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={afbeeldingUrl} alt={advertentie.titel} className="h-full w-full object-cover" />
        ) : (
          <ListingPlaceholder />
        )}
      </Link>
      <div className="spotlight-card__body">
        <div className="spotlight-card__badges">
          <Badge variant="premium">Spotlight</Badge>
          {heeftPremiumPlaatsing(advertentie) && <Badge variant="premium">Premium</Badge>}
          {categorie && <Badge variant="wine">{categorie}</Badge>}
          {advertentie.geverifieerd && <Badge variant="verified">Geverifieerd</Badge>}
        </div>
        <h3 className="spotlight-card__title">
          <Link href={href}>{advertentie.titel}</Link>
        </h3>
        <p className="spotlight-card__meta">
          {advertentie.stad}
          {advertentie.leeftijd != null && ` · ${advertentie.leeftijd} jaar`}
        </p>
        {advertentie.prijs_vanaf != null && (
          <p className="spotlight-card__price">Vanaf {formatPrijs(advertentie.prijs_vanaf)}</p>
        )}
        <Button asChild size="sm" variant="primary" className="mt-3">
          <Link href={href}>Bekijk profiel</Link>
        </Button>
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
          {advertentie.beschikbaar && (
            <Badge variant="online" className="gap-1">
              <span className="online-dot" aria-hidden />
              Beschikbaar
            </Badge>
          )}
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
