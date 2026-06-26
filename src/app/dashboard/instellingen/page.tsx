import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";

export const metadata: Metadata = {
  title: "Instellingen",
};

export default async function DashboardInstellingenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await zorgProfielBestaat(user.id, user.email ?? "");

  const email = user.email ?? "—";
  const accountStatus = user.email_confirmed_at ? "Actief" : "E-mail nog niet bevestigd";

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div className="container">
          <DashboardSubnav />
          <h1 className="dashboard-page__title">Instellingen</h1>
          <p className="dashboard-page__subtitle">
            Beheer account, profiel en voorkeuren.
          </p>
        </div>
      </div>

      <div className="container dashboard-page__body">
        <div className="dashboard-settings-stack">
          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">Account</h2>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">E-mailadres</span>
              <span className="dashboard-settings-row__value">{email}</span>
            </div>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Accountstatus</span>
              <span className="dashboard-settings-badge">{accountStatus}</span>
            </div>
          </section>

          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">Profielvoorkeuren</h2>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Standaard stad</span>
              <span className="dashboard-settings-row__placeholder">Nog niet ingesteld</span>
            </div>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Standaard taal</span>
              <span className="dashboard-settings-row__value">Nederlands</span>
            </div>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Meldingen</span>
              <span className="dashboard-settings-row__placeholder">Binnenkort</span>
            </div>
          </section>

          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">Veiligheid</h2>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Wachtwoord wijzigen</span>
              <span className="dashboard-settings-row__placeholder">Binnenkort</span>
            </div>
            <div className="dashboard-settings-logout">
              <UitloggenKnop />
            </div>
          </section>

          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">Publicatie</h2>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Standaard status</span>
              <span className="dashboard-settings-row__value">Concept of publiceren</span>
            </div>
            <p className="dashboard-settings-note">
              Concepten zijn alleen zichtbaar voor jou. Na publiceren verschijnt je profiel live.
            </p>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Verificatie</span>
              <span className="dashboard-settings-row__placeholder">Binnenkort</span>
            </div>
          </section>

          <div className="dashboard-quick-actions dashboard-quick-actions--footer">
            <Link href="/dashboard" className="dashboard-btn dashboard-btn--secondary">
              Terug naar overzicht
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
