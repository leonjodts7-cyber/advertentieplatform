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
              Zoek snel op regio, categorie en voorkeuren. Discreet, premium en
              alleen 18+.
            </p>
            <p className="home-hero-compact__trust">
              Geverifieerde profielen · Discreet contact · Premium listings
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
