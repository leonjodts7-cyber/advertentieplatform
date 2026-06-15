import Image from "next/image";
import Link from "next/link";
import { CATEGORIE_AFBEELDINGEN } from "@/lib/categorie-afbeeldingen";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";

interface CategoryShowcaseProps {
  tellingen: Record<string, number>;
}

export function CategoryShowcase({ tellingen }: CategoryShowcaseProps) {
  return (
    <section className="home-listing-block">
      <div className="container">
        <h2 className="home-listing-block__title">Populaire categorieën</h2>
        <div className="category-showcase-grid">
          {MARKETPLACE_CATEGORIEEN.map((cat) => {
            const count = tellingen[cat.slug] ?? 0;
            return (
              <Link
                key={cat.slug}
                href={`/zoeken?categorie=${cat.slug}`}
                className="category-showcase-card group"
              >
                <div className="category-showcase-card__image">
                  <Image
                    src={CATEGORIE_AFBEELDINGEN[cat.slug]}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="category-showcase-card__overlay" />
                </div>
                <div className="category-showcase-card__content">
                  <h3 className="category-showcase-card__title">{cat.label}</h3>
                  <p className="category-showcase-card__count">
                    {count} {count === 1 ? "advertentie" : "advertenties"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
