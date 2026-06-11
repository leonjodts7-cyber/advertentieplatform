import { Badge } from "@/components/ui/badge";

const previewProfiles = [
  {
    titel: "Geverifieerd profiel",
    subtitel: "Antwerpen",
    badges: ["success", "premium"] as const,
    gradient: "from-[#f5d5cf] via-[#f1d8d2] to-[#fae8c8]",
  },
  {
    titel: "Beschikbaar vandaag",
    subtitel: "Gent",
    badges: ["green"] as const,
    gradient: "from-[#fceee8] via-[#f8ede7] to-[#f1d8d2]",
  },
  {
    titel: "Premium listing",
    subtitel: "Brussel",
    badges: ["premium"] as const,
    gradient: "from-[#fae8c8] via-[#f5d5cf] to-[#f1d8d2]",
  },
];

const badgeMap = {
  success: { label: "Verifieerd", variant: "success" as const },
  premium: { label: "Premium", variant: "premium" as const },
  green: { label: "Beschikbaar", variant: "green" as const },
};

export function MarketplacePreview() {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {previewProfiles.map((profile, i) => (
          <div
            key={profile.titel}
            className={`luxury-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card ${
              i === 0 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <div
              className={`relative aspect-[3/4] rounded-t-2xl bg-gradient-to-br ${profile.gradient}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#241718]/8 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                {profile.badges.map((b) => (
                  <Badge key={b} variant={badgeMap[b].variant}>
                    {badgeMap[b].label}
                  </Badge>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-base font-medium text-foreground sm:text-lg">
                  {profile.titel}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {profile.subtitel}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Voorbeeldweergave — geen echte profielen
      </p>
    </div>
  );
}
