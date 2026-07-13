"use client";

import Link from "next/link";
import { useTranslation } from "@/contexts/locale-context";

const POPULAR_SEARCH_KEYS = [
  { key: "escortAntwerp", href: "/zoeken?stad=Antwerpen&categorie=escort" },
  { key: "priveGent", href: "/zoeken?stad=Gent&categorie=prive-ontvangst" },
  { key: "video", href: "/zoeken?categorie=video" },
  { key: "massageBrussels", href: "/zoeken?stad=Brussel&categorie=massage" },
  { key: "availableToday", href: "/zoeken?beschikbaar=true" },
  { key: "verified", href: "/zoeken?geverifieerd=true" },
] as const;

export function PopularSearches() {
  const { t } = useTranslation();

  return (
    <div className="popular-searches">
      <p className="popular-searches__label">{t("discovery.popularSearches")}</p>
      <div className="popular-searches__chips">
        {POPULAR_SEARCH_KEYS.map((item) => (
          <Link key={item.key} href={item.href} className="search-chip">
            {t(`discovery.popular.${item.key}`)}
          </Link>
        ))}
      </div>
    </div>
  );
}
