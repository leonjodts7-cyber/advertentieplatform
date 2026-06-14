import Link from "next/link";
import { Home, Sparkles, Video, Waves } from "lucide-react";

const QUICK_PICKS = [
  {
    slug: "prive-ontvangst",
    label: "Privé ontvangst",
    beschrijving: "Discrete ontmoetingen op privélocatie in jouw buurt.",
    icon: Home,
    gradient: "from-[#7b2f49]/20 to-[#b87955]/10",
  },
  {
    slug: "escort",
    label: "Escort",
    beschrijving: "Stijlvolle escortdiensten met direct contact.",
    icon: Sparkles,
    gradient: "from-[#b87955]/20 to-[#d6b36b]/10",
  },
  {
    slug: "massage",
    label: "Massage",
    beschrijving: "Wellness en ontspanning bij erkende aanbieders.",
    icon: Waves,
    gradient: "from-[#7b2f49]/15 to-[#211820]/40",
  },
  {
    slug: "video",
    label: "Video",
    beschrijving: "Virtuele afspraken, discreet en flexibel.",
    icon: Video,
    gradient: "from-[#b87955]/15 to-[#7b2f49]/10",
  },
] as const;

export function DiscoveryQuickPick() {
  return (
    <section className="discovery-section discovery-section--light">
      <div className="container">
        <h2 className="font-display text-xl font-medium text-[#24191f] sm:text-2xl">
          Wat zoek je vandaag?
        </h2>
        <div className="discovery-quick-grid mt-5">
          {QUICK_PICKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.slug}
                href={`/zoeken?categorie=${item.slug}`}
                className="discovery-quick-card group"
              >
                <div
                  className={`discovery-quick-card__icon bg-gradient-to-br ${item.gradient}`}
                >
                  <Icon className="h-6 w-6 text-[#d6b36b]" strokeWidth={1.5} />
                </div>
                <h3 className="discovery-quick-card__title">{item.label}</h3>
                <p className="discovery-quick-card__desc">{item.beschrijving}</p>
                <span className="discovery-quick-card__cta">Ontdek →</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
