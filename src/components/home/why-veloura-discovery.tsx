import { ShieldCheck, Smartphone, Zap } from "lucide-react";

const VOORDELEN = [
  {
    titel: "Geverifieerde profielen",
    tekst: "Herken betrouwbare aanbieders via verificatie en duidelijke profielinformatie.",
    icon: ShieldCheck,
  },
  {
    titel: "Snelle zoekervaring",
    tekst: "Filter op stad, categorie en beschikbaarheid — vind snel wat je zoekt.",
    icon: Zap,
  },
  {
    titel: "Discreet en mobiel-vriendelijk",
    tekst: "Veloura is gebouwd voor je telefoon, met een discrete premium uitstraling.",
    icon: Smartphone,
  },
] as const;

export function WhyVelouraDiscovery() {
  return (
    <section className="discovery-section discovery-section--light">
      <div className="container">
        <h2 className="font-display text-xl font-medium text-[#24191f] sm:text-2xl">
          Waarom bezoekers voor Veloura kiezen
        </h2>
        <div className="discovery-trust-grid mt-5">
          {VOORDELEN.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.titel} className="discovery-trust-card">
                <div className="discovery-trust-card__icon">
                  <Icon className="h-5 w-5 text-[#7b2f49]" strokeWidth={1.5} />
                </div>
                <h3 className="discovery-trust-card__title">{item.titel}</h3>
                <p className="discovery-trust-card__text">{item.tekst}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
