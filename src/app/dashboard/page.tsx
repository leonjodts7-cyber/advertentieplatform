import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { Button } from "@/components/ui/button";
import type { Advertentie } from "@/lib/types";
import { haalAiLoungeStats } from "@/lib/ai/queries";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";
import { parseAdvertentieBeschrijving } from "@/lib/advertentie-metadata";
import { boostActief } from "@/lib/advertentie-boost";

function telActieveBoosts(ads: Pick<Advertentie, "beschrijving" | "status">[]): number {
  return ads.filter((a) => {
    if (a.status !== "actief") return false;
    const { meta } = parseAdvertentieBeschrijving(a.beschrijving ?? "");
    return boostActief(meta);
  }).length;
}

const PROFIEL_TIPS = [
  "Voeg meer foto's toe",
  "Voeg video toe",
  "Vul werktijden in",
  "Koop een boost",
];

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await zorgProfielBestaat(user.id, user.email ?? "");

  const [{ data: advertentiesRaw }, aiStats] = await Promise.all([
    supabase
      .from("advertenties")
      .select("id, status, premium, beschrijving, premium_tot")
      .eq("aanbieder_id", user.id),
    haalAiLoungeStats(user.id),
  ]);

  const advertenties = (advertentiesRaw ?? []) as Pick<
    Advertentie,
    "id" | "status" | "premium" | "beschrijving" | "premium_tot"
  >[];

  const totaal = advertenties.length;
  const actief = advertenties.filter((a) => a.status === "actief").length;
  const concept = advertenties.filter((a) => a.status === "concept").length;
  const premiumActief = advertenties.filter((a) => {
    if (a.status !== "actief") return false;
    if (a.premium) return true;
    const { meta } = parseAdvertentieBeschrijving(a.beschrijving ?? "");
    return boostActief(meta);
  }).length;

  const actieveBoosts = telActieveBoosts(advertenties);
  const premiumDagen = advertenties.reduce((max, a) => {
    if (!a.premium_tot) return max;
    const diff = Math.ceil(
      (new Date(a.premium_tot).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(max, diff > 0 ? diff : 0);
  }, 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div className="container">
          <DashboardSubnav />
          <h1 className="dashboard-page__title">Dashboard</h1>
          <p className="dashboard-page__subtitle">
            Beheer jouw advertenties en zichtbaarheid.
          </p>
        </div>
      </div>

      <div className="container dashboard-page__body">
        <div className="dashboard-quick-actions">
          <Button asChild variant="primary" size="sm">
            <Link href="/dashboard/advertenties/nieuw">Nieuwe advertentie</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard/advertenties">Mijn advertenties</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard/boosts">Boost kopen</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard/advertenties/nieuw">Profiel verbeteren</Link>
          </Button>
        </div>

        <section className="dashboard-panel">
          <h2 className="dashboard-panel__title">Jouw advertenties</h2>
          <div className="dashboard-mini-grid">
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">Totaal</span>
              <span className="dashboard-mini-stat__value">{totaal}</span>
            </div>
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">Actief</span>
              <span className="dashboard-mini-stat__value text-success">{actief}</span>
            </div>
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">Concept</span>
              <span className="dashboard-mini-stat__value">{concept}</span>
            </div>
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">Premium actief</span>
              <span className="dashboard-mini-stat__value">{premiumActief}</span>
            </div>
          </div>
        </section>

        <section className="dashboard-panel">
          <h2 className="dashboard-panel__title">Zichtbaarheid</h2>
          <div className="dashboard-mini-grid">
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">Actieve boosts</span>
              <span className="dashboard-mini-stat__value">{actieveBoosts}</span>
            </div>
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">Premium dagen</span>
              <span className="dashboard-mini-stat__value">{premiumDagen > 0 ? premiumDagen : "—"}</span>
            </div>
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">Credits</span>
              <span className="dashboard-mini-stat__value">{aiStats.resterendeCredits}</span>
            </div>
          </div>
        </section>

        <section className="dashboard-panel">
          <h2 className="dashboard-panel__title">Prestaties</h2>
          <div className="dashboard-mini-grid">
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">Views</span>
              <span className="dashboard-mini-stat__value">0</span>
            </div>
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">Contactkliks</span>
              <span className="dashboard-mini-stat__value">0</span>
            </div>
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-stat__label">WhatsApp-kliks</span>
              <span className="dashboard-mini-stat__value">0</span>
            </div>
          </div>
        </section>

        <section className="dashboard-panel">
          <h2 className="dashboard-panel__title">Verbeter je profiel</h2>
          <ul className="dashboard-tips">
            {PROFIEL_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section id="instellingen" className="dashboard-panel">
          <h2 className="dashboard-panel__title">Instellingen</h2>
          <p className="dashboard-panel__text">
            Account- en profielinstellingen komen binnenkort beschikbaar.
          </p>
        </section>
      </div>
    </div>
  );
}
