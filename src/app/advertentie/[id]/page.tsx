import { notFound } from "next/navigation";
import Script from "next/script";
import { AdvertentieDetailContent } from "@/components/advertentie-detail-content";
import {
  alleMogelijkheden,
  parseAdvertentieBeschrijving,
} from "@/lib/advertentie-metadata";
import { fetchVergelijkbareAdvertenties } from "@/lib/advertentie-queries";
import { getCachedListingPhotos } from "@/lib/cache/listing-photos";
import { fetchAdvertentieReviews, fetchReviewSummary } from "@/lib/reviews/queries";
import type { Metadata } from "next";
import { buildBreadcrumbJsonLd, buildListingJsonLd } from "@/lib/seo/structured-data";
import { getServerTranslation } from "@/lib/i18n/server";
import type { Advertentie, AdvertentieFoto } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

interface AdvertentieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdvertentieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getServerTranslation();
  const { data } = await supabase
    .from("advertenties")
    .select("titel, stad")
    .eq("id", id)
    .eq("status", "actief")
    .maybeSingle();

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  if (!data) {
    return {
      title: t("detail.notFound"),
      robots: { index: false, follow: false },
    };
  }

  const title = data.titel;
  const description = t("detail.metaDescription", { city: data.stad });
  const canonical = `${base}/advertentie/${id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Veloura",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function AdvertentieDetailPage({
  params,
}: AdvertentieDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getServerTranslation();

  const { data: advertentieRaw } = await supabase
    .from("advertenties")
    .select("*")
    .eq("id", id)
    .eq("status", "actief")
    .maybeSingle();

  const advertentie = advertentieRaw as Advertentie | null;
  if (!advertentie) notFound();

  const [{ data: fotosRaw }, vergelijkbaar, reviewSummary, reviews] = await Promise.all([
    supabase
      .from("advertentie_fotos")
      .select("*")
      .eq("advertentie_id", id)
      .order("volgorde", { ascending: true }),
    fetchVergelijkbareAdvertenties(supabase, advertentie, 12),
    fetchReviewSummary(supabase, id),
    fetchAdvertentieReviews(supabase, id),
  ]);

  const fotos = (fotosRaw ?? []) as AdvertentieFoto[];
  const { urls: vergelijkFotos } = await getCachedListingPhotos(
    vergelijkbaar.map((a) => a.id)
  );

  const { tekst, meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const categorieSlug = meta.categorie ?? null;
  const mogelijkheidLabels = alleMogelijkheden(meta);
  const beschikbaarheidValues = meta.beschikbaarheid ?? [];
  const typeAfspraak = meta.adresTypes?.length ? meta.adresTypes.join(", ") : null;

  const listingJsonLd = buildListingJsonLd({
    advertentie,
    description: tekst || t("detail.noDescription"),
    imageUrls: fotos.map((f) => f.url),
    reviewAverage: reviewSummary.count > 0 ? reviewSummary.average : undefined,
    reviewCount: reviewSummary.count > 0 ? reviewSummary.count : undefined,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: t("nav.home"), path: "/" },
    { name: t("nav.search"), path: "/zoeken" },
    { name: advertentie.titel, path: `/advertentie/${id}` },
  ]);

  return (
    <>
      <Script
        id="listing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AdvertentieDetailContent
        advertentie={advertentie}
        fotos={fotos}
        vergelijkbaar={vergelijkbaar}
        vergelijkFotos={vergelijkFotos}
        categorieSlug={categorieSlug}
        mogelijkheidLabels={mogelijkheidLabels}
        beschikbaarheidValues={beschikbaarheidValues}
        typeAfspraak={typeAfspraak}
        tekst={tekst}
        meta={meta}
        reviewSummary={reviewSummary}
        reviews={reviews}
      />
    </>
  );
}
