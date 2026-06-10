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

  return (
    <div className="container py-8 sm:py-12">
      <h1 className="section-title">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welkom terug! Beheer hier jouw advertenties.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card-premium p-6">
          <p className="text-sm text-muted-foreground">Jouw advertenties</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{totaal}</p>
        </div>
        <div className="card-premium p-6">
          <p className="text-sm text-muted-foreground">Actieve advertenties</p>
          <p className="mt-1 text-3xl font-bold text-primary">{actief}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/dashboard/advertenties">Mijn advertenties</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/dashboard/advertenties/nieuw">
            Nieuwe advertentie
          </Link>
        </Button>
      </div>
    </div>
  );
}
