import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfilePhotoPlaceholder } from "@/components/profile-photo-placeholder";
import { beschikbaarLabel, formatPrijs } from "@/lib/helpers";
import type { Advertentie, AdvertentieFoto } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { MapPin } from "lucide-react";

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
    <Button asChild size="lg" variant="primary" className="w-full">
      <a href={`tel:${advertentie.telefoon}`}>Neem contact op</a>
    </Button>
  ) : (
    <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm text-muted-foreground">
      Geen contactgegevens beschikbaar
    </p>
  );

  return (
    <div className="pb-24 lg:pb-10">
      <div className="container py-4">
        <Link
          href="/zoeken"
          className="text-sm text-muted-foreground hover:text-soft-champagne"
        >
          ← Terug naar profielen
        </Link>
      </div>

      <div className="container">
        {fotos.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/12 sm:col-span-2 sm:aspect-auto sm:min-h-[320px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotos[0].url}
                alt={`Profiel ${advertentie.titel}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141014]/90 via-[#141014]/20 to-transparent" />
            </div>
            {fotos.length > 1 && (
              <div className="hidden gap-2 sm:grid">
                {fotos.slice(1, 3).map((foto) => (
                  <div
                    key={foto.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/12"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={foto.url} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/12 sm:aspect-[21/9]">
            <ProfilePhotoPlaceholder variant="warm-wine" className="!aspect-auto h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141014]/80 via-transparent to-transparent" />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="wine">
            <MapPin className="mr-1 inline h-3 w-3" />
            {advertentie.stad}
          </Badge>
          <Badge variant={advertentie.beschikbaar ? "online" : "muted"}>
            {beschikbaarLabel(advertentie.beschikbaar)}
          </Badge>
          {advertentie.geverifieerd && (
            <Badge variant="verified">Geverifieerd</Badge>
          )}
          {advertentie.geverifieerd && (
            <Badge variant="premium">Premium</Badge>
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
              <span className="font-semibold text-soft-champagne">
                {formatPrijs(advertentie.prijs_vanaf)}
              </span>
            </p>

            <div className="profile-card mt-6 p-5 sm:p-7">
              <h2 className="form-label">Over dit profiel</h2>
              <p className="prose-advertentie mt-3">{advertentie.beschrijving}</p>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-muted-foreground/80">
              Alle aanbieders moeten 18+ zijn. Illegale inhoud, misleiding en
              gedwongen activiteiten zijn verboden.
            </p>
          </article>

          <aside className="mt-6 lg:mt-0">
            <div className="glass-card lg:sticky lg:top-[4.5rem] p-5 sm:p-6">
              <p className="font-display text-lg text-foreground">Contact</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Neem discreet contact op voor een afspraak.
              </p>
              {advertentie.telefoon && (
                <p className="mt-4 font-display text-2xl text-soft-champagne">
                  {advertentie.telefoon}
                </p>
              )}
              <div className="mt-5 hidden lg:block">{contactKnop}</div>
              <div className="divider-soft mt-6" />
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Stad</dt>
                  <dd className="text-foreground">{advertentie.stad}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Leeftijd</dt>
                  <dd>{advertentie.leeftijd} jaar</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Prijs vanaf</dt>
                  <dd className="font-semibold text-soft-champagne">
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
