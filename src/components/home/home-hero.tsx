"use client";

import { HomeHeroSearch } from "@/components/home/home-hero-search";
import { useTranslation } from "@/contexts/locale-context";

export function HomeHeroCompact() {
  const { t } = useTranslation();

  return (
    <section className="home-hero-compact home-hero-compact--polished">
      <div className="container">
        <div className="home-hero-compact__grid">
          <div className="home-hero-compact__copy">
            <h1 className="home-hero-compact__title">{t("hero.title")}</h1>
            <p className="home-hero-compact__subtitle">{t("hero.subtitle")}</p>
            <p className="home-hero-compact__trust">{t("hero.trust")}</p>
          </div>
          <div className="home-hero-compact__search">
            <HomeHeroSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
