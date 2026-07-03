import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdvertentieWizard } from "@/components/advertentie-wizard";
import { BecomeProviderGate } from "@/components/become-provider-gate";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { createClient } from "@/lib/supabase/server";
import { isProviderRole } from "@/lib/user-role";
import { resolveUserRole } from "@/lib/user-role-server";

export const metadata: Metadata = {
  title: "Nieuwe advertentie",
};

export default async function NieuweAdvertentiePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/advertenties/nieuw&intent=provider");
  }

  const role = await resolveUserRole(supabase, user);
  const needsUpgrade = !isProviderRole(role);

  return (
    <BecomeProviderGate needsUpgrade={needsUpgrade}>
      <div className="dashboard-page">
        <div className="dashboard-page__header dashboard-page__header--compact">
          <div className="container">
            <DashboardSubnav />
            <h1 className="dashboard-page__title">Advertentie plaatsen</h1>
            <p className="dashboard-page__subtitle">
              Doorloop alle stappen om je profiel te publiceren. Alleen 18+.
            </p>
          </div>
        </div>
        <div className="container dashboard-page__body dashboard-page__body--compact">
          <div className="dashboard-wizard-shell">
            <Suspense fallback={<p className="text-sm text-[#a89a92]">Wizard laden…</p>}>
              <AdvertentieWizard aanbiederId={user.id} dashboard />
            </Suspense>
          </div>
        </div>
      </div>
    </BecomeProviderGate>
  );
}
