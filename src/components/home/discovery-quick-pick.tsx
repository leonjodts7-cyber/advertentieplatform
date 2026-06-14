import Link from "next/link";
import {
  Crown,
  Heart,
  Sparkles,
  UserRound,
  Users,
  Video,
  Waves,
} from "lucide-react";

const CATEGORIEEN = [
  {
    slug: "prive-ontvangst",
    label: "Privé ontvangst",
    tekst: "Discrete privélocaties.",
    icon: UserRound,
  },
  {
    slug: "escort",
    label: "Escort",
    tekst: "Escort in jouw regio.",
    icon: Crown,
  },
  {
    slug: "massage",
    label: "Massage",
    tekst: "Wellness & ontspanning.",
    icon: Waves,
  },
  {
    slug: "video",
    label: "Video",
    tekst: "Virtuele afspraken.",
    icon: Video,
  },
  {
    slug: "koppels",
    label: "Koppels",
    tekst: "Voor koppels.",
    icon: Users,
  },
  {
    slug: "trans",
    label: "Trans",
    tekst: "Trans profielen.",
    icon: Sparkles,
  },
  {
    slug: "mannen",
    label: "Mannen",
    tekst: "Mannelijke profielen.",
    icon: UserRound,
  },
  {
    slug: "vrouwen",
    label: "Vrouwen",
    tekst: "Vrouwelijke profielen.",
    icon: Heart,
  },
] as const;

export function CategoryGrid() {
  return (
    <section id="categorieen" className="content-section content-section--light">
      <div className="container">
        <h2 className="content-section__title">Wat zoek je?</h2>
        <p className="content-section__subtitle">
          Kies een categorie en start direct met zoeken.
        </p>
        <div className="category-card-grid category-card-grid--strong">
          {CATEGORIEEN.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/zoeken?categorie=${cat.slug}`}
                className="category-card category-card--strong"
              >
                <span className="category-card__icon category-card__icon--strong">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className="category-card__title">{cat.label}</span>
                <span className="category-card__text">{cat.tekst}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
