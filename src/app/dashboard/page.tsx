import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardSubnav } from "@/components/dashboard-subnav";
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
  { text: "Voeg meer foto's toe", href: "/dashboard/advertenties" },
  { text: "Voeg video toe", href: "/dashboard/advertenties" },
  { text: "Vul werktijden in", href: "/dashboard/advertenties" },
  { text: "Koop een boost", href: "/dashboard/boosts" },
] as const;

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

  const verbeterTarget =
    advertenties.find((a) => a.status === "concept") ??
    advertenties.find((a) => a.status === "actief");
  const verbeterHref = verbeterTarget
    ? `/dashboard/advertenties/${verbeterTarget.id}/bewerken?stap=media`
    : "/dashboard/advertenties/nieuw";

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
          <Link href="/dashboard/advertenties/nieuw" className="dashboard-btn dashboard-btn--primary">
            Nieuwe advertentie
          </Link>
          <Link href="/dashboard/advertenties" className="dashboard-btn dashboard-btn--secondary">
            Mijn advertenties
          </Link>
          <Link href="/dashboard/boosts" className="dashboard-btn dashboard-btn--secondary">
            Boost instellen
          </Link>
          <Link href={verbeterHref} className="dashboard-btn dashboard-btn--outline">
            Profiel verbeteren
          </Link>
        </div>

        <div className="dashboard-panels">
          <section className="dashboard-panel">
            <h2 className="dashboard-panel__title">Jouw advertenties</h2>
            <div className="dashboard-mini-grid">
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">Totaal</span>
                <span className="dashboard-mini-stat__value">{totaal}</span>
              </div>
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">Actief</span>
                <span className="dashboard-mini-stat__value dashboard-mini-stat__value--success">
                  {actief}
                </span>
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
            <div className="dashboard-mini-grid dashboard-mini-grid--2">
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">Actieve boosts</span>
                <span className="dashboard-mini-stat__value">{actieveBoosts}</span>
              </div>
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">Premium dagen</span>
                <span className="dashboard-mini-stat__value">
                  {premiumDagen > 0 ? premiumDagen : "—"}
                </span>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <h2 className="dashboard-panel__title">AI Lounge</h2>
            <p className="dashboard-panel__text">
              {aiStats.resterendeCredits} credits beschikbaar voor AI-chat.
            </p>
            <div className="dashboard-quick-actions dashboard-quick-actions--inline mt-3">
              <Link href="/ai-lounge" className="dashboard-btn dashboard-btn--secondary dashboard-btn--sm">
                Naar AI Lounge
              </Link>
              <Link href="/credits" className="dashboard-btn dashboard-btn--outline dashboard-btn--sm">
                Credits kopen
              </Link>
            </div>
          </section>

          <section className="dashboard-panel">
            <h2 className="dashboard-panel__title">Prestaties</h2>
            <p className="dashboard-panel__text dashboard-panel__text--muted">
              Statistieken worden binnenkort beschikbaar.
            </p>
          </section>

          <section className="dashboard-panel">
            <h2 className="dashboard-panel__title">Verbeter je profiel</h2>
            <ul className="dashboard-tips">
              {PROFIEL_TIPS.map((tip) => (
                <li key={tip.text}>
                  <Link href={tip.href} className="dashboard-tip-link">
                    {tip.text} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="dashboard-panel dashboard-panel--full">
            <h2 className="dashboard-panel__title">Instellingen</h2>
            <p className="dashboard-panel__text">
              Beheer account, profiel en publicatievoorkeuren.
            </p>
            <Link href="/dashboard/instellingen" className="dashboard-btn dashboard-btn--secondary dashboard-btn--sm mt-3">
              Naar instellingen
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
