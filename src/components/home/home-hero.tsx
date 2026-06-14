import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeSearchTabs } from "@/components/home/home-search-tabs";

export function HomeHeroCompact() {
  return (
    <section className="home-hero-compact">
      <div className="container">
        <div className="home-hero-compact__grid">
          <div className="home-hero-compact__copy order-2 lg:order-1 animate-fade-in">
            <p className="home-hero-compact__trust">
              Alleen 18+ · Discreet · Geverifieerd
            </p>
            <h1 className="home-hero-compact__title">
              Vind discrete profielen in jouw regio
            </h1>
            <p className="home-hero-compact__subtitle">
              Zoek op regio, type dienst, leeftijd, prijs en voorkeuren. Snel,
              discreet en mobiel-first.
            </p>
            <div className="home-hero-compact__actions">
              <Button asChild size="md" className="w-full sm:w-auto">
                <Link href="/zoeken">Zoek profielen</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
              >
                <Link href="#categorieen">Ontdek categorieën</Link>
              </Button>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <HomeSearchTabs />
          </div>
        </div>
      </div>
    </section>
  );
}
