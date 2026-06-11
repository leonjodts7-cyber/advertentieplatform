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
    <div>
      <div className="page-header-band">
        <div className="container">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-champagne"
          >
            ← Dashboard
          </Link>
          <h1 className="section-title mt-3">Mijn advertenties</h1>
          <p className="section-subtitle mt-2">
            Beheer concepten, advertenties in beoordeling en actieve listings.
          </p>
        </div>
      </div>

      <div className="container py-8 sm:py-10">
        <div className="mb-8 flex justify-end">
          <Button asChild>
            <Link href="/dashboard/advertenties/nieuw">+ Nieuwe advertentie</Link>
          </Button>
        </div>

        {advertenties.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advertenties.map((advertentie) => (
              <AdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
                dashboard
              />
            ))}
          </div>
        ) : (
          <div className="card-premium relative overflow-hidden p-10 text-center sm:p-14">
            <div className="gradient-placeholder-gold absolute inset-0 opacity-15" />
            <div className="relative">
              <p className="font-display text-xl text-foreground">
                Nog geen advertenties
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Maak je eerste premium profiel aan en bereik bezoekers in jouw
                regio.
              </p>
              <Button asChild className="mt-6">
                <Link href="/dashboard/advertenties/nieuw">
                  Nieuwe advertentie
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
