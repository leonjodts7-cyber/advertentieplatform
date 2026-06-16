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

const HOMEPAGE_CATEGORIEEN = [
  { slug: "prive-ontvangst", label: "Privé ontvangst", subtitle: "Discrete locaties", icon: UserRound },
  { slug: "escort", label: "Escort", subtitle: "In jouw regio", icon: Crown },
  { slug: "massage", label: "Massage", subtitle: "Wellness & rust", icon: Waves },
  { slug: "video", label: "Video", subtitle: "Virtueel contact", icon: Video },
  { slug: "koppels", label: "Koppels", subtitle: "Voor koppels", icon: Users },
  { slug: "trans", label: "Trans", subtitle: "Trans profielen", icon: Sparkles },
  { slug: "mannen", label: "Mannen", subtitle: "Mannelijk", icon: UserRound },
  { slug: "vrouwen", label: "Vrouwen", subtitle: "Vrouwelijk", icon: Heart },
  { slug: "privehuizen", label: "Privéhuizen", subtitle: "Discrete locaties", icon: UserRound },
  { slug: "rendez-vous-hotels", label: "Rendez-vous hotels", subtitle: "Discreet afspreken", icon: Hotel },
  { slug: "prive-saunas", label: "Privé sauna's", subtitle: "Sauna & wellness", icon: Waves },
  { slug: "parenclubs", label: "Parenclubs", subtitle: "Voor koppels", icon: Users },
] as const;

export function CategoryCompactGrid() {
  return (
    <section className="home-listing-block home-listing-block--compact">
      <div className="container">
        <h2 className="home-listing-block__title">Populaire categorieën</h2>
        <div className="category-compact-grid category-compact-grid--wide">
          {HOMEPAGE_CATEGORIEEN.map((cat) => {
            const Icon = cat.icon;
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
