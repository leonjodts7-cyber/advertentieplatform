"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { ProfileGallery } from "@/components/profile-gallery";
import { RecentBekekenTracker } from "@/components/recent-bekeken-tracker";
import { AnalyticsTracker, trackAnalyticsEvent } from "@/components/analytics-tracker";
import { AdvertentieReviewsSection } from "@/components/advertentie-reviews-section";
import { useTranslation } from "@/contexts/locale-context";
import { boostActief, boostLabel } from "@/lib/advertentie-boost";
import { formatPrijs } from "@/lib/helpers";
import { categoryLabelI18n } from "@/lib/i18n/marketplace-i18n";
import type { Advertentie, AdvertentieFoto } from "@/lib/types";
import type { AdvertentieReview, ReviewSummary } from "@/lib/reviews/types";
import { MapPin, Phone, Shield } from "lucide-react";

export interface AdvertentieDetailContentProps {
  advertentie: Advertentie;
  fotos: AdvertentieFoto[];
  vergelijkbaar: Advertentie[];
  vergelijkFotos: Map<string, string | undefined>;
  categorieSlug: string | null;
  mogelijkheidLabels: string[];
  beschikbaarheidValues: string[];
  typeAfspraak: string | null;
  tekst: string;
  meta: ReturnType<typeof import("@/lib/advertentie-metadata").parseAdvertentieBeschrijving>["meta"];
  reviewSummary: ReviewSummary;
  reviews: AdvertentieReview[];
}

