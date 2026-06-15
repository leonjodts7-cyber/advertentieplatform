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
  emptyState?: {
    title: string;
    text: string;
    showCta?: boolean;
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
  emptyState,
}: HomeListingSectionProps) {
  if (advertenties.length === 0 && hideWhenEmpty) return null;

  return (
    <section className="home-listing-block">
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
                showOnline={showOnline || advertentie.beschikbaar}
              />
            ))}
          </div>
        ) : emptyState ? (
          <div className="home-listing-empty">
            <h3 className="home-listing-empty__title">{emptyState.title}</h3>
            <p className="home-listing-empty__text">{emptyState.text}</p>
            {emptyState.showCta && (
              <p className="home-listing-empty__cta">
                Ben jij aanbieder?{" "}
                <Link href="/dashboard/advertenties/nieuw">
                  Plaats advertentie
                </Link>
              </p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
