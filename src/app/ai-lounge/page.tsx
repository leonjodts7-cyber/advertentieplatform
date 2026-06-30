import Link from "next/link";
import type { Metadata } from "next";
import { AiCompanionCard } from "@/components/ai/ai-companion-card";
import { Button } from "@/components/ui/button";
import { getAllCompanions, CREDITS_PER_BERICHT } from "@/lib/ai-companions";
import { haalCreditSaldo } from "@/lib/credits";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";

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

  let creditsSaldo = 0;
  if (user) {
    await zorgProfielBestaat(user.id, user.email ?? "");
    creditsSaldo = await haalCreditSaldo(user.id);
  }

  return (
    <div className="ai-lounge-page">
      <section className="ai-lounge-hero">
        <div className="container">
          <p className="ai-lounge-hero__eyebrow">Veloura · Aparte ervaring</p>
          <h1 className="ai-lounge-hero__title">AI Lounge</h1>
          <p className="ai-lounge-hero__subtitle">
            Chat met fictieve volwassen companions. Elke companion heeft een eigen
            persoonlijkheid — betaal per bericht met credits.
          </p>
          <div className="ai-lounge-meta">
            <span>{companions.length} companions beschikbaar</span>
            <span>{CREDITS_PER_BERICHT} credits per bericht</span>
            <span>Fictief 21+</span>
          </div>
          <p className="ai-lounge-compliance">
            Fictieve AI-personages · geen echte personen · alleen 18+
          </p>

          <div className="ai-lounge-hero__actions">
            {user ? (
              <>
                <p className="ai-lounge-hero__credits">
                  Jouw saldo: <strong>{creditsSaldo}</strong> credits
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/credits">Credits kopen</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="sm">
                  <Link href="/login?redirect=/ai-lounge">Inloggen om te chatten</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/login?redirect=/credits">Prijzen & credits</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="container ai-lounge-body">
        <div className="ai-lounge-grid">
          {companions.map((companion) => (
            <AiCompanionCard
              key={companion.id}
              companion={companion}
              ingelogd={!!user}
              creditsSaldo={creditsSaldo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
