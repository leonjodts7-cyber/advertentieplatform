import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import {
  AUTO_BOOST_PRIJZEN,
  BOOST_DUUR_OPTIES,
  BOOST_PRIJZEN,
  formatEuro,
} from "@/lib/advertentie-boost";

export const metadata: Metadata = {
  title: "Boosts & zichtbaarheid",
};

const BOOST_SECTIES = [
  { type: "stad" as const, title: "Stad Boost", desc: "Sta bovenaan in gekozen stad." },
  { type: "categorie" as const, title: "Categorie Boost", desc: "Sta bovenaan binnen jouw categorie." },
  { type: "homepage" as const, title: "Homepage Spotlight", desc: "Zichtbaar op de homepage." },
];

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
            Kies waar en hoelang jouw advertentie bovenaan staat.
          </p>
        </div>
      </div>

      <div className="container dashboard-page__body">
        <div className="boost-stripe-notice">
          <p>Stripe wordt later gekoppeld. Prijzen zijn indicatief.</p>
        </div>

        <div className="boost-products-grid">
          {BOOST_SECTIES.map((sectie) => {
            const duren = BOOST_DUUR_OPTIES[sectie.type];
            const prijzen = BOOST_PRIJZEN[sectie.type];

            return (
              <div key={sectie.type} className="boost-plan-card">
                <h2 className="boost-plan-card__title">{sectie.title}</h2>
                <p className="boost-plan-card__desc">{sectie.desc}</p>
                <ul className="boost-plan-card__prices">
                  {duren.map((dagen) => (
                    <li key={dagen}>
                      <span>{dagen} dag{dagen > 1 ? "en" : ""}</span>
                      <span className="boost-plan-card__price">
                        {formatEuro(prijzen[dagen as keyof typeof prijzen])}
                      </span>
                    </li>
                  ))}
                </ul>
                <button type="button" className="dashboard-btn dashboard-btn--secondary w-full" disabled>
                  Binnenkort betalen
                </button>
              </div>
            );
          })}

          <div className="boost-plan-card">
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
              Binnenkort betalen
            </button>
          </div>
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
