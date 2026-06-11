"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AiPersonage } from "@/lib/ai-types";
import { cn } from "@/lib/utils";

interface AiCompanionCardProps {
  personage: AiPersonage;
  ingelogd: boolean;
}

export function AiCompanionCard({ personage, ingelogd }: AiCompanionCardProps) {
  return (
    <article className="luxury-card group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-glow">
      <div
        className={cn(
          "relative aspect-[4/3] bg-gradient-to-br",
          personage.gradient
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070a]/90 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {personage.online && (
            <Badge variant="green">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Online
            </Badge>
          )}
          <Badge variant="muted">{personage.leeftijd}+ · fictief</Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h2 className="font-display text-xl font-medium text-foreground">
            {personage.naam}
          </h2>
          <p className="mt-0.5 text-sm text-champagne-light">
            {personage.persoonlijkheid}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {personage.beschrijving}
        </p>
        <p className="text-xs text-muted-foreground/80">
          2 credits per bericht · geen gratis chat
        </p>
        {ingelogd ? (
          <Button asChild className="w-full">
            <Link href={`/ai/${personage.slug}`}>Start gesprek</Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/login?redirect=/ai/${personage.slug}`}>
              Inloggen om te chatten
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
