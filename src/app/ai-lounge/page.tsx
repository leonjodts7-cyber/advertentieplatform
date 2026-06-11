import Link from "next/link";
import type { Metadata } from "next";
import { AiCompanionCard } from "@/components/ai/ai-companion-card";
import { getAllCompanions, CREDITS_PER_BERICHT } from "@/lib/ai-companions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "AI Lounge",
  description:
    "Kies een fictieve volwassen companion en chat per bericht met credits op Veloura.",
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
          <h1 className="section-title">AI Lounge</h1>
          <p className="section-subtitle mt-2 max-w-2xl">
            Kies een fictieve volwassen companion en chat per bericht met credits.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Alle companions zijn fictieve volwassen AI-personages van 21+. Geen
            echte personen.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              {companions.length} companions online
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              {CREDITS_PER_BERICHT} credits per bericht
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              Geen gratis chat
            </span>
          </div>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        {!user && (
          <div className="profile-card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="text-sm text-muted-foreground">
              Log in om een gesprek te starten.
            </p>
            <Link
              href="/login?redirect=/ai-lounge"
              className="champagne-button min-h-[44px] px-6 text-sm"
            >
              Inloggen
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
