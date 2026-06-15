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
              Zoek op regio, categorie, voorkeuren en beschikbaarheid. Snel,
              discreet en mobiel-first.
            </p>
            <p className="home-hero-compact__trust">
              Alleen 18+ · Discreet · Geverifieerde profielen
            </p>
          </div>
          <div className="home-hero-compact__search">
            <HomeHeroSearch />
          </div>
        </div>
      </div>
    </section>
  );
}
