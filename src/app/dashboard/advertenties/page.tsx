import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import { Button } from "@/components/ui/button";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
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

  if (!user) redirect("/login");

  const { data: advertentiesRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("aanbieder_id", user.id)
    .order("aangemaakt_op", { ascending: false });

  const advertenties = (advertentiesRaw ?? []) as Advertentie[];
  const fotos = await haalEersteFotos(
    supabase,
    advertenties.map((a) => a.id)
  );

  return (
    <div>
      <div className="page-header-band">
        <div className="container">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-champagne"
          >
            ← Dashboard
          </Link>
          <h1 className="section-title mt-2">Mijn advertenties</h1>
          <p className="section-subtitle mt-1">
            Concept · In beoordeling · Actief
          </p>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        <div className="mb-5 flex justify-end">
          <Button asChild>
            <Link href="/dashboard/advertenties/nieuw">+ Nieuwe advertentie</Link>
          </Button>
        </div>

        {advertenties.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {advertenties.map((advertentie) => (
              <AdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
                dashboard
                afbeeldingUrl={fotos.get(advertentie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="premium-card p-8 text-center sm:p-12">
            <p className="font-display text-xl text-foreground">
              Nog geen advertenties
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Start met je eerste premium listing op RedLight.
            </p>
            <Button asChild className="mt-5">
              <Link href="/dashboard/advertenties/nieuw">Nieuwe advertentie</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
