import Link from "next/link";
import {
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
    tekst: "Discrete ontmoetingen op privélocatie.",
    icon: UserRound,
  },
  {
    slug: "escort",
    label: "Escort",
    tekst: "Stijlvolle escortdiensten in jouw regio.",
    icon: Sparkles,
  },
  {
    slug: "massage",
    label: "Massage",
    tekst: "Wellness en ontspanning bij aanbieders.",
    icon: Waves,
  },
  {
    slug: "video",
    label: "Video",
    tekst: "Virtuele afspraken, flexibel en discreet.",
    icon: Video,
  },
  {
    slug: "koppels",
    label: "Koppels",
    tekst: "Profielen en diensten voor koppels.",
    icon: Users,
  },
  {
    slug: "trans",
    label: "Trans",
    tekst: "Transgender profielen en diensten.",
    icon: UserRound,
  },
  {
    slug: "mannen",
    label: "Mannen",
    tekst: "Mannelijke aanbieders en profielen.",
    icon: UserRound,
  },
  {
    slug: "vrouwen",
    label: "Vrouwen",
    tekst: "Vrouwelijke aanbieders en profielen.",
    icon: Heart,
  },
] as const;

export function CategoryGrid() {
  return (
    <section id="categorieen" className="content-section content-section--light">
      <div className="container">
        <h2 className="content-section__title">Wat zoek je?</h2>
        <div className="category-card-grid">
          {CATEGORIEEN.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/zoeken?categorie=${cat.slug}`}
                className="category-card"
              >
                <span className="category-card__icon">
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
