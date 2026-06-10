import Link from "next/link";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import { ZoekFormulier } from "@/components/zoek-formulier";
import { Button } from "@/components/ui/button";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Zoeken",
  description: "Zoek actieve advertenties op stad.",
};

interface ZoekenPageProps {
  searchParams: Promise<{ stad?: string }>;
}

export default async function ZoekenPage({ searchParams }: ZoekenPageProps) {
  const { stad } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("advertenties")
    .select("*")
    .eq("status", "actief")
    .order("aangemaakt_op", { ascending: false });

  if (stad?.trim()) {
    query = query.ilike("stad", `%${stad.trim()}%`);
  }

  const { data: advertentiesRaw } = await query;
  const advertenties = (advertentiesRaw ?? []) as Advertentie[];

  return (
    <div className="container py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="section-title">Zoek advertenties</h1>
        <p className="mt-2 text-muted-foreground">
          Vind actieve advertenties in jouw stad. Alleen voor volwassenen 18+.
        </p>

        <div className="card-premium mt-8 p-6">
          <ZoekFormulier standaardStad={stad ?? ""} compact />
        </div>
      </div>

      <div className="mt-10">
        {stad?.trim() && (
          <p className="mb-6 text-sm text-muted-foreground">
            Resultaten voor &ldquo;{stad.trim()}&rdquo;
            {advertenties ? ` (${advertenties.length})` : ""}
          </p>
        )}

        {advertenties.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advertenties.map((advertentie) => (
              <AdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
              />
            ))}
          </div>
        ) : (
          <div className="card-premium mx-auto max-w-lg p-8 text-center">
            <p className="text-muted-foreground">
              Geen actieve advertenties gevonden
              {stad?.trim() ? ` voor "${stad.trim()}"` : ""}.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/advertenties/nieuw">
                Plaats de eerste advertentie
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
