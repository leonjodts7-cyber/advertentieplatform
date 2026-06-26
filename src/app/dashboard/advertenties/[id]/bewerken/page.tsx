import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdvertentieWizard } from "@/components/advertentie-wizard";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

interface BewerkAdvertentiePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Advertentie bewerken" };
}

export default async function BewerkAdvertentiePage({ params }: BewerkAdvertentiePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: advertentieRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const advertentie = advertentieRaw as Advertentie | null;
  if (!advertentie) notFound();
  if (advertentie.aanbieder_id !== user.id) redirect("/dashboard/advertenties");

  const { data: fotosRaw } = await supabase
    .from("advertentie_fotos")
    .select("url")
    .eq("advertentie_id", id)
    .order("volgorde", { ascending: true });

  const bestaandeFotoUrls = (fotosRaw ?? []).map((f) => f.url);

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div className="container">
          <DashboardSubnav />
          <h1 className="dashboard-page__title">Advertentie bewerken</h1>
          <p className="dashboard-page__subtitle">
            Pas alle profielgegevens, media en zichtbaarheid aan.
          </p>
        </div>
      </div>
      <div className="container dashboard-page__body">
        <div className="dashboard-wizard-shell">
          <Suspense fallback={<p className="text-sm text-[#a89a92]">Wizard laden…</p>}>
            <AdvertentieWizard
              aanbiederId={user.id}
              advertentie={advertentie}
              bestaandeFotoUrls={bestaandeFotoUrls}
              dashboard
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
