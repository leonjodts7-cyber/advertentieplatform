import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompanionVisual } from "@/components/ai/companion-visual";
import type { AiCompanion } from "@/lib/ai-companions";
import { MessageCircle } from "lucide-react";

interface AiCompanionCardProps {
  companion: AiCompanion;
  ingelogd?: boolean;
  creditsSaldo?: number;
  featured?: boolean;
}

export function AiCompanionCard({
  companion,
  ingelogd = false,
  creditsSaldo = 0,
  featured = false,
}: AiCompanionCardProps) {
  const heeftCredits = creditsSaldo >= companion.kostenPerBericht;

  return (
    <article className={`ai-companion-card group${featured ? " ai-companion-card--featured" : ""}`}>
      <div className="ai-companion-card__media">
        <CompanionVisual companion={companion} priority={companion.id === "valentina"} />
        <div className="ai-companion-card__badges">
          <Badge variant="fictief" className="ai-companion-card__badge">
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
          {companion.traits.slice(0, 2).map((trait) => (
            <span key={trait} className="ai-companion-card__tag">
              {trait}
            </span>
          ))}
        </div>

        <p className="ai-companion-card__desc">{companion.beschrijving}</p>

        <p className="ai-companion-card__price">
          {companion.kostenPerBericht} credits / bericht
        </p>

        {ingelogd ? (
          heeftCredits ? (
            <Button
              asChild
              className="ai-companion-card__cta w-full gap-1.5"
              size="sm"
            >
              <Link href={`/ai/${companion.id}`}>
                <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                Chat nu
              </Link>
            </Button>
          ) : (
            <Button asChild className="ai-companion-card__cta w-full" size="sm">
              <Link href="/credits">Credits kopen</Link>
            </Button>
          )
        ) : (
          <Button
            asChild
            variant="secondary"
            className="ai-companion-card__cta w-full"
            size="sm"
          >
            <Link href={`/login?redirect=/ai/${companion.id}`}>
              Inloggen om te chatten
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
