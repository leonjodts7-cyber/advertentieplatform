import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import type { Advertentie } from "@/lib/types";
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

  if (!user) {
    redirect("/login");
  }

  await zorgProfielBestaat(user.id, user.email ?? "");

  const { data: advertentiesRaw } = await supabase
    .from("advertenties")
    .select("id, status")
    .eq("aanbieder_id", user.id);

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
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-champagne">
            Jouw account
          </p>
          <h1 className="section-title mt-2">Dashboard</h1>
          <p className="section-subtitle mt-2">
            Welkom terug! Beheer hier jouw advertenties en profiel.
          </p>
        </div>
      </div>

      <div className="container py-8 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Totaal
            </p>
            <p className="mt-2 font-display text-4xl font-medium text-foreground">
              {totaal}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Jouw advertenties
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Actief
            </p>
            <p className="mt-2 font-display text-4xl font-medium text-champagne">
              {actief}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Live advertenties
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              In beoordeling
            </p>
            <p className="mt-2 font-display text-4xl font-medium text-amber-400">
              {inReview}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Wachten op goedkeuring
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard/advertenties">Mijn advertenties</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard/advertenties/nieuw">Nieuwe advertentie</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
