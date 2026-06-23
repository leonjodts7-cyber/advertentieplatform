import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardAdvertentieCard } from "@/components/advertentie-card";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { Button } from "@/components/ui/button";
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
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="dashboard-page__title">Mijn advertenties</h1>
              <p className="dashboard-page__subtitle">
                Concept · In beoordeling · Actief
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="primary" size="sm">
                <Link href="/dashboard/advertenties/nieuw">Nieuwe advertentie</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/dashboard/boosts">Boost kopen</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-page__body">
        {advertenties.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advertenties.map((advertentie) => (
              <DashboardAdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="velvet-card p-8 text-center sm:p-12">
            <p className="font-display text-xl text-foreground">
              Nog geen advertenties
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Start met je eerste profiel als aanbieder op Veloura.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button asChild variant="primary">
                <Link href="/dashboard/advertenties/nieuw">Nieuwe advertentie</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/dashboard/boosts">Boost kopen</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
