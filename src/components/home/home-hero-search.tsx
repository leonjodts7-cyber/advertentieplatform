"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryChip } from "@/components/ui/category-chip";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";

export function HomeHeroSearch() {
  const router = useRouter();
  const [stad, setStad] = useState("");
  const [categorie, setCategorie] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (stad.trim()) params.set("stad", stad.trim());
    if (categorie) params.set("categorie", categorie);
    router.push(`/zoeken${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="hero-search-card hero-search-card--premium">
      <h2 className="hero-search-card__title">Start je zoektocht</h2>
      <div className="hero-search-card__fields">
        <div>
          <label htmlFor="home-stad" className="filter-label filter-label--dark">
            Stad / regio
          </label>
          <Input
            id="home-stad"
            variant="dark"
            size="compact"
            placeholder="Bijv. Antwerpen"
            value={stad}
            onChange={(e) => setStad(e.target.value)}
          />
        </div>
        <div>
          <p className="filter-label filter-label--dark">Categorie</p>
          <div className="category-chip-scroll no-scrollbar">
            {MARKETPLACE_CATEGORIEEN.map((cat) => (
              <CategoryChip
                key={cat.slug}
                label={cat.label}
                active={categorie === cat.slug}
                onClick={() =>
                  setCategorie(categorie === cat.slug ? null : cat.slug)
                }
              />
            ))}
          </div>
        </div>
      </div>
      <Button type="submit" size="md" className="w-full">
        Toon profielen
      </Button>
      <div className="hero-search-card__links">
        <Link href="/zoeken" className="hero-search-card__link">
          Uitgebreid zoeken
        </Link>
        <Link href="/zoeken?ai=1" className="hero-search-card__link hero-search-card__link--subtle">
          Beschrijf je wens
        </Link>
      </div>
    </form>
  );
}
