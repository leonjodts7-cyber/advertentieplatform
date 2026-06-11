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
    description: `Profiel in ${advertentie.stad} op Veloura. Alleen 18+.`,
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
    <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-veloura-soft">
      Geen contactgegevens beschikbaar
    </p>
  );

  return (
    <div className="pb-24 lg:pb-10">
      <div className="container py-4">
        <Link
          href="/zoeken"
          className="text-sm text-veloura-soft hover:text-veloura-champagne"
        >
          ← Terug naar advertenties
        </Link>
      </div>

      <div className="container">
        {fotos.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 sm:col-span-2 sm:aspect-auto sm:min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotos[0].url}
                alt={`Profiel ${advertentie.titel}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-veloura-bg/70 to-transparent" />
            </div>
            {fotos.length > 1 && (
              <div className="hidden gap-2 sm:grid">
                {fotos.slice(1, 3).map((foto) => (
                  <div
                    key={foto.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={foto.url} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="thumbnail-gradient relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 soft-gradient sm:aspect-[21/9]" />
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="rose">{advertentie.stad}</Badge>
          <Badge variant={advertentie.beschikbaar ? "green" : "muted"}>
            {beschikbaarLabel(advertentie.beschikbaar)}
          </Badge>
          {advertentie.geverifieerd && (
            <Badge variant="champagne">Geverifieerd</Badge>
          )}
          <Badge variant="muted">18+</Badge>
        </div>
      </div>

      <div className="container mt-6 lg:mt-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <article className="lg:col-span-2">
            <h1 className="font-display text-2xl font-medium text-veloura-ivory sm:text-3xl lg:text-4xl">
              {advertentie.titel}
            </h1>
            <p className="mt-2 text-sm text-veloura-soft">
              {advertentie.leeftijd} jaar · {advertentie.stad} ·{" "}
              <span className="font-medium text-veloura-champagne">
                {formatPrijs(advertentie.prijs_vanaf)}
              </span>
            </p>

            <div className="luxury-card mt-6 p-5 sm:p-7">
              <h2 className="form-label">Over dit profiel</h2>
              <p className="prose-advertentie mt-3">{advertentie.beschrijving}</p>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-veloura-soft/60">
              Alle aanbieders moeten 18+ zijn. Illegale inhoud, misleiding en
              gedwongen activiteiten zijn verboden.
            </p>
          </article>

          <aside className="mt-6 lg:mt-0">
            <div className="luxury-card lg:sticky lg:top-[4.5rem] p-5 sm:p-6">
              <p className="font-display text-lg text-veloura-ivory">Contact</p>
              <p className="mt-1 text-sm text-veloura-soft">
                Neem discreet contact op met de aanbieder.
              </p>
              {advertentie.telefoon && (
                <p className="mt-4 font-display text-2xl text-veloura-champagne">
                  {advertentie.telefoon}
                </p>
              )}
              <div className="mt-5 hidden lg:block">{contactKnop}</div>
              <div className="divider-soft mt-6" />
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-veloura-soft">Stad</dt>
                  <dd className="text-veloura-ivory">{advertentie.stad}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-veloura-soft">Leeftijd</dt>
                  <dd>{advertentie.leeftijd} jaar</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-veloura-soft">Prijs vanaf</dt>
                  <dd className="text-veloura-champagne">
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
