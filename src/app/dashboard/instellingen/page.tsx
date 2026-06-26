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
            <p className="dashboard-settings-section__desc">
              Jouw inloggegevens en accountstatus.
            </p>
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
            <p className="dashboard-settings-section__desc">
              Standaardwaarden voor nieuwe advertenties.
            </p>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Standaard stad</span>
              <span className="dashboard-settings-row__placeholder">Nog niet ingesteld</span>
            </div>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Standaard taal</span>
              <span className="dashboard-settings-row__placeholder">Nederlands</span>
            </div>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Meldingen</span>
              <span className="dashboard-settings-row__placeholder">Binnenkort beschikbaar</span>
            </div>
          </section>

          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">Veiligheid</h2>
            <p className="dashboard-settings-section__desc">
              Beheer toegang tot jouw account.
            </p>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Wachtwoord wijzigen</span>
              <span className="dashboard-settings-row__placeholder">Binnenkort beschikbaar</span>
            </div>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Uitloggen</span>
              <UitloggenKnop />
            </div>
          </section>

          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">Publicatie-instellingen</h2>
            <p className="dashboard-settings-section__desc">
              Hoe jouw advertenties worden opgeslagen en gepubliceerd.
            </p>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Standaard status</span>
              <span className="dashboard-settings-row__value">Concept of direct publiceren</span>
            </div>
            <p className="dashboard-panel__text mt-2">
              Concepten zijn alleen zichtbaar voor jou. Na publiceren verschijnt je profiel
              als actieve advertentie op Veloura.
            </p>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">Verificatie</span>
              <span className="dashboard-settings-row__placeholder">Binnenkort beschikbaar</span>
            </div>
          </section>

          <div className="dashboard-quick-actions">
            <Link href="/dashboard" className="dashboard-btn dashboard-btn--secondary">
              Terug naar overzicht
            </Link>
            <Link href="/dashboard/advertenties" className="dashboard-btn dashboard-btn--outline">
              Mijn advertenties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
