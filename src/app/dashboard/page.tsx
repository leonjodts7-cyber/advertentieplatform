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

  if (!user) redirect("/login");

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
          <p className="text-[0.6875rem] uppercase tracking-wider text-veloura-soft">
            Veloura Dashboard
          </p>
          <h1 className="section-title mt-1">Welkom terug</h1>
          <p className="section-subtitle mt-1">
            Beheer jouw profielen en advertenties.
          </p>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-veloura-soft">Totaal</p>
            <p className="mt-1 font-display text-3xl text-veloura-ivory">{totaal}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-veloura-soft">Actief</p>
            <p className="mt-1 font-display text-3xl text-emerald-300/90">{actief}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-veloura-soft">
              In beoordeling
            </p>
            <p className="mt-1 font-display text-3xl text-veloura-champagne">
              {inReview}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/dashboard/advertenties"
            className="luxury-card group p-5 transition-colors hover:border-veloura-champagne/25"
          >
            <p className="font-display text-lg text-veloura-ivory group-hover:text-veloura-champagne">
              Mijn advertenties
            </p>
            <p className="mt-1 text-sm text-veloura-soft">
              Bekijk en bewerk al jouw listings
            </p>
          </Link>
          <Link
            href="/dashboard/advertenties/nieuw"
            className="luxury-card group border-veloura-champagne/15 p-5 hover:border-veloura-champagne/30"
          >
            <p className="font-display text-lg text-veloura-champagne">
              + Nieuwe advertentie
            </p>
            <p className="mt-1 text-sm text-veloura-soft">
              Plaats een nieuw profiel
            </p>
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/zoeken">Bekijk marketplace</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
