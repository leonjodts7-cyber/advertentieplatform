import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  beschikbaarLabel,
  formatPrijs,
} from "@/lib/helpers";
import type { Advertentie, AdvertentieFoto } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

interface AdvertentieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdvertentieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: advertentieRaw } = await supabase
    .from("advertenties")
    .select("titel, stad")
    .eq("id", id)
    .eq("status", "actief")
    .maybeSingle();

  const advertentie = advertentieRaw as Pick<Advertentie, "titel" | "stad"> | null;

  if (!advertentie) {
    return { title: "Advertentie niet gevonden" };
  }

  return {
    title: advertentie.titel,
    description: `Advertentie in ${advertentie.stad}. Alleen 18+.`,
  };
}

export default async function AdvertentieDetailPage({
  params,
}: AdvertentieDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: advertentieRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("id", id)
    .eq("status", "actief")
    .maybeSingle();

  const advertentie = advertentieRaw as Advertentie | null;

  if (!advertentie) {
    notFound();
  }

  const { data: fotosRaw } = await supabase
    .from("advertentie_fotos")
    .select("*")
    .eq("advertentie_id", id)
    .order("volgorde", { ascending: true });

  const fotos = (fotosRaw ?? []) as AdvertentieFoto[];

  return (
    <div className="container py-8 sm:py-12">
      <Link
        href="/zoeken"
        className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        ← Terug naar zoeken
      </Link>

      <article className="mt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {advertentie.titel}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{advertentie.stad}</span>
              <span aria-hidden="true">·</span>
              <span>{advertentie.leeftijd} jaar</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-primary">
                {formatPrijs(advertentie.prijs_vanaf)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {advertentie.geverifieerd && (
              <Badge variant="success">Geverifieerd</Badge>
            )}
            <Badge variant={advertentie.beschikbaar ? "success" : "muted"}>
              {beschikbaarLabel(advertentie.beschikbaar)}
            </Badge>
          </div>
        </div>

        {fotos.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fotos.map((foto) => (
              <div
                key={foto.id}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto.url}
                  alt={`Foto bij ${advertentie.titel}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="card-premium mt-8 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">
            Beschrijving
          </h2>
          <p className="prose-advertentie mt-4">{advertentie.beschrijving}</p>
        </div>

        {advertentie.telefoon && (
          <div className="mt-8">
            <Button asChild size="lg">
              <a href={`tel:${advertentie.telefoon}`}>
                Neem contact op — {advertentie.telefoon}
              </a>
            </Button>
          </div>
        )}

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
          Alle aanbieders moeten 18+ zijn. Illegale inhoud, misleiding en
          gedwongen activiteiten zijn verboden. Neem contact op via de
          vermelde gegevens en respecteer de privacy van de aanbieder.
        </p>
      </article>
    </div>
  );
}
