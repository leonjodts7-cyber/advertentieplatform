import Link from "next/link";
import type { Metadata } from "next";
import { AdvertentieCard } from "@/components/advertentie-card";
import { QuickCityLinks } from "@/components/quick-city-links";
import { ZoekFormulier } from "@/components/zoek-formulier";
import { Button } from "@/components/ui/button";
import type { Advertentie } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Advertenties",
  description: "Zoek premium advertenties op stad. Alleen 18+.",
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
    <div>
      <div className="page-header-band">
        <div className="container">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-champagne">
            Ontdek
          </p>
          <h1 className="section-title mt-2">Advertenties</h1>
          <p className="section-subtitle mt-2 max-w-xl">
            Vind actieve profielen in jouw stad. Alleen voor volwassenen 18+.
          </p>
        </div>
      </div>

      <div className="container py-8 sm:py-10">
        <div className="card-premium mx-auto max-w-2xl p-5 sm:p-6">
          <h2 className="form-label mb-4">Zoek op stad</h2>
          <ZoekFormulier standaardStad={stad ?? ""} compact inputId="zoek-stad" />
          <p className="mt-4 text-xs text-muted-foreground">Snel zoeken:</p>
          <QuickCityLinks className="mt-2" size="sm" />
        </div>

        <div className="mt-10">
          {stad?.trim() ? (
            <p className="mb-6 text-sm text-muted-foreground">
              <span className="text-foreground">{advertenties.length}</span>{" "}
              resultaten voor &ldquo;{stad.trim()}&rdquo;
            </p>
          ) : (
            <p className="mb-6 text-sm text-muted-foreground">
              <span className="text-foreground">{advertenties.length}</span>{" "}
              actieve advertenties
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
            <div className="card-premium relative mx-auto max-w-lg overflow-hidden p-10 text-center">
              <div className="gradient-placeholder-gold absolute inset-0 opacity-15" />
              <div className="relative">
                <p className="font-display text-xl text-foreground">
                  Geen resultaten gevonden
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stad?.trim()
                    ? `Geen actieve advertenties voor "${stad.trim()}".`
                    : "Er zijn nog geen actieve advertenties."}
                </p>
                <QuickCityLinks className="mt-4 flex justify-center" size="sm" />
                <Button asChild className="mt-6">
                  <Link href="/dashboard/advertenties/nieuw">
                    Plaats advertentie
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
