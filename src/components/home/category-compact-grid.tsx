import Link from "next/link";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";

export function CategoryCompactGrid() {
  return (
    <section className="home-listing-block home-listing-block--compact">
      <div className="container">
        <h2 className="home-listing-block__title">Populaire categorieën</h2>
        <div className="category-compact-grid">
          {MARKETPLACE_CATEGORIEEN.map((cat) => (
            <Link
              key={cat.slug}
              href={`/zoeken?categorie=${cat.slug}`}
              className="category-compact-card"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
