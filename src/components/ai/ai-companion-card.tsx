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
}

export function AiCompanionCard({
  companion,
  ingelogd = false,
}: AiCompanionCardProps) {
  return (
    <article className="ai-companion-card group">
      <div className="ai-companion-card__media">
        <ProfilePhotoPlaceholder
          variant={companion.photoVariant as ProfilePhotoVariant}
          aspect="cover"
          className="!aspect-auto h-full min-h-[7.5rem] w-full"
        />
        <div className="ai-companion-card__badges">
          <Badge variant="online" className="text-[0.5625rem]">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Online
          </Badge>
          <Badge variant="fictief" className="text-[0.5625rem]">
            Fictief 21+
          </Badge>
        </div>
      </div>

      <div className="ai-companion-card__body">
        <div className="ai-companion-card__head">
          <h2 className="ai-companion-card__name">
            {companion.naam}
            <span className="ai-companion-card__age">{companion.leeftijd}</span>
          </h2>
          <p className="ai-companion-card__type">{companion.type}</p>
        </div>

        <div className="ai-companion-card__tags">
          <span className="ai-companion-card__tag">{companion.badge}</span>
        </div>

        <p className="ai-companion-card__desc">{companion.beschrijving}</p>

        <p className="ai-companion-card__price">
          {companion.kostenPerBericht} credits per bericht
        </p>

        {ingelogd ? (
          <Button asChild className="ai-companion-card__cta w-full gap-2" size="sm">
            <Link href={`/ai/${companion.id}`}>
              <MessageCircle className="h-4 w-4" aria-hidden />
              Chat nu
            </Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" className="ai-companion-card__cta w-full" size="sm">
            <Link href={`/login?redirect=/ai/${companion.id}`}>
              Inloggen om te chatten
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
