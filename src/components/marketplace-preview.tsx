import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PREVIEWS = [
  {
    label: "Geverifieerd",
    badge: "Geverifieerd",
    variant: "champagne" as const,
    gradient: "soft-gradient",
    className: "left-0 top-0 z-10 w-[46%] -rotate-2 md:-rotate-3",
  },
  {
    label: "Beschikbaar vandaag",
    badge: "Live",
    variant: "rose" as const,
    gradient: "rose-gradient",
    className: "right-0 top-3 z-20 w-[50%] rotate-2",
  },
  {
    label: "Video mogelijk",
    badge: "Video",
    variant: "muted" as const,
    gradient: "soft-gradient",
    className: "left-[6%] bottom-0 z-30 w-[44%] rotate-1 md:absolute",
  },
  {
    label: "Premium listing",
    badge: "Premium",
    variant: "champagne" as const,
    gradient: "rose-gradient",
    className: "right-[4%] bottom-1 z-40 w-[48%] -rotate-1 md:absolute",
  },
];

export function MarketplacePreview() {
  return (
    <>
      {/* Desktop: overlapping collage */}
      <div className="relative mx-auto hidden h-[280px] max-w-sm md:block lg:h-[300px] lg:max-w-md">
        <div className="absolute inset-6 rounded-3xl bg-veloura-rose/5 blur-3xl" />
        {PREVIEWS.map((preview) => (
          <div
            key={preview.label}
            className={cn(
              "luxury-card absolute overflow-hidden transition-transform duration-300 hover:z-50 hover:scale-[1.02]",
              preview.className
            )}
          >
            <div
              className={cn(
                "thumbnail-gradient relative aspect-[3/4]",
                preview.gradient
              )}
            >
              <div className="relative z-10 flex h-full flex-col justify-end p-3">
                <Badge variant={preview.variant} className="mb-1.5 w-fit">
                  {preview.badge}
                </Badge>
                <p className="font-display text-xs text-veloura-ivory/95 sm:text-sm">
                  {preview.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: stacked grid */}
      <div className="grid grid-cols-2 gap-2.5 md:hidden">
        {PREVIEWS.map((preview) => (
          <div key={preview.label} className="luxury-card overflow-hidden">
            <div className={cn("thumbnail-gradient relative aspect-[4/5]", preview.gradient)}>
              <div className="relative z-10 flex h-full flex-col justify-end p-3">
                <Badge variant={preview.variant} className="mb-1 w-fit text-[0.6rem]">
                  {preview.badge}
                </Badge>
                <p className="font-display text-xs text-veloura-ivory">{preview.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
