import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const previewCards = [
  {
    label: "Geverifieerd profiel",
    badge: "Geverifieerd",
    badgeVariant: "green" as const,
    className: "left-0 top-0 z-10 w-[46%] sm:w-[44%]",
    gradient: "from-[#5a1f35] via-[#3a2033] to-[#21131b]",
  },
  {
    label: "Beschikbaar vandaag",
    badge: "Beschikbaar",
    badgeVariant: "green" as const,
    className: "right-0 top-6 z-20 w-[46%] sm:top-8 sm:w-[44%]",
    gradient: "from-[#3a2033] via-[#21131b] to-[#171016]",
  },
  {
    label: "Premium listing",
    badge: "Premium",
    badgeVariant: "champagne" as const,
    className: "left-[8%] top-[28%] z-30 w-[48%] sm:left-[10%] sm:top-[30%]",
    gradient: "from-[#21131b] via-[#5a1f35] to-[#3a2033]",
  },
  {
    label: "Video mogelijk",
    badge: "Video",
    badgeVariant: "wine" as const,
    className: "right-[4%] top-[42%] z-[25] w-[42%] sm:right-[6%]",
    gradient: "from-[#171016] via-[#3a2033] to-[#21131b]",
  },
  {
    label: "Discreet contact",
    badge: "Nieuw",
    badgeVariant: "champagne" as const,
    className: "bottom-0 left-[18%] z-40 w-[52%] sm:left-[20%]",
    gradient: "from-[#5a1f35] via-[#21131b] to-[rgba(202,164,93,0.2)]",
  },
];

export function MarketplacePreview() {
  return (
    <div className="relative hidden lg:block">
      <div className="relative mx-auto h-[420px] max-w-md">
        {previewCards.map((card, i) => (
          <div
            key={card.label}
            className={cn(
              "absolute luxury-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow",
              card.className
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div
              className={cn(
                "relative aspect-[3/4] bg-gradient-to-br",
                card.gradient
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#08070a]/80 via-transparent to-transparent" />
              <div className="absolute left-2.5 top-2.5">
                <Badge variant={card.badgeVariant}>{card.badge}</Badge>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-display text-sm font-medium text-foreground">
                  {card.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[0.6875rem] text-muted-foreground">
        Voorbeeldweergave — geen echte profielen
      </p>
    </div>
  );
}
