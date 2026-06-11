import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfilePhotoPlaceholder } from "@/components/profile-photo-placeholder";
import type { AiCompanion } from "@/lib/ai-companions";
import type { ProfilePhotoVariant } from "@/lib/home-preview-profielen";
import { MessageCircle } from "lucide-react";

interface AiCompanionCardProps {
  companion: AiCompanion;
  ingelogd?: boolean;
  compact?: boolean;
}

export function AiCompanionCard({
  companion,
  ingelogd = false,
  compact = false,
}: AiCompanionCardProps) {
  return (
    <article className="profile-card group overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-warm-glow">
      <div className="relative">
        <ProfilePhotoPlaceholder
          variant={companion.photoVariant as ProfilePhotoVariant}
        />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-3">
          <Badge variant="online">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Online
          </Badge>
          <Badge variant="fictief">Fictief 21+</Badge>
          <Badge variant="credits">{companion.kostenPerBericht} credits</Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141014]/95 via-[#141014]/55 to-transparent p-4 pt-14">
          <p className="font-display text-xl font-medium text-foreground">
            {companion.naam}
            <span className="ml-2 text-base font-normal text-soft-champagne">
              {companion.leeftijd}
            </span>
          </p>
          <p className="mt-0.5 text-sm text-champagne/90">{companion.type}</p>
        </div>
      </div>

      {!compact && (
        <div className="flex flex-col gap-3 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {companion.beschrijving}
          </p>
          {ingelogd ? (
            <Button asChild className="w-full gap-2">
              <Link href={`/ai/${companion.id}`}>
                <MessageCircle className="h-4 w-4" />
                Start gesprek
              </Link>
            </Button>
          ) : (
            <Button asChild variant="secondary" className="w-full">
              <Link href={`/login?redirect=/ai/${companion.id}`}>
                Inloggen om te chatten
              </Link>
            </Button>
          )}
        </div>
      )}

      {compact && (
        <div className="p-3">
          <Button asChild size="sm" variant="secondary" className="w-full">
            <Link href={`/ai/${companion.id}`}>Start gesprek</Link>
          </Button>
        </div>
      )}
    </article>
  );
}
