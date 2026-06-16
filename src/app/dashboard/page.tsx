import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import type { Advertentie } from "@/lib/types";
import { haalAiLoungeStats } from "@/lib/ai/queries";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";
import { parseAdvertentieBeschrijving } from "@/lib/advertentie-metadata";
import { boostActief } from "@/lib/advertentie-boost";

function fotoTipScore(
  ads: Pick<Advertentie, "beschrijving">[]
): number {
  return ads.reduce((sum, a) => {
    const { meta } = parseAdvertentieBeschrijving(a.beschrijving ?? "");
    const mediaCount = meta.mediaItems?.length ?? 0;
    return sum + Math.min(mediaCount * 2, 10);
  }, 0);
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
      .select("id, status, premium, beschrijving")
      .eq("aanbieder_id", user.id),
    haalAiLoungeStats(user.id),
  ]);

  const advertenties = (advertentiesRaw ?? []) as Pick<
    Advertentie,
    "id" | "status" | "premium" | "beschrijving"
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

  const views = 0;
  const contactKliks = 0;
  const whatsappKliks = 0;
  const profielscore = Math.min(100, actief * 20 + premiumActief * 15 + fotoTipScore(advertenties));

  const tips = [
    "Voeg meer foto's toe",
    "Voeg video toe",
    "Vul werktijden in",
    "Kies een boost voor meer zichtbaarheid",
  ];

  return (
    <div>
      <div className="page-header-band">
        <div className="container">
          <p className="text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Veloura Dashboard
          </p>
          <h1 className="section-title mt-1">Business center</h1>
          <p className="section-subtitle mt-1">
            Overzicht van je marketplace profielen en prestaties.
          </p>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Marketplace
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Totaal advertenties</p>
            <p className="mt-1 font-display text-3xl text-foreground">{totaal}</p>
          </div>
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Actief</p>
            <p className="mt-1 font-display text-3xl text-success">{actief}</p>
          </div>
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Concept</p>
            <p className="mt-1 font-display text-3xl text-champagne">{concept}</p>
          </div>
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Premium actief</p>
            <p className="mt-1 font-display text-3xl text-soft-champagne">{premiumActief}</p>
          </div>
        </div>

        <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Performance
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Views</p>
            <p className="mt-1 font-display text-3xl text-foreground">{views}</p>
          </div>
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Contactkliks</p>
            <p className="mt-1 font-display text-3xl text-foreground">{contactKliks}</p>
          </div>
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp-kliks</p>
            <p className="mt-1 font-display text-3xl text-foreground">{whatsappKliks}</p>
          </div>
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Profielscore</p>
            <p className="mt-1 font-display text-3xl text-champagne">{Math.round(profielscore)}</p>
          </div>
        </div>

        <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI tips
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {tips.map((tip) => (
            <li key={tip} className="profile-card px-4 py-3 text-sm text-muted-foreground">
              {tip}
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Lounge
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Gesprekken</p>
            <p className="mt-1 font-display text-3xl text-foreground">{aiStats.gesprekken}</p>
          </div>
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Gebruikte credits</p>
            <p className="mt-1 font-display text-3xl text-soft-champagne">{aiStats.gebruikteCredits}</p>
          </div>
          <div className="profile-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Resterende credits</p>
            <p className="mt-1 font-display text-3xl text-champagne">{aiStats.resterendeCredits}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          <Button asChild size="lg" variant="primary">
            <Link href="/dashboard/advertenties/nieuw">Nieuwe advertentie</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/dashboard/advertenties">Mijn advertenties</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/dashboard/advertenties/nieuw?stap=promotie">Boost kopen</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" disabled className="opacity-60">
            <span>AI profielhulp (later)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
