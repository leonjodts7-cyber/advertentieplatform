import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import type { Advertentie } from "@/lib/types";

interface HomeListingSectionProps {
  title: string;
  subtitle?: string;
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  viewAllHref: string;
  showOnline?: boolean;
  hideWhenEmpty?: boolean;
  variant?: "default" | "premium";
  emptyState?: {
    title: string;
    text: string;
    cta?: { label: string; href: string };
    showProviderLink?: boolean;
    compact?: boolean;
  };
}

export function HomeListingSection({
  title,
  subtitle,
  advertenties,
  fotos,
  viewAllHref,
  showOnline = false,
  hideWhenEmpty = false,
  variant = "default",
  emptyState,
}: HomeListingSectionProps) {
  if (advertenties.length === 0 && hideWhenEmpty) return null;

  const isPremiumSection = variant === "premium";

  return (
    <section
      className={`home-listing-block${isPremiumSection ? " home-listing-block--premium" : ""}`}
    >
      <div className="container">
        <div className="home-listing-block__header">
          <div>
            <h2 className="home-listing-block__title">{title}</h2>
            {subtitle && (
              <p className="home-listing-block__subtitle">{subtitle}</p>
            )}
          </div>
          {advertenties.length > 0 && (
            <Link href={viewAllHref} className="home-listing-block__link">
              Alles bekijken →
            </Link>
          )}
        </div>

        {advertenties.length > 0 ? (
          <div className="listing-grid listing-grid--home">
            {advertenties.map((advertentie) => (
              <AdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
                theme="light"
                premium
                showPremium={advertentie.premium === true}
                showOnline={showOnline || advertentie.beschikbaar}
              />
            ))}
          </div>
        ) : emptyState ? (
          emptyState.compact ? (
            <p className="home-listing-inline-empty">{emptyState.text}</p>
          ) : (
            <div className="home-listing-empty">
            <h3 className="home-listing-empty__title">{emptyState.title}</h3>
            <p className="home-listing-empty__text">{emptyState.text}</p>
            {emptyState.cta && (
              <p className="home-listing-empty__cta">
                <Link href={emptyState.cta.href}>{emptyState.cta.label}</Link>
              </p>
            )}
            {emptyState.showProviderLink && (
              <p className="home-listing-empty__cta">
                Ben jij aanbieder?{" "}
                <Link href="/dashboard/advertenties/nieuw">
                  Plaats advertentie
                </Link>
              </p>
            )}
          </div>
          )
        ) : null}
      </div>
    </section>
  );
}
