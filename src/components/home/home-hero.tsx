"use client";

import { HomeHeroSearch } from "@/components/home/home-hero-search";
import { PopularSearches } from "@/components/popular-searches";
import { useTranslation } from "@/contexts/locale-context";

export function HomeHeroCompact() {
  const { t } = useTranslation();

  return (
    <section className="home-hero-discovery">
      <div className="container home-hero-discovery__inner">
        <div className="home-hero-discovery__copy">
          <p className="home-hero-discovery__eyebrow">{t("discovery.eyebrow")}</p>
          <h1 className="home-hero-discovery__title">{t("hero.title")}</h1>
          <p className="home-hero-discovery__subtitle">{t("hero.subtitle")}</p>
        </div>
        <div className="home-hero-discovery__search">
          <HomeHeroSearch />
          <PopularSearches />
        </div>
        <p className="home-hero-discovery__trust">{t("hero.trust")}</p>
      </div>
    </section>
  );
}
