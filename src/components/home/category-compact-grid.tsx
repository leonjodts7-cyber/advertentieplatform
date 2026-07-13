"use client";

import Link from "next/link";
import {
  Crown,
  Heart,
  Hotel,
  Sparkles,
  UserRound,
  Users,
  Video,
  Waves,
} from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";
import { categoryLabelI18n } from "@/lib/i18n/marketplace-i18n";
import { HOMEPAGE_CATEGORIEEN } from "@/lib/marketplace";

const ICONS: Record<string, typeof UserRound> = {
  "prive-ontvangst": UserRound,
  escort: Crown,
  massage: Waves,
  video: Video,
  koppels: Users,
  trans: Sparkles,
  mannen: UserRound,
  vrouwen: Heart,
  privehuizen: UserRound,
  "rendez-vous-hotels": Hotel,
  "prive-saunas": Waves,
  parenclubs: Users,
};

export function CategoryCompactGrid() {
  const { t } = useTranslation();

  return (
    <section className="home-listing-block home-listing-block--compact">
      <div className="container">
        <h2 className="home-listing-block__title">{t("discovery.categoriesTitle")}</h2>
        <p className="home-listing-block__subtitle">{t("discovery.categoriesSubtitle")}</p>
        <div className="category-compact-grid category-compact-grid--wide">
          {HOMEPAGE_CATEGORIEEN.map((cat) => {
            const Icon = ICONS[cat.slug] ?? UserRound;
            return (
              <Link
                key={cat.slug}
                href={`/zoeken?categorie=${cat.slug}`}
                className="category-compact-card"
              >
                <span className="category-compact-card__icon">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span className="category-compact-card__body">
                  <span className="category-compact-card__title">
                    {categoryLabelI18n(t, cat.slug, cat.label)}
                  </span>
                  <span className="category-compact-card__subtitle">{cat.subtitle}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
