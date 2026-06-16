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

function fotoTipScore(ads: Pick<Advertentie, "beschrijving">[]): number {
  return ads.reduce((sum, a) => {
    const { meta } = parseAdvertentieBeschrijving(a.beschrijving ?? "");
    const mediaCount = meta.mediaItems?.length ?? 0;
    return sum + Math.min(mediaCount * 2, 10);
  }, 0);
}

function telActieveBoosts(ads: Pick<Advertentie, "beschrijving" | "status">[]): number {
  return ads.filter((a) => {
    if (a.status !== "actief") return false;
    const { meta } = parseAdvertentieBeschrijving(a.beschrijving ?? "");
    return boostActief(meta);
  }).length;
}

function aanbevolenActie(
  actief: number,
  actieveBoosts: number,
  concept: number
): string {
  if (actief === 0 && concept > 0) return "Publiceer een concept om zichtbaar te worden";
  if (actieveBoosts === 0 && actief > 0) return "Kies een boost voor meer zichtbaarheid";
  if (actief === 0) return "Plaats je eerste advertentie";
  return "Voeg meer foto's en video toe";
}

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

  const views = 0;
  const contactKliks = 0;
  const whatsappKliks = 0;
  const profielscore = Math.min(
    100,
    actief * 20 + premiumActief * 15 + fotoTipScore(advertenties)
  );

  return (
    <div>
      <div className="page-header-band">
        <div className="container">
          <DashboardSubnav />
          <h1 className="section-title mt-4">Business center</h1>
          <p className="section-subtitle mt-1">
            Beheer jouw advertenties, zichtbaarheid en prestaties.
          </p>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
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

        <h2 className="dashboard-section-label">Marketplace</h2>
        <div className="dashboard-stat-grid">
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Totaal advertenties</p>
            <p className="dashboard-stat-value">{totaal}</p>
          </div>
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Actief</p>
            <p className="dashboard-stat-value text-success">{actief}</p>
          </div>
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Concept</p>
            <p className="dashboard-stat-value text-champagne">{concept}</p>
          </div>
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Premium actief</p>
            <p className="dashboard-stat-value text-soft-champagne">{premiumActief}</p>
          </div>
        </div>

        <h2 className="dashboard-section-label mt-8">Performance</h2>
        <div className="dashboard-stat-grid">
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Views</p>
            <p className="dashboard-stat-value">{views}</p>
          </div>
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Contactkliks</p>
            <p className="dashboard-stat-value">{contactKliks}</p>
          </div>
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">WhatsApp-kliks</p>
            <p className="dashboard-stat-value">{whatsappKliks}</p>
          </div>
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Profielscore</p>
            <p className="dashboard-stat-value text-champagne">{Math.round(profielscore)}</p>
          </div>
        </div>

        <h2 className="dashboard-section-label mt-8">Zichtbaarheid</h2>
        <div className="dashboard-stat-grid">
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Actieve boosts</p>
            <p className="dashboard-stat-value">{actieveBoosts}</p>
          </div>
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Premium dagen resterend</p>
            <p className="dashboard-stat-value">{premiumDagen > 0 ? premiumDagen : "—"}</p>
          </div>
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Credits</p>
            <p className="dashboard-stat-value">{aiStats.resterendeCredits}</p>
          </div>
          <div className="profile-card p-5">
            <p className="dashboard-stat-label">Aanbevolen actie</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {aanbevolenActie(actief, actieveBoosts, concept)}
            </p>
          </div>
        </div>

        <section id="instellingen" className="mt-10 profile-card p-5">
          <h2 className="font-display text-lg text-foreground">Instellingen</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Account- en profielinstellingen komen binnenkort beschikbaar.
          </p>
        </section>
      </div>
    </div>
  );
}
