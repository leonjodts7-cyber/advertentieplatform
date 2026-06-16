import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { Button } from "@/components/ui/button";
import {
  BOOST_BESCHRIJVINGEN,
  BOOST_DUUR_OPTIES,
  BOOST_PRIJZEN,
  formatEuro,
} from "@/lib/advertentie-boost";

export const metadata: Metadata = {
  title: "Boosts & zichtbaarheid",
};

const BOOST_SECTIES = [
  { type: "stad" as const, title: "Stad Boost" },
  { type: "categorie" as const, title: "Categorie Boost" },
  { type: "homepage" as const, title: "Homepage Spotlight" },
];

export default async function DashboardBoostsPage() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div>
      <div className="page-header-band">
        <div className="container">
          <DashboardSubnav />
          <h1 className="section-title mt-4">Boosts & zichtbaarheid</h1>
          <p className="section-subtitle mt-1">
            Kies hoe lang en waar jouw advertentie bovenaan zichtbaar is.
          </p>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        <div className="boost-stripe-notice">
          <p>Stripe wordt later gekoppeld. Prijzen zijn indicatief.</p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {BOOST_SECTIES.map((sectie) => {
            const duren = BOOST_DUUR_OPTIES[sectie.type];
            const prijzen = BOOST_PRIJZEN[sectie.type];

            return (
              <div key={sectie.type} className="boost-plan-card">
                <h2 className="boost-plan-card__title">{sectie.title}</h2>
                <p className="boost-plan-card__desc">
                  {BOOST_BESCHRIJVINGEN[sectie.type]}
                </p>
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
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="primary">
            <Link href="/dashboard/advertenties/nieuw">Boost via advertentie wizard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dashboard/advertenties">Mijn advertenties</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
