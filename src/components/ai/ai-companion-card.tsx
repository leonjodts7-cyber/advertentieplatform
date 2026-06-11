import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompanionAvatar } from "@/components/ai/companion-avatar";
import type { AiCompanion } from "@/lib/ai-companions";
import { Coins, MessageCircle } from "lucide-react";

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
    <article className="group luxury-card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-champagne/20 hover:shadow-glow">
      <div className="relative">
        <CompanionAvatar companion={companion} size="card" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant="green">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Online
          </Badge>
          <Badge variant="muted">Fictief 21+</Badge>
          <Badge variant="champagne">{companion.kostenPerBericht} credits</Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-medium text-foreground sm:text-2xl">
                {companion.naam}
                <span className="ml-2 text-base font-normal text-champagne-light/90">
                  {companion.leeftijd}
                </span>
              </h2>
              <p className="mt-0.5 text-sm text-champagne-light">
                {companion.type}
              </p>
            </div>
            <Badge variant="wine" className="shrink-0">
              {companion.badge}
            </Badge>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {companion.beschrijving}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-champagne/70" />
              {companion.kostenPerBericht} credits/bericht
            </span>
            <span className="inline-flex items-center gap-1 capitalize">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: companion.avatarAccent }}
              />
              {companion.kleur}
            </span>
          </div>
          {ingelogd ? (
            <Button asChild className="w-full gap-2">
              <Link href={`/ai/${companion.id}`}>
                <MessageCircle className="h-4 w-4" />
                Chat starten
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
            <Link href={`/ai/${companion.id}`}>Chat starten</Link>
          </Button>
        </div>
      )}
    </article>
  );
}
