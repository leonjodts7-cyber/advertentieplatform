import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdvertentieWizard } from "@/components/advertentie-wizard";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nieuwe advertentie",
};

export default async function NieuweAdvertentiePage() {
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
          <h1 className="dashboard-page__title">Advertentie plaatsen</h1>
          <p className="dashboard-page__subtitle">
            Doorloop alle stappen om je profiel te publiceren. Alleen 18+.
          </p>
        </div>
      </div>
      <div className="container dashboard-page__body">
        <div className="glass-panel mx-auto max-w-3xl p-5 sm:p-7">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Wizard laden…</p>}>
            <AdvertentieWizard aanbiederId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
