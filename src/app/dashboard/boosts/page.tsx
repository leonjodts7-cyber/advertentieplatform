import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import {
  AUTO_BOOST_PRIJZEN,
  BOOST_BESCHRIJVINGEN,
  BOOST_DUUR_OPTIES,
  BOOST_PRIJZEN,
  BOOST_ZICHTBAARHEID,
  PREMIUM_MAAND_PRIJS,
  formatEuro,
} from "@/lib/advertentie-boost";

export const metadata: Metadata = {
  title: "Boosts & zichtbaarheid",
};

const PAKKETTEN = [
  {
    id: "gratis",
    title: "Gratis",
    desc: "Basisprofiel op Veloura zonder extra zichtbaarheid.",
    prijs: "€0",
    looptijd: "Onbeperkt",
    voordelen: [
      "Actief profiel in zoekresultaten",
      "Foto's en contactgegevens",
      "Beheer via dashboard",
    ],
    cta: "Advertentie plaatsen",
    href: "/dashboard/advertenties/nieuw",
    enabled: true,
  },
  {
    id: "premium",
    title: "Premium advertentie",
    desc: "Extra zichtbaarheid en premium badge op je profiel.",
    prijs: formatEuro(PREMIUM_MAAND_PRIJS),
    looptijd: "30 dagen",
    voordelen: [
      "Premium badge op profiel",
      "Hoger in zoekresultaten",
      "Uitgelicht in premium carousels",
    ],
    cta: "Binnenkort beschikbaar",
    enabled: false,
  },
  {
    id: "stad",
    title: "Stad boost",
    desc: BOOST_BESCHRIJVINGEN.stad,
    prijs: `vanaf ${formatEuro(BOOST_PRIJZEN.stad[1])}`,
    looptijd: `${BOOST_DUUR_OPTIES.stad.join(" / ")} dagen`,
    voordelen: [
      BOOST_ZICHTBAARHEID.stad,
      "Meer lokale exposure",
      "Ideaal voor stadsgerichte aanbieders",
    ],
    cta: "Binnenkort beschikbaar",
    enabled: false,
  },
  {
    id: "homepage",
    title: "Homepage Spotlight",
    desc: BOOST_BESCHRIJVINGEN.homepage,
    prijs: `vanaf ${formatEuro(BOOST_PRIJZEN.homepage[1])}`,
    looptijd: `${BOOST_DUUR_OPTIES.homepage.join(" / ")} dagen`,
    voordelen: [
      BOOST_ZICHTBAARHEID.homepage,
      "Maximale zichtbaarheid",
      "Spotlight op homepage carousel",
    ],
    cta: "Binnenkort beschikbaar",
    enabled: false,
  },
] as const;

export default async function DashboardBoostsPage() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div className="container">
          <DashboardSubnav />
          <h1 className="dashboard-page__title">Boosts & zichtbaarheid</h1>
          <p className="dashboard-page__subtitle">
            Kies waar en hoelang jouw advertentie extra zichtbaar is.
          </p>
        </div>
      </div>

      <div className="container dashboard-page__body">
        <div className="boost-stripe-notice">
          <p>
            Online betaling volgt binnenkort. Stel boosts nu al in via je
            advertentie-wizard — prijzen zijn indicatief.
          </p>
        </div>

        <div className="boost-packages-grid">
          {PAKKETTEN.map((pakket) => (
            <article key={pakket.id} className="boost-package-card">
              <h2 className="boost-package-card__title">{pakket.title}</h2>
              <p className="boost-package-card__desc">{pakket.desc}</p>
              <p className="boost-package-card__price">{pakket.prijs}</p>
              <p className="boost-package-card__duration">
                Looptijd: {pakket.looptijd}
              </p>
              <ul className="boost-package-card__benefits">
                {pakket.voordelen.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              {pakket.enabled && "href" in pakket ? (
                <Link
                  href={pakket.href}
                  className="dashboard-btn dashboard-btn--primary w-full"
                >
                  {pakket.cta}
                </Link>
              ) : (
                <button
                  type="button"
                  className="dashboard-btn dashboard-btn--secondary w-full"
                  disabled
                >
                  {pakket.cta}
                </button>
              )}
            </article>
          ))}
        </div>

        <div className="boost-plan-card boost-plan-card--auto mt-4">
          <h2 className="boost-plan-card__title">Auto Boost</h2>
          <p className="boost-plan-card__desc">
            Automatisch extra zichtbaarheid op drukke momenten.
          </p>
          <ul className="boost-plan-card__prices">
            <li>
              <span>Weekend boost</span>
              <span className="boost-plan-card__price">
                {formatEuro(AUTO_BOOST_PRIJZEN.weekend)}/maand
              </span>
            </li>
            <li>
              <span>Elke avond boost</span>
              <span className="boost-plan-card__price">
                {formatEuro(AUTO_BOOST_PRIJZEN.avond)}/maand
              </span>
            </li>
          </ul>
          <button type="button" className="dashboard-btn dashboard-btn--secondary w-full" disabled>
            Binnenkort beschikbaar
          </button>
        </div>

        <div className="dashboard-quick-actions mt-4">
          <Link
            href="/dashboard/advertenties/nieuw?stap=promotie"
            className="dashboard-btn dashboard-btn--primary"
          >
            Boost instellen via advertentie
          </Link>
          <Link href="/dashboard/advertenties" className="dashboard-btn dashboard-btn--secondary">
            Mijn advertenties
          </Link>
        </div>
      </div>
    </div>
  );
}
