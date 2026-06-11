import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProfilePhotoPlaceholder } from "@/components/profile-photo-placeholder";
import type { HomePreviewProfiel } from "@/lib/home-preview-profielen";
import { cn } from "@/lib/utils";

function badgeVariant(v: HomePreviewProfiel["badges"][0]["variant"]) {
  switch (v) {
    case "online":
      return "online" as const;
    case "verified":
      return "verified" as const;
    case "premium":
      return "premium" as const;
    case "new":
      return "review" as const;
    case "popular":
      return "premium" as const;
  }
}

interface ProfilePreviewCardProps {
  profiel: HomePreviewProfiel;
  href?: string;
  className?: string;
}

export function ProfilePreviewCard({
  profiel,
  href = "/zoeken",
  className,
}: ProfilePreviewCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "profile-card group block overflow-hidden transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-warm-glow",
        className
      )}
    >
      <div className="relative">
        <ProfilePhotoPlaceholder variant={profiel.photoVariant} />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-3">
          {profiel.badges.map((b) => (
            <Badge key={b.label} variant={badgeVariant(b.variant)}>
              {b.variant === "online" && (
                <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              )}
              {b.label}
            </Badge>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141014]/95 via-[#141014]/50 to-transparent p-4 pt-12">
          <p className="font-display text-lg font-medium text-foreground">
            {profiel.naam}
            <span className="ml-2 text-base font-normal text-soft-champagne">
              {profiel.leeftijd}
            </span>
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {profiel.stad} · {profiel.type}
          </p>
        </div>
      </div>
    </Link>
  );
}
