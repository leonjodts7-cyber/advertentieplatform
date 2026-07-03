import type { Advertentie } from "@/lib/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://veloura.be";

export function buildListingJsonLd(input: {
  advertentie: Advertentie;
  description: string;
  imageUrls: string[];
  reviewAverage?: number;
  reviewCount?: number;
}) {
  const { advertentie, description, imageUrls, reviewAverage, reviewCount } = input;
  const url = `${SITE_URL}/advertentie/${advertentie.id}`;

  const aggregateRating =
    reviewCount && reviewCount > 0 && reviewAverage
      ? {
          "@type": "AggregateRating",
          ratingValue: reviewAverage,
          reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: advertentie.titel,
    description,
    url,
    areaServed: advertentie.stad,
    image: imageUrls.length > 0 ? imageUrls : undefined,
    offers: {
      "@type": "Offer",
      price: advertentie.prijs_vanaf,
      priceCurrency: "EUR",
    },
    aggregateRating,
    provider: {
      "@type": "Person",
      name: advertentie.titel,
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
