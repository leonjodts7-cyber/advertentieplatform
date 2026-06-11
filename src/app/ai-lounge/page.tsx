import Link from "next/link";
import type { Metadata } from "next";
import { AiCompanionCard } from "@/components/ai/ai-companion-card";
import {
  AiLoungeCreditsInfo,
  AiLoungeStats,
} from "@/components/ai/ai-lounge-stats";
import { getAllCompanions } from "@/lib/ai-companions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "AI Lounge",
  description:
    "Chat met fictieve volwassen AI companions op Veloura. 21+. Credits per bericht.",
};

export default async function AiLoungePage() {
  const companions = getAllCompanions();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <div className="page-header-band">
        <div className="container">
          <p className="text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Veloura Premium
          </p>
          <h1 className="section-title mt-1">AI Lounge</h1>
          <p className="section-subtitle mt-2 max-w-2xl">
            Chat met fictieve volwassen AI companions. Elk bericht kost credits.
          </p>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground">
            Alle AI companions zijn{" "}
            <strong className="text-foreground">
              fictieve volwassen personages van 21+
            </strong>
            . Geen echte personen. Geen expliciete content.
          </div>
        </div>
      </div>

      <div className="container space-y-6 py-6 sm:space-y-8 sm:py-8">
        <AiLoungeStats />
        <AiLoungeCreditsInfo />

        {!user && (
          <div className="velvet-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="text-sm text-muted-foreground">
              Log in om een gesprek te starten. Credits zijn vereist per
              bericht.
            </p>
            <Link
              href="/login?redirect=/ai-lounge"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full champagne-gradient px-6 text-sm font-medium text-background"
            >
              Inloggen
            </Link>
          </div>
        )}

        <div>
          <h2 className="font-display text-lg text-foreground sm:text-xl">
            Kies jouw companion
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Premium AI-personages — klaar voor discreet chatten
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companions.map((companion) => (
              <AiCompanionCard
                key={companion.id}
                companion={companion}
                ingelogd={!!user}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
