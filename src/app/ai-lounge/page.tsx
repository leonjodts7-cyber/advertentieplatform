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
    <div className="ai-lounge-page">
      <section className="ai-lounge-hero">
        <div className="container">
          <h1 className="section-title text-2xl sm:text-3xl">AI Lounge</h1>
          <p className="section-subtitle mt-2 max-w-2xl">
            Chat met fictieve volwassen companions. Betaal per bericht met
            credits.
          </p>
          <div className="ai-lounge-meta">
            <span>{companions.length} companions online</span>
            <span>{CREDITS_PER_BERICHT} credits per bericht</span>
            <span>Geen gratis chat</span>
          </div>
          <p className="ai-lounge-compliance">
            Fictieve AI-personages 21+ · geen echte personen
          </p>
        </div>
      </section>

      <div className="container py-5 sm:py-7">
        {!user && (
          <div className="profile-card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p className="text-sm text-[#c2b4ab]">
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

        <div className="ai-lounge-grid">
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
