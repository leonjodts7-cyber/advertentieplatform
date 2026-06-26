import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardAdvertentieCard } from "@/components/advertentie-card";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mijn advertenties",
};

export default async function DashboardAdvertentiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: advertentiesRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("aanbieder_id", user.id)
    .order("aangemaakt_op", { ascending: false });

  const advertenties = (advertentiesRaw ?? []) as Advertentie[];
  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div className="container">
          <DashboardSubnav />
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="dashboard-page__title">Mijn advertenties</h1>
              <p className="dashboard-page__subtitle">
                Concept · In beoordeling · Actief
              </p>
            </div>
            <div className="dashboard-quick-actions !mb-0">
              <Link
                href="/dashboard/advertenties/nieuw"
                className="dashboard-btn dashboard-btn--primary dashboard-btn--sm"
              >
                Nieuwe advertentie
              </Link>
              <Link
                href="/dashboard/boosts"
                className="dashboard-btn dashboard-btn--secondary dashboard-btn--sm"
              >
                Boost kopen
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-page__body">
        {advertenties.length > 0 ? (
          <div className="dashboard-grid--ads">
            {advertenties.map((advertentie) => (
              <DashboardAdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <p className="dashboard-empty-state__title">Nog geen advertenties</p>
            <p className="dashboard-empty-state__text">
              Start met je eerste profiel als aanbieder op Veloura.
            </p>
            <div className="dashboard-empty-state__actions">
              <Link href="/dashboard/advertenties/nieuw" className="dashboard-btn dashboard-btn--primary">
                Nieuwe advertentie
              </Link>
              <Link href="/dashboard/boosts" className="dashboard-btn dashboard-btn--secondary">
                Boost kopen
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