export function AdvertentieDetailContent({
  advertentie,
  fotos,
  vergelijkbaar,
  vergelijkFotos,
  categorieSlug,
  mogelijkheidLabels,
  beschikbaarheidValues,
  typeAfspraak,
  tekst,
  meta,
  reviewSummary,
  reviews,
}: AdvertentieDetailContentProps) {
  const { t } = useTranslation();
  const videoUrls = meta.videoUrls ?? (meta.videoUrl ? [meta.videoUrl] : []);
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
  const categorie = categorieSlug ? categoryLabelI18n(t, categorieSlug) : null;
  const beschikbaarheidLabels = beschikbaarheidValues.map((v) => {
    const key = `detail.availabilityOptions.${v}`;
    const label = t(key);
    return label === key ? v : label;
  });
  const availabilityBadge = advertentie.beschikbaar
    ? t("listing.online")
    : t("listing.offline");

  const galleryItems = [
    ...videoUrls.map((url, i) => ({ id: `video-${i}`, type: "video" as const, url })),
    ...fotos.map((foto) => ({
      id: foto.id,
      type: "image" as const,
      url: foto.url,
      alt: advertentie.titel,
    })),
  ];

  const yesNo = (v: boolean) => (v ? t("detail.yes") : t("detail.no"));

  return (
    <div className={hasMobileContact ? "pb-24 lg:pb-0" : "pb-6 lg:pb-0"}>
      <RecentBekekenTracker advertentieId={advertentie.id} />
      <AnalyticsTracker advertentieId={advertentie.id} eventType="profile_view" />

      <div className="section-dark pb-6">
        <div className="container py-4">
          <Link href="/zoeken" className="text-sm text-[#b7aaa2] hover:text-[#fff7ef]">
            {t("detail.backToSearch")}
          </Link>
        </div>

        <div className="container">
          <ProfileGallery items={galleryItems} title={advertentie.titel} />

          <div className="mt-4 flex flex-wrap gap-2">
            {isPremium && <Badge variant="premium">{t("listing.premium")}</Badge>}
            {boostLabel(meta) && <Badge variant="new">{boostLabel(meta)}</Badge>}
            {advertentie.geverifieerd && <Badge variant="verified">{t("listing.verified")}</Badge>}
            {categorie && <Badge variant="wine">{categorie}</Badge>}
            <Badge variant="wine">
              <MapPin className="mr-1 inline h-3 w-3" />
              {advertentie.stad}
            </Badge>
            <Badge variant={advertentie.beschikbaar ? "online" : "muted"}>
              {availabilityBadge}
            </Badge>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-medium text-[#fff6ef] sm:text-3xl">
              {advertentie.titel}
            </h1>
            <FavoriteButton advertentieId={advertentie.id} variant="inline" />
          </div>

          {reviewSummary.count > 0 && (
            <p className="mt-2 text-sm text-[#d6b36b]">
              {t("reviews.stars", { rating: reviewSummary.average })} ·{" "}
              {t("reviews.count", { count: reviewSummary.count })}
            </p>
          )}

          <div className="profile-detail-tarief mt-4">
            <p className="profile-detail-tarief__label">{t("detail.priceFrom")}</p>
            <p className="profile-detail-tarief__price">{formatPrijs(advertentie.prijs_vanaf)}</p>
            <p className="profile-detail-tarief__note">{t("detail.priceNote")}</p>
          </div>
        </div>
      </div>

      <div className="section-light">
        <div className="container py-6 lg:py-8">
          <div className="profile-detail-info-grid">
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">{t("detail.city")}</span>
              <span className="profile-detail-info-grid__value">{advertentie.stad}</span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">{t("detail.age")}</span>
              <span className="profile-detail-info-grid__value">
                {advertentie.leeftijd ?? "—"} {t("detail.years")}
              </span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">{t("detail.category")}</span>
              <span className="profile-detail-info-grid__value">{categorie ?? "—"}</span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">{t("detail.appointmentType")}</span>
              <span className="profile-detail-info-grid__value">{typeAfspraak ?? "—"}</span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">{t("detail.languages")}</span>
              <span className="profile-detail-info-grid__value">
                {meta.talen?.length ? meta.talen.join(", ") : "—"}
              </span>
            </div>
            <div className="profile-detail-info-grid__item">
              <span className="profile-detail-info-grid__label">{t("detail.options")}</span>
              <span className="profile-detail-info-grid__value">
                {mogelijkheidLabels.length ? mogelijkheidLabels.join(", ") : "—"}
              </span>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mt-8">
            <article className="space-y-6 lg:col-span-2">
              <div className="light-card p-5 sm:p-7">
                <h2 className="profile-detail-section-title">{t("detail.description")}</h2>
                <p className="prose-advertentie mt-3 whitespace-pre-wrap">
                  {tekst || t("detail.noDescription")}
                </p>
              </div>

              <div className="light-card p-5 sm:p-7">
                <h2 className="profile-detail-section-title">{t("detail.profile")}</h2>
                <dl className="profile-detail-dl mt-4">
                  {meta.geslacht && (
                    <div>
                      <dt>{t("detail.gender")}</dt>
                      <dd>{meta.geslacht}</dd>
                    </div>
                  )}
                  <div>
                    <dt>{t("detail.age")}</dt>
                    <dd>
                      {advertentie.leeftijd} {t("detail.years")}
                    </dd>
                  </div>
                  {meta.haarkleur && (
                    <div>
                      <dt>{t("detail.hair")}</dt>
                      <dd>{meta.haarkleur}</dd>
                    </div>
                  )}
                  {meta.oogkleur && (
                    <div>
                      <dt>{t("detail.eyes")}</dt>
                      <dd>{meta.oogkleur}</dd>
                    </div>
                  )}
                  {meta.lengteCm && (
                    <div>
                      <dt>{t("detail.height")}</dt>
                      <dd>
                        {meta.lengteCm} {t("detail.cm")}
                      </dd>
                    </div>
                  )}
                  {meta.gewichtKg && (
                    <div>
                      <dt>{t("detail.weight")}</dt>
                      <dd>
                        {meta.gewichtKg} {t("detail.kg")}
                      </dd>
                    </div>
                  )}
                  {meta.regio && (
                    <div>
                      <dt>{t("detail.region")}</dt>
                      <dd>{meta.regio}</dd>
                    </div>
                  )}
                  <div>
                    <dt>{t("detail.smoker")}</dt>
                    <dd>{yesNo(!!meta.roker)}</dd>
                  </div>
                  <div>
                    <dt>{t("detail.tattoos")}</dt>
                    <dd>{yesNo(!!meta.tattoos)}</dd>
                  </div>
                  <div>
                    <dt>{t("detail.piercings")}</dt>
                    <dd>{yesNo(!!meta.piercings)}</dd>
                  </div>
                </dl>
              </div>

              {mogelijkheidLabels.length > 0 && (
                <div className="light-card p-5 sm:p-7">
                  <h2 className="profile-detail-section-title">{t("detail.options")}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mogelijkheidLabels.map((label) => (
                      <span key={label} className="profile-detail-chip">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {beschikbaarheidLabels.length > 0 && (
                <div className="light-card p-5 sm:p-7">
                  <h2 className="profile-detail-section-title">{t("detail.availability")}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {beschikbaarheidLabels.map((label) => (
                      <span key={label} className="profile-detail-chip">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {meta.werktijden && meta.werktijden.length > 0 && (
                <div className="light-card p-5 sm:p-7">
                  <h2 className="profile-detail-section-title">{t("detail.schedule")}</h2>
                  <table className="profile-detail-table mt-3 w-full text-sm">
                    <thead>
                      <tr>
                        <th>{t("detail.day")}</th>
                        <th>{t("detail.from")}</th>
                        <th>{t("detail.to")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meta.werktijden.map((dag) => (
                        <tr key={dag.dag}>
                          <td className="capitalize">{dag.dag}</td>
                          <td>{dag.actief ? dag.van : "—"}</td>
                          <td>{dag.actief ? dag.tot : t("detail.closed")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <AdvertentieReviewsSection
                advertentieId={advertentie.id}
                initialSummary={reviewSummary}
                initialReviews={reviews}
              />

              <div className="profile-detail-safety light-card p-5 sm:p-7">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--wine)]" aria-hidden />
                  <div>
                    <h2 className="profile-detail-section-title">{t("detail.safety")}</h2>
                    <p className="mt-2 text-sm text-[#756760]">{t("detail.safetyText")}</p>
                    <Link
                      href="/juridisch/contact"
                      className="mt-3 inline-block text-sm font-medium text-[var(--wine)] hover:underline"
                    >
                      {t("detail.contactReports")}
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <aside className="mt-6 lg:mt-0">
              <div className="light-card lg:sticky lg:top-[4.5rem] p-5 sm:p-6">
                <h2 className="font-display text-lg text-[#211a20]">{t("detail.contact")}</h2>
                <p className="mt-1 text-sm text-[#756760]">{t("detail.contactSubtitle")}</p>
                {advertentie.telefoon && (
                  <p className="mt-4 flex items-center gap-2 font-display text-xl text-[#7a2f49]">
                    <Phone className="h-4 w-4" />
                    {advertentie.telefoon}
                  </p>
                )}
                <div className="mt-5 space-y-2">
                  {advertentie.telefoon && (
                    <Button asChild size="lg" variant="primary" className="w-full gap-2">
                      <a
                        href={`tel:${advertentie.telefoon}`}
                        onClick={() => trackAnalyticsEvent("phone_click", advertentie.id)}
                      >
                        <Phone className="h-4 w-4" />
                        {t("detail.callNow")}
                      </a>
                    </Button>
                  )}
                  {whatsappUrl && (
                    <Button asChild size="lg" variant="secondary-light" className="w-full">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackAnalyticsEvent("whatsapp_click", advertentie.id)}
                      >
                        {t("detail.whatsapp")}
                      </a>
                    </Button>
                  )}
                  {telegramUrl && (
                    <Button asChild size="lg" variant="secondary-light" className="w-full">
                      <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                        {t("detail.telegram")}
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
                        onClick={() => trackAnalyticsEvent("website_click", advertentie.id)}
                      >
                        {t("detail.website")}
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
                title={t("detail.similar")}
                subtitle={t("detail.similarSub", { city: advertentie.stad })}
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
              <a
                href={`tel:${advertentie.telefoon}`}
                onClick={() => trackAnalyticsEvent("phone_click", advertentie.id)}
              >
                {t("detail.contactCta")}
              </a>
            </Button>
          ) : whatsappUrl ? (
            <Button asChild size="lg" variant="primary" className="w-full">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAnalyticsEvent("whatsapp_click", advertentie.id)}
              >
                {t("detail.whatsapp")}
              </a>
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
