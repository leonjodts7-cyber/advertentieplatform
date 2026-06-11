import { Badge } from "@/components/ui/badge";

const PREVIEWS = [
  {
    label: "Premium profiel",
    gradient: "from-bordeaux/80 via-bordeaux-light/60 to-champagne/30",
    badge: "Exclusief",
    badgeVariant: "gold" as const,
  },
  {
    label: "Geverifieerd",
    gradient: "from-champagne/40 via-bordeaux/50 to-background",
    badge: "Geverifieerd",
    badgeVariant: "success" as const,
  },
  {
    label: "Beschikbaar vandaag",
    gradient: "from-bordeaux-light/70 via-bordeaux/40 to-champagne/20",
    badge: "Beschikbaar",
    badgeVariant: "bordeaux" as const,
  },
];

export function HeroPreviewCards() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
      {PREVIEWS.map((preview, i) => (
        <div
          key={preview.label}
          className="card-premium group overflow-hidden animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div
            className={`gradient-placeholder relative aspect-[3/4] bg-gradient-to-br ${preview.gradient}`}
          >
            <div className="relative z-10 flex h-full flex-col justify-end p-3 sm:p-4">
              <Badge variant={preview.badgeVariant} className="mb-2 w-fit">
                {preview.badge}
              </Badge>
              <p className="font-display text-sm font-medium text-foreground/90 sm:text-base">
                {preview.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
