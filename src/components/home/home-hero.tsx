import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeHeroSearch } from "@/components/home/home-hero-search";

export function HomeHeroCompact() {
  return (
    <section className="home-hero-compact">
      <div className="container">
        <div className="home-hero-compact__grid">
          <div className="home-hero-compact__copy">
            <h1 className="home-hero-compact__title">
              Vind discrete profielen in jouw regio
            </h1>
            <p className="home-hero-compact__subtitle">
              Zoek snel op regio, categorie en voorkeuren. Discreet, mobiel-first
              en direct naar relevante profielen.
            </p>
            <Button asChild size="md" className="home-hero-compact__cta">
              <Link href="/zoeken">Zoek profielen</Link>
            </Button>
          </div>
          <div className="home-hero-compact__search">
            <HomeHeroSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
