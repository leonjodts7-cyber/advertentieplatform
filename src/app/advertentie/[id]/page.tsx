import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
import { ProfilePhotoPlaceholder } from "@/components/profile-photo-placeholder";
import {
  BESCHIKBAARHEID_OPTIES,
  categorieLabel,
  alleMogelijkheden,
  parseAdvertentieBeschrijving,
} from "@/lib/advertentie-metadata";
import { boostActief, boostLabel } from "@/lib/advertentie-boost";
import { beschikbaarLabel, formatPrijs } from "@/lib/helpers";
import type { Advertentie, AdvertentieFoto } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { MapPin, Phone } from "lucide-react";

interface AdvertentieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdvertentieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("advertenties")
    .select("titel, stad")
    .eq("id", id)
    .eq("status", "actief")
    .maybeSingle();
  if (!data) return { title: "Profiel niet gevonden" };
  return {
    title: data.titel,
    description: `Profiel in ${data.stad} op Veloura. Alleen 18+.`,
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
  const { tekst, meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const categorie = categorieLabel(meta.categorie);
  const mogelijkheidLabels = alleMogelijkheden(meta);
  const videoUrls = meta.videoUrls ?? (meta.videoUrl ? [meta.videoUrl] : []);
  const beschikbaarheidLabels = (meta.beschikbaarheid ?? []).map(
    (v) => BESCHIKBAARHEID_OPTIES.find((o) => o.value === v)?.label ?? v
  );

  const whatsappUrl = meta.whatsapp
    ? `https://wa.me/${meta.whatsapp.replace(/\D/g, "")}`
    : null;
  const telegramUrl = meta.telegram
    ? meta.telegram.startsWith("http")
      ? meta.telegram
      : `https://t.me/${meta.telegram.replace(/^@/, "")}`
    : null;
  const isPremium = advertentie.premium || boostActief(meta);
  const hasMobileContact = Boolean(advertentie.telefoon || whatsappUrl);

  return (
    <div className={hasMobileContact ? "pb-24 lg:pb-0" : "pb-6 lg:pb-0"}>
      <div className="section-dark pb-6">
        <div className="container py-4">
          <Link href="/zoeken" className="text-sm text-[#b7aaa2] hover:text-[#fff7ef]">
            ← Terug naar profielen
          </Link>
        </div>

        <div className="container">
          <div className="profile-detail-gallery">
            {videoUrls.map((url) => (
              <div key={url} className="profile-detail-gallery__video">
                <video src={url} controls className="h-full w-full object-cover" />
              </div>
            ))}
            {fotos.length > 0 ? (
              fotos.map((foto) => (
                <div key={foto.id} className="profile-detail-gallery__item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.url} alt={advertentie.titel} className="h-full w-full object-cover" />
                </div>
              ))
            ) : (
              <div className="profile-detail-gallery__item profile-detail-gallery__item--placeholder">
                <ProfilePhotoPlaceholder variant="warm-wine" className="!aspect-auto h-full" />
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {isPremium && <Badge variant="premium">Premium</Badge>}
            {boostLabel(meta) && <Badge variant="new">{boostLabel(meta)}</Badge>}
            {advertentie.geverifieerd && <Badge variant="verified">Geverifieerd</Badge>}
            {categorie && <Badge variant="wine">{categorie}</Badge>}
            <Badge variant="wine">
              <MapPin className="mr-1 inline h-3 w-3" />
              {advertentie.stad}
            </Badge>
            <Badge variant={advertentie.beschikbaar ? "online" : "muted"}>
              {beschikbaarLabel(advertentie.beschikbaar)}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-medium text-[#fff6ef] sm:text-3xl">
              {advertentie.titel}
            </h1>
            <FavoriteButton advertentieId={advertentie.id} variant="inline" />
          </div>
          <p className="mt-1 text-sm text-[#c2b4ab]">
            {advertentie.leeftijd} jaar · {advertentie.stad} ·{" "}
            <span className="font-semibold text-[#d6b36b]">
              Vanaf {formatPrijs(advertentie.prijs_vanaf)}
            </span>
          </p>
        </div>
      </div>

      <div className="section-light">
        <div className="container py-6 lg:py-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <article className="space-y-6 lg:col-span-2">
              <div className="light-card p-5 sm:p-7">
                <h2 className="profile-detail-section-title">Beschrijving</h2>
                <p className="prose-advertentie mt-3 whitespace-pre-wrap">{tekst}</p>
              </div>

              <div className="light-card p-5 sm:p-7">
                <h2 className="profile-detail-section-title">Profiel</h2>
                <dl className="profile-detail-dl mt-4">
                  {meta.geslacht && <div><dt>Geslacht</dt><dd>{meta.geslacht}</dd></div>}
                  <div><dt>Leeftijd</dt><dd>{advertentie.leeftijd} jaar</dd></div>
                  {meta.haarkleur && <div><dt>Haarkleur</dt><dd>{meta.haarkleur}</dd></div>}
                  {meta.oogkleur && <div><dt>Oogkleur</dt><dd>{meta.oogkleur}</dd></div>}
                  {meta.lengteCm && <div><dt>Lengte</dt><dd>{meta.lengteCm} cm</dd></div>}
                  {meta.gewichtKg && <div><dt>Gewicht</dt><dd>{meta.gewichtKg} kg</dd></div>}
                  {meta.regio && <div><dt>Regio</dt><dd>{meta.regio}</dd></div>}
                  {meta.cupmaat && <div><dt>Cupmaat</dt><dd>{meta.cupmaat}</dd></div>}
                  {meta.nationaliteit && <div><dt>Nationaliteit</dt><dd>{meta.nationaliteit}</dd></div>}
                  {meta.talen && meta.talen.length > 0 && (
                    <div><dt>Talen</dt><dd>{meta.talen.join(", ")}</dd></div>
                  )}
                  <div><dt>Roker</dt><dd>{meta.roker ? "Ja" : "Nee"}</dd></div>
                  <div><dt>Tattoos</dt><dd>{meta.tattoos ? "Ja" : "Nee"}</dd></div>
                  <div><dt>Piercings</dt><dd>{meta.piercings ? "Ja" : "Nee"}</dd></div>
                </dl>
              </div>

              {mogelijkheidLabels.length > 0 && (
                <div className="light-card p-5 sm:p-7">
                  <h2 className="profile-detail-section-title">Mogelijkheden</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mogelijkheidLabels.map((label) => (
                      <span key={label} className="profile-detail-chip">{label}</span>
                    ))}
                  </div>
                </div>
              )}

              {beschikbaarheidLabels.length > 0 && (
                <div className="light-card p-5 sm:p-7">
                  <h2 className="profile-detail-section-title">Beschikbaarheid</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {beschikbaarheidLabels.map((label) => (
                      <span key={label} className="profile-detail-chip">{label}</span>
                    ))}
                  </div>
                </div>
              )}

              {meta.werktijden && meta.werktijden.length > 0 && (
                <div className="light-card p-5 sm:p-7">
                  <h2 className="profile-detail-section-title">Werktijden</h2>
                  <table className="profile-detail-table mt-3 w-full text-sm">
                    <thead>
                      <tr>
                        <th>Dag</th>
                        <th>Van</th>
                        <th>Tot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meta.werktijden.map((dag) => (
                        <tr key={dag.dag}>
                          <td className="capitalize">{dag.dag}</td>
                          <td>{dag.actief ? dag.van : "—"}</td>
                          <td>{dag.actief ? dag.tot : "Gesloten"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>

            <aside className="mt-6 lg:mt-0">
              <div className="light-card lg:sticky lg:top-[4.5rem] p-5 sm:p-6">
                <h2 className="font-display text-lg text-[#211a20]">Contact</h2>
                <p className="mt-1 text-sm text-[#756760]">
                  Neem discreet contact op voor een afspraak.
                </p>
                {advertentie.telefoon && (
                  <p className="mt-4 flex items-center gap-2 font-display text-xl text-[#7a2f49]">
                    <Phone className="h-4 w-4" />
                    {advertentie.telefoon}
                  </p>
                )}
                <div className="mt-5 space-y-2">
                  {advertentie.telefoon && (
                    <Button asChild size="lg" variant="primary" className="w-full gap-2">
                      <a href={`tel:${advertentie.telefoon}`}>
                        <Phone className="h-4 w-4" />
                        Bel nu
                      </a>
                    </Button>
                  )}
                  {whatsappUrl && (
                    <Button asChild size="lg" variant="secondary-light" className="w-full">
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </Button>
                  )}
                  {telegramUrl && (
                    <Button asChild size="lg" variant="secondary-light" className="w-full">
                      <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                        Telegram
                      </a>
                    </Button>
                  )}
                  {meta.website && (
                    <Button asChild size="lg" variant="secondary-light" className="w-full">
                      <a href={meta.website.startsWith("http") ? meta.website : `https://${meta.website}`} target="_blank" rel="noopener noreferrer">
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {hasMobileContact && (
        <div className="mobile-contact-bar lg:hidden">
          {advertentie.telefoon ? (
            <Button asChild size="lg" variant="primary" className="w-full">
              <a href={`tel:${advertentie.telefoon}`}>Neem contact op</a>
            </Button>
          ) : whatsappUrl ? (
            <Button asChild size="lg" variant="primary" className="w-full">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
