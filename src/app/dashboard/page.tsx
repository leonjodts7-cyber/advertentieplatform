import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import type { Advertentie } from "@/lib/types";
import { haalAiLoungeStats } from "@/lib/ai/queries";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";

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
      .select("id, status")
      .eq("aanbieder_id", user.id),
    haalAiLoungeStats(user.id),
  ]);

  const advertenties = (advertentiesRaw ?? []) as Pick<
    Advertentie,
    "id" | "status"
  >[];

  const totaal = advertenties.length;
  const actief = advertenties.filter((a) => a.status === "actief").length;
  const inReview = advertenties.filter((a) => a.status === "in_review").length;

  return (
    <div>
      <div className="page-header-band">
        <div className="container">
          <p className="text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Veloura Dashboard
          </p>
          <h1 className="section-title mt-1">Welkom terug</h1>
          <p className="section-subtitle mt-1">
            Beheer jouw profielen als aanbieder en AI Lounge.
          </p>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Marketplace
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Totaal
            </p>
            <p className="mt-1 font-display text-3xl text-foreground">
              {totaal}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Actief
            </p>
            <p className="mt-1 font-display text-3xl text-success">{actief}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              In beoordeling
            </p>
            <p className="mt-1 font-display text-3xl text-champagne">
              {inReview}
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Lounge
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Gesprekken
            </p>
            <p className="mt-1 font-display text-3xl text-foreground">
              {aiStats.gesprekken}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Gebruikte credits
            </p>
            <p className="mt-1 font-display text-3xl text-wine-light">
              {aiStats.gebruikteCredits}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Resterende credits
            </p>
            <p className="mt-1 font-display text-3xl text-champagne-light">
              {aiStats.resterendeCredits}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/advertenties"
            className="luxury-card group p-5 transition-all hover:border-champagne/25 hover:shadow-glow"
          >
            <p className="font-display text-lg text-foreground group-hover:text-champagne-light">
              Mijn advertenties
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Bekijk en bewerk al jouw profielen
            </p>
          </Link>
          <Link
            href="/ai-lounge"
            className="velvet-card group p-5 transition-all hover:border-champagne/20 hover:shadow-glow"
          >
            <p className="font-display text-lg text-champagne-light">
              AI Lounge
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Chat met fictieve AI Companions
            </p>
          </Link>
          <Link
            href="/credits"
            className="luxury-card group p-5 transition-all hover:border-champagne/25 hover:shadow-glow sm:col-span-2 lg:col-span-1"
          >
            <p className="font-display text-lg text-foreground group-hover:text-champagne-light">
              Credits kopen
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {aiStats.resterendeCredits} credits beschikbaar
            </p>
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button asChild size="lg" variant="primary" className="w-full sm:w-auto">
            <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/ai-lounge">Open AI Lounge</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
