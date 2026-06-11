import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { beschikbaarLabel, formatPrijs } from "@/lib/helpers";
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

  const advertentie = advertentieRaw as Pick<
    Advertentie,
    "titel" | "stad"
  > | null;

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
  const heeftFotos = fotos.length > 0;

  return (
    <div className="pb-24 lg:pb-12">
      <div className="container py-6 sm:py-8">
        <Link
          href="/zoeken"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          ← Terug naar advertenties
        </Link>
      </div>

      {/* Gallery */}
      <div className="container">
        {heeftFotos ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fotos.map((foto, i) => (
              <div
                key={foto.id}
                className={`relative overflow-hidden rounded-2xl border border-border/60 ${
                  i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                }`}
              >
                <div
                  className={`relative ${i === 0 ? "aspect-[16/10] sm:aspect-auto sm:min-h-[360px]" : "aspect-[4/3]"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto.url}
                    alt={`Foto bij ${advertentie.titel}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="gradient-placeholder relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-bordeaux/70 via-bordeaux-light/50 to-champagne/25 sm:aspect-[21/9]">
            <div className="absolute inset-0 flex items-end p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge variant="bordeaux">{advertentie.stad}</Badge>
                {advertentie.geverifieerd && (
                  <Badge variant="gold">Geverifieerd</Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container mt-8 lg:mt-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          <article className="lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-medium tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {advertentie.titel}
                </h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="bordeaux">{advertentie.stad}</Badge>
                  {advertentie.geverifieerd && (
                    <Badge variant="gold">Geverifieerd</Badge>
                  )}
                  <Badge
                    variant={advertentie.beschikbaar ? "success" : "muted"}
                  >
                    {beschikbaarLabel(advertentie.beschikbaar)}
                  </Badge>
                </div>
              </div>
              <p className="font-display text-2xl text-champagne sm:text-3xl">
                {formatPrijs(advertentie.prijs_vanaf)}
              </p>
            </div>

            <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
              <span>{advertentie.leeftijd} jaar</span>
              <span aria-hidden="true">·</span>
              <span>{advertentie.stad}</span>
            </div>

            <div className="card-premium mt-8 p-6 sm:p-8">
              <h2 className="form-label">Beschrijving</h2>
              <p className="prose-advertentie mt-3">
                {advertentie.beschrijving}
              </p>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-muted-foreground/70">
              Alle aanbieders moeten 18+ zijn. Illegale inhoud, misleiding en
              gedwongen activiteiten zijn verboden. Respecteer de privacy van de
              aanbieder.
            </p>
          </article>

          {/* Desktop sticky contact */}
          <aside className="mt-8 lg:mt-0">
            <div className="card-premium lg:sticky lg:top-20 p-6">
              <h2 className="font-display text-lg font-medium text-foreground">
                Contact
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Neem rechtstreeks contact op met de aanbieder.
              </p>

              {advertentie.telefoon ? (
                <Button asChild size="lg" className="mt-5 w-full">
                  <a href={`tel:${advertentie.telefoon}`}>
                    Bel {advertentie.telefoon}
                  </a>
                </Button>
              ) : (
                <p className="mt-5 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                  Geen telefoonnummer beschikbaar.
                </p>
              )}

              <div className="divider-gold mt-6" />

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Stad</dt>
                  <dd className="text-foreground">{advertentie.stad}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Leeftijd</dt>
                  <dd className="text-foreground">{advertentie.leeftijd} jaar</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Prijs vanaf</dt>
                  <dd className="font-medium text-champagne">
                    {formatPrijs(advertentie.prijs_vanaf)}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky contact */}
      {advertentie.telefoon && (
        <div className="mobile-contact-bar">
          <Button asChild size="lg" className="w-full">
            <a href={`tel:${advertentie.telefoon}`}>
              Neem contact op — {advertentie.telefoon}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
