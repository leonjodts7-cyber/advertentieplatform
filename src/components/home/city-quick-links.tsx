"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";
import { BUURT_STEDEN } from "@/lib/marketplace";

export function CityQuickLinks() {
  const { t } = useTranslation();

  return (
    <section className="home-listing-block home-listing-block--compact home-listing-block--cities">
      <div className="container">
        <h2 className="home-listing-block__title">{t("discovery.citiesTitle")}</h2>
        <p className="home-listing-block__subtitle">{t("discovery.citiesSubtitle")}</p>
        <div className="city-quick-links">
          {BUURT_STEDEN.map((stad) => (
            <Link key={stad} href={`/zoeken?stad=${encodeURIComponent(stad)}`} className="city-quick-link">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {stad}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
