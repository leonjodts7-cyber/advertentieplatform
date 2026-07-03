import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { ProfileGallery } from "@/components/profile-gallery";
import { RecentBekekenTracker } from "@/components/recent-bekeken-tracker";
import {
  BESCHIKBAARHEID_OPTIES,
  categorieLabel,
  alleMogelijkheden,
  parseAdvertentieBeschrijving,
} from "@/lib/advertentie-metadata";
import { boostActief, boostLabel } from "@/lib/advertentie-boost";
import { fetchVergelijkbareAdvertenties } from "@/lib/advertentie-queries";
import { haalEersteFotos } from "@/lib/advertentie-fotos";
import { beschikbaarLabel, formatPrijs } from "@/lib/helpers";
import type { Advertentie, AdvertentieFoto } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { MapPin, Phone, Shield } from "lucide-react";

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

  const [{ data: fotosRaw }, vergelijkbaar] = await Promise.all([
    supabase
      .from("advertentie_fotos")
      .select("*")
      .eq("advertentie_id", id)
      .order("volgorde", { ascending: true }),
    fetchVergelijkbareAdvertenties(supabase, advertentie, 12),
  ]);

  const fotos = (fotosRaw ?? []) as AdvertentieFoto[];
  const vergelijkFotos = await haalEersteFotos(
    supabase,
    vergelijkbaar.map((a) => a.id)
  );

  const { tekst, meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const categorie = categorieLabel(meta.categorie);
  const mogelijkheidLabels = alleMogelijkheden(meta);
  const videoUrls = meta.videoUrls ?? (meta.videoUrl ? [meta.videoUrl] : []);
  const beschikbaarheidLabels = (meta.beschikbaarheid ?? []).map(
    (v) => BESCHIKBAARHEID_OPTIES.find((o) => o.value === v)?.label ?? v
  );
  const typeAfspraak =
    meta.adresTypes?.length ? meta.adresTypes.join(", ") : null;

  const galleryItems = [
    ...videoUrls.map((url, i) => ({
      id: `video-${i}`,
      type: "video" as const,
      url,
    })),
    ...fotos.map((foto) => ({
      id: foto.id,
      type: "image" as const,
      url: foto.url,
      alt: advertentie.titel,
    })),
  ];

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
      <RecentBekekenTracker advertentieId={advertentie.id} />

      <div className="section-dark pb-6">
        <div className="container py-4">
          <Link href="/zoeken" className="text-sm text-[#b7aaa2] hover:text-[#fff7ef]">
            ← Terug naar profielen
          </Link>
        </div>

        <div className="container">
          <ProfileGallery items={galleryItems} title={advertentie.titel} />

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

          <div className="profile-detail-tarief mt-4">
            <p className="profile-detail-tarief__label">Tarief vanaf</p>
            <p className="profile-detail-tarief__price">
              {formatPrijs(advertentie.prijs_vanaf)}
            </p>
            <p className="profile-detail-tarief__note">
              Exact tarief en duur in overleg. Alleen 18+.
            </p>
          </div>
        </div>
      </div>

      <div className="section-light">
        <div className="container py-6 lg:py-8">
          <div className="profile-detail-info-grid">
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">Stad</span>
              <span className="profile-detail-info-grid__value">{advertentie.stad}</span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">Leeftijd</span>
              <span className="profile-detail-info-grid__value">
                {advertentie.leeftijd ?? "—"} jaar
              </span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">Categorie</span>
              <span className="profile-detail-info-grid__value">{categorie ?? "—"}</span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">Type afspraak</span>
              <span className="profile-detail-info-grid__value">
                {typeAfspraak ?? "—"}
              </span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">Talen</span>
              <span className="profile-detail-info-grid__value">
                {meta.talen?.length ? meta.talen.join(", ") : "—"}
              </span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">Mogelijkheden</span>
              <span className="profile-detail-info-grid__value">
                {mogelijkheidLabels.length ? mogelijkheidLabels.join(", ") : "—"}
              </span>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mt-8">
            <article className="space-y-6 lg:col-span-2">
              <div className="light-card p-5 sm:p-7">
                <h2 className="profile-detail-section-title">Beschrijving</h2>
                <p className="prose-advertentie mt-3 whitespace-pre-wrap">
                  {tekst || "Geen beschrijving beschikbaar."}
                </p>
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

              <div className="profile-detail-safety light-card p-5 sm:p-7">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--wine)]" aria-hidden />
                  <div>
                    <h2 className="profile-detail-section-title">Veiligheid & discretie</h2>
                    <p className="mt-2 text-sm text-[#756760]">
                      Veloura faciliteert contact tussen volwassenen. Spreek altijd
                      duidelijke afspraken af, respecteer grenzen en deel geen
                      persoonlijke gegevens onnodig. Meld misbruik via ons contactformulier.
                    </p>
                    <Link
                      href="/juridisch/contact"
                      className="mt-3 inline-block text-sm font-medium text-[var(--wine)] hover:underline"
                    >
                      Contact & meldingen
                    </Link>
                  </div>
                </div>
              </div>
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
                      <a
                        href={
                          meta.website.startsWith("http")
                            ? meta.website
                            : `https://${meta.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {vergelijkbaar.length > 0 && (
            <div className="mt-10">
              <HorizontalListingsCarousel
                title="Vergelijkbare profielen"
                subtitle={`Meer profielen in ${advertentie.stad}.`}
                items={vergelijkbaar}
                fotos={vergelijkFotos}
                variant="premium"
                embedded
                className="search-embedded-carousel profile-detail-similar"
              />
            </div>
          )}
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
