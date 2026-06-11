import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PREVIEWS = [
  {
    label: "Geverifieerd profiel",
    badge: "Geverifieerd",
    badgeVariant: "green" as const,
    gradient: "from-bordeaux via-bordeaux-light/80 to-champagne/40",
    className: "left-0 top-0 z-10 w-[48%] -rotate-3",
  },
  {
    label: "Beschikbaar vandaag",
    badge: "Live",
    badgeVariant: "gold" as const,
    gradient: "from-champagne/50 via-bordeaux/70 to-background",
    className: "right-0 top-4 z-20 w-[52%] rotate-2",
  },
  {
    label: "Video mogelijk",
    badge: "Video",
    badgeVariant: "bordeaux" as const,
    gradient: "from-bordeaux-light/90 via-bordeaux/60 to-champagne/25",
    className: "left-[8%] bottom-0 z-30 w-[46%] rotate-1",
  },
  {
    label: "Premium listing",
    badge: "Premium",
    badgeVariant: "gold" as const,
    gradient: "from-champagne/60 via-bordeaux/80 to-bordeaux-light/50",
    className: "right-[6%] bottom-2 z-40 w-[50%] -rotate-2",
  },
];

export function MarketplacePreview() {
  return (
    <div className="relative mx-auto h-[280px] w-full max-w-md sm:h-[300px] lg:h-[320px]">
      <div className="premium-glow absolute inset-4 rounded-3xl bg-champagne/5 blur-2xl" />
      {PREVIEWS.map((preview) => (
        <div
          key={preview.label}
          className={cn(
            "premium-card absolute overflow-hidden shadow-premium transition-transform duration-300 hover:z-50 hover:scale-[1.02]",
            preview.className
          )}
        >
          <div
            className={cn(
              "gradient-placeholder relative aspect-[3/4] bg-gradient-to-br",
              preview.gradient
            )}
          >
            <div className="relative z-10 flex h-full flex-col justify-end p-3">
              <Badge variant={preview.badgeVariant} className="mb-1.5 w-fit">
                {preview.badge}
              </Badge>
              <p className="font-display text-xs font-medium text-foreground/95 sm:text-sm">
                {preview.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
