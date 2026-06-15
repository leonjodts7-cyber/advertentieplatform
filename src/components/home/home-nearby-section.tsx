import Link from "next/link";
import { AdvertentieCard } from "@/components/advertentie-card";
import { BUURT_STEDEN } from "@/lib/marketplace";
import type { Advertentie } from "@/lib/types";

interface HomeNearbySectionProps {
  stad?: string;
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
}

export function HomeNearbySection({
  stad,
  advertenties,
  fotos,
}: HomeNearbySectionProps) {
  const hasStad = Boolean(stad?.trim());

  return (
    <section className="home-listing-block">
      <div className="container">
        <div className="home-listing-block__header">
          <div>
            <h2 className="home-listing-block__title">Advertenties in jouw buurt</h2>
            {hasStad ? (
              <p className="home-listing-block__subtitle">
                Profielen in en rond {stad}
              </p>
            ) : (
              <p className="home-listing-block__subtitle">
                Kies een stad om profielen in jouw regio te bekijken.
              </p>
            )}
          </div>
          {hasStad && advertenties.length > 0 && (
            <Link
              href={`/zoeken?stad=${encodeURIComponent(stad!)}`}
              className="home-listing-block__link"
            >
              Meer in {stad} →
            </Link>
          )}
        </div>

        {hasStad ? (
          advertenties.length > 0 ? (
            <div className="listing-grid listing-grid--home">
              {advertenties.map((advertentie) => (
                <AdvertentieCard
                  key={advertentie.id}
                  advertentie={advertentie}
                  afbeeldingUrl={fotos.get(advertentie.id)}
                  theme="light"
                  premium
                  showPremium={advertentie.premium === true}
                  showOnline={advertentie.beschikbaar}
                />
              ))}
            </div>
          ) : (
            <div className="home-listing-empty">
              <h3 className="home-listing-empty__title">
                Geen profielen in {stad}
              </h3>
              <p className="home-listing-empty__text">
                Probeer een andere stad of bekijk alle actieve profielen.
              </p>
              <p className="home-listing-empty__cta">
                <Link href="/zoeken">Bekijk alle profielen</Link>
              </p>
            </div>
          )
        ) : (
          <div className="city-links-grid city-links-grid--buurt">
            {BUURT_STEDEN.map((s) => (
              <Link
                key={s}
                href={`/?stad=${encodeURIComponent(s)}`}
                className="city-link-card"
              >
                {s}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
