import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeProviderCta() {
  return (
    <section className="home-provider-cta home-provider-cta--pro">
      <div className="container">
        <div className="home-provider-cta__card">
          <div className="home-provider-cta__content">
            <p className="home-provider-cta__eyebrow">Voor aanbieders</p>
            <h2 className="home-provider-cta__title">
              Bereik meer klanten met een professioneel profiel
            </h2>
            <p className="home-provider-cta__desc">
              Plaats je advertentie op Veloura, beheer je zichtbaarheid en
              kies optioneel premium of boost voor extra exposure.
            </p>
          </div>
          <div className="home-provider-cta__actions">
            <Link
              href="/login?redirect=%2Fdashboard%2Fadvertenties%2Fnieuw"
              className="home-provider-cta__btn home-provider-cta__btn--primary"
            >
              Advertentie plaatsen
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/dashboard/boosts"
              className="home-provider-cta__btn home-provider-cta__btn--secondary"
            >
              Bekijk boost opties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
