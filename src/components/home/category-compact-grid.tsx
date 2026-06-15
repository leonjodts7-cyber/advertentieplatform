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
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";

const CATEGORIE_META: Record<
  string,
  { icon: typeof UserRound; subtitle: string }
> = {
  "prive-ontvangst": { icon: UserRound, subtitle: "Discrete locaties" },
  escort: { icon: Crown, subtitle: "In jouw regio" },
  massage: { icon: Waves, subtitle: "Wellness & rust" },
  video: { icon: Video, subtitle: "Virtueel contact" },
  koppels: { icon: Users, subtitle: "Voor koppels" },
  trans: { icon: Sparkles, subtitle: "Trans profielen" },
  mannen: { icon: UserRound, subtitle: "Mannelijk" },
  vrouwen: { icon: Heart, subtitle: "Vrouwelijk" },
};

export function CategoryCompactGrid() {
  return (
    <section className="home-listing-block home-listing-block--compact">
      <div className="container">
        <h2 className="home-listing-block__title">Populaire categorieën</h2>
        <div className="category-compact-grid">
          {MARKETPLACE_CATEGORIEEN.map((cat) => {
            const meta = CATEGORIE_META[cat.slug];
            const Icon = meta?.icon ?? UserRound;
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
                    {meta?.subtitle ?? "Bekijk profielen"}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
