import Link from "next/link";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {MARKETPLACE_CATEGORIEEN.map((cat) => (
        <Link
          key={cat.slug}
          href={`/zoeken?categorie=${cat.slug}`}
          className="category-card"
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
