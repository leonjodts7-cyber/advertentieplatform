import Link from "next/link";
import {
  Building2,
  Crown,
  Heart,
  Hotel,
  Sparkles,
  Video,
} from "lucide-react";
import { SectionHeader } from "@/components/home/section-header";

const CATEGORIES = [
  {
    slug: "prive-huizen",
    label: "Privéhuizen",
    icon: Building2,
    placeholderCount: 86,
  },
  {
    slug: "escort",
    label: "Escort",
    icon: Crown,
    placeholderCount: 312,
  },
  {
    slug: "massage",
    label: "Massage",
    icon: Sparkles,
    placeholderCount: 124,
  },
  {
    slug: "rendez-vous-hotels",
    label: "Hotels",
    icon: Hotel,
    placeholderCount: 48,
  },
  {
    slug: "parenclubs",
    label: "Parenclubs",
    icon: Heart,
    placeholderCount: 37,
  },
  {
    slug: "video",
    label: "Video",
    icon: Video,
    placeholderCount: 92,
  },
] as const;

interface CategoryDiscoveryProps {
  counts: Record<string, number>;
}

export function CategoryDiscovery({ counts }: CategoryDiscoveryProps) {
  return (
    <section className="discovery-section">
      <div className="container">
        <SectionHeader
          title="Populaire categorieën"
          subtitle="Ontdek per type dienst"
        />
        <div className="discovery-category-grid mt-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = counts[cat.slug] ?? 0;
            const displayCount = count > 0 ? count : cat.placeholderCount;

            return (
              <Link
                key={cat.slug}
                href={`/zoeken?categorie=${cat.slug}`}
                className="discovery-category-card group"
              >
                <div className="discovery-category-card__icon">
                  <Icon className="h-5 w-5 text-[#d6b36b]" strokeWidth={1.5} />
                </div>
                <div className="discovery-category-card__content">
                  <h3 className="discovery-category-card__title">
                    {cat.label}
                  </h3>
                  <p className="discovery-category-card__count">
                    {displayCount} advertenties
                  </p>
                </div>
                <span className="discovery-category-card__arrow">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
