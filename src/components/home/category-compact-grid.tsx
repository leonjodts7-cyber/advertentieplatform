import Link from "next/link";
import {
  Building2,
  Crown,
  Heart,
  Hotel,
  Music,
  Sparkles,
  UserRound,
  Users,
  Video,
  Waves,
  Wine,
} from "lucide-react";
import { HOMEPAGE_CATEGORIEEN } from "@/lib/marketplace";

const CATEGORIE_ICONS: Record<string, typeof UserRound> = {
  privehuizen: Building2,
  "prive-ontvangst": UserRound,
  escort: Crown,
  massagesalons: Waves,
  "bars-clubs": Music,
  "rendez-vous-hotels": Hotel,
  "prive-saunas": Waves,
  parenclubs: Wine,
  massage: Waves,
  video: Video,
  koppels: Users,
  trans: Sparkles,
  mannen: UserRound,
  vrouwen: Heart,
};

export function CategoryCompactGrid() {
  return (
    <section className="home-listing-block home-listing-block--compact">
      <div className="container">
        <h2 className="home-listing-block__title">Populaire categorieën</h2>
        <p className="home-listing-block__subtitle home-listing-block__subtitle--inline">
          Ontdek profielen per categorie
        </p>
        <div className="category-compact-grid category-compact-grid--wide">
          {HOMEPAGE_CATEGORIEEN.map((cat) => {
            const Icon = CATEGORIE_ICONS[cat.slug] ?? UserRound;
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
                  <span className="category-compact-card__title">{cat.label}</span>
                  <span className="category-compact-card__subtitle">
                    {cat.subtitle}
                  </span>
                </span>
                <span className="category-compact-card__count">Binnenkort</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
