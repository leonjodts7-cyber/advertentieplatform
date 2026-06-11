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

  if (!advertentie) return { title: "Profiel niet gevonden" };

  return {
    title: advertentie.titel,
    description: `Profiel in ${advertentie.stad} op RedLight. Alleen 18+.`,
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
  if (!advertentie) notFound();

  const { data: fotosRaw } = await supabase
    .from("advertentie_fotos")
    .select("*")
    .eq("advertentie_id", id)
    .order("volgorde", { ascending: true });

  const fotos = (fotosRaw ?? []) as AdvertentieFoto[];

  const contactKnop = advertentie.telefoon ? (
    <Button asChild size="lg" className="w-full">
      <a href={`tel:${advertentie.telefoon}`}>Contacteer aanbieder</a>
    </Button>
  ) : (
    <p className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center text-sm text-muted-foreground">
      Geen contactgegevens beschikbaar
    </p>
  );

  return (
    <div className="pb-24 lg:pb-10">
      <div className="container py-4 sm:py-5">
        <Link
          href="/zoeken"
          className="text-sm text-muted-foreground hover:text-champagne"
        >
          ← Terug naar advertenties
        </Link>
      </div>

      {/* Cover */}
      <div className="container">
        {fotos.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/50 sm:col-span-2 sm:aspect-auto sm:min-h-[320px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotos[0].url}
                alt={`Profiel ${advertentie.titel}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            {fotos.length > 1 && (
              <div className="hidden gap-2 sm:grid">
                {fotos.slice(1, 3).map((foto) => (
                  <div
                    key={foto.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={foto.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="gradient-placeholder relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/50 gold-gradient sm:aspect-[21/9]">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="bordeaux">{advertentie.stad}</Badge>
          <Badge variant={advertentie.beschikbaar ? "green" : "muted"}>
            {beschikbaarLabel(advertentie.beschikbaar)}
          </Badge>
          {advertentie.geverifieerd && (
            <Badge variant="gold">Geverifieerd</Badge>
          )}
          <Badge variant="muted">18+</Badge>
        </div>
      </div>

      <div className="container mt-6 lg:mt-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <article className="lg:col-span-2">
            <h1 className="font-display text-2xl font-medium text-foreground sm:text-3xl lg:text-4xl">
              {advertentie.titel}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {advertentie.leeftijd} jaar · {advertentie.stad} ·{" "}
              <span className="font-semibold text-champagne">
                {formatPrijs(advertentie.prijs_vanaf)}
              </span>
            </p>

            <div className="premium-card mt-6 p-5 sm:p-7">
              <h2 className="form-label">Over dit profiel</h2>
              <p className="prose-advertentie mt-3">
                {advertentie.beschrijving}
              </p>
            </div>

            {fotos.length > 3 && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {fotos.slice(3).map((foto) => (
                  <div
                    key={foto.id}
                    className="relative aspect-square overflow-hidden rounded-xl border border-border/50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={foto.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <p className="mt-8 text-[0.6875rem] leading-relaxed text-muted-foreground/60">
              Alle aanbieders moeten 18+ zijn. Illegale inhoud, misleiding en
              gedwongen activiteiten zijn verboden. Respecteer de privacy van
              de aanbieder.
            </p>
          </article>

          <aside className="mt-6 lg:mt-0">
            <div className="premium-card lg:sticky lg:top-[4.5rem] p-5 sm:p-6">
              <p className="font-display text-lg text-foreground">Contact</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Neem discreet contact op met de aanbieder.
              </p>

              {advertentie.telefoon && (
                <p className="mt-4 font-display text-2xl text-champagne">
                  {advertentie.telefoon}
                </p>
              )}

              <div className="mt-5 hidden lg:block">{contactKnop}</div>

              <div className="divider-gold mt-6" />
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Stad</dt>
                  <dd>{advertentie.stad}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Leeftijd</dt>
                  <dd>{advertentie.leeftijd} jaar</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Prijs vanaf</dt>
                  <dd className="text-champagne">
                    {formatPrijs(advertentie.prijs_vanaf)}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>

      {advertentie.telefoon && (
        <div className="mobile-contact-bar">{contactKnop}</div>
      )}
    </div>
  );
}
