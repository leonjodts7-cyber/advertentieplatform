import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { Button } from "@/components/ui/button";
import {
  AUTO_BOOST_PRIJZEN,
  BOOST_BESCHRIJVINGEN,
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
              <div key={sectie.type} className="boost-plan-card boost-plan-card--light">
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
                <Button type="button" variant="secondary" className="w-full" disabled>
                  Binnenkort betalen
                </Button>
              </div>
            );
          })}

          <div className="boost-plan-card boost-plan-card--light">
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
            <Button type="button" variant="secondary" className="w-full" disabled>
              Binnenkort betalen
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="primary">
            <Link href="/dashboard/advertenties/nieuw?stap=promotie">
              Boost instellen via advertentie
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dashboard/advertenties">Mijn advertenties</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
