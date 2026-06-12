const VOORDELEN = [
  {
    titel: "Discreet zoeken",
    tekst: "Zoek op stad en categorie zonder opdringerige uitstraling. Jij bepaalt wat je deelt.",
  },
  {
    titel: "Direct contact",
    tekst: "Neem rechtstreeks contact op met aanbieders. Geen tussenpersonen, geen gedoe.",
  },
  {
    titel: "Geverifieerde profielen",
    tekst: "Herken betrouwbare aanbieders via verificatie en duidelijke profielinformatie.",
  },
  {
    titel: "Mobiel-first ervaring",
    tekst: "Veloura is gebouwd voor je telefoon — snel browsen, duidelijke profielkaarten.",
  },
];

export function WhyVeloura() {
  return (
    <section className="marketplace-section border-b border-white/10">
      <div className="container">
        <h2 className="section-title">Waarom Veloura?</h2>
        <p className="section-subtitle mt-1 max-w-lg">
          Premium marketplace voor volwassenen die discretie en kwaliteit waarderen.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VOORDELEN.map((v) => (
            <div
              key={v.titel}
              className="profile-card p-4 transition-all hover:shadow-warm-glow sm:p-5"
            >
              <h3 className="font-display text-base font-medium text-foreground sm:text-lg">
                {v.titel}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {v.tekst}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
