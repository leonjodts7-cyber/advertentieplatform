import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import { Button } from "@/components/ui/button";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mijn advertenties",
};

export default async function DashboardAdvertentiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: advertentiesRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("aanbieder_id", user.id)
    .order("aangemaakt_op", { ascending: false });

  const advertenties = (advertentiesRaw ?? []) as Advertentie[];

  return (
    <div className="container py-8 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            ← Dashboard
          </Link>
          <h1 className="section-title mt-2">Mijn advertenties</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Beheer al jouw concepten, advertenties in beoordeling en actieve
            listings.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/advertenties/nieuw">Nieuwe advertentie</Link>
        </Button>
      </div>

      {advertenties.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {advertenties.map((advertentie) => (
            <AdvertentieCard
              key={advertentie.id}
              advertentie={advertentie}
              dashboard
            />
          ))}
        </div>
      ) : (
        <div className="card-premium mt-8 p-8 text-center">
          <p className="text-muted-foreground">
            Je hebt nog geen advertenties. Maak je eerste advertentie aan.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/advertenties/nieuw">
              Nieuwe advertentie
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
