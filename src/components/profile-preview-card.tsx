import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
      return "new" as const;
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
        "online-profile-card group block overflow-hidden rounded-2xl transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-warm-glow",
        className
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={profiel.afbeelding}
          alt={`${profiel.naam}, ${profiel.leeftijd}`}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw"
        />

        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1 p-2.5 sm:gap-1.5 sm:p-3">
          {profiel.badges.map((b) => (
            <Badge key={b.label} variant={badgeVariant(b.variant)}>
              {b.variant === "online" && (
                <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              )}
              {b.label}
            </Badge>
          ))}
        </div>

        <div className="profile-card__overlay absolute inset-0" />

        <div className="absolute inset-x-0 bottom-0 p-3 pt-10 sm:p-4 sm:pt-12">
          <p className="profile-card__overlay-text font-display text-base font-medium leading-tight sm:text-lg">
            {profiel.naam}
            <span className="profile-card__overlay-accent ml-1.5 text-sm font-normal sm:ml-2 sm:text-base">
              {profiel.leeftijd}
            </span>
          </p>
          <p className="profile-card__overlay-muted mt-0.5 text-xs sm:text-sm">
            {profiel.stad}
          </p>
          <p className="profile-card__overlay-muted mt-0.5 text-xs opacity-90 sm:text-sm">
            {profiel.type}
          </p>
        </div>
      </div>
    </Link>
  );
}
