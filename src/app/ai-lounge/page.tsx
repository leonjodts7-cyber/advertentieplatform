import Link from "next/link";
import type { Metadata } from "next";
import { AiCompanionCard } from "@/components/ai/ai-companion-card";
import { haalAiPersonages } from "@/lib/ai/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "AI Lounge",
  description:
    "Chat met fictieve volwassen AI Companions op Veloura. Alleen 21+. Credits vereist.",
};

export default async function AiLoungePage() {
  const personages = await haalAiPersonages();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <div className="page-header-band">
        <div className="container">
          <p className="text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
            Veloura AI Lounge
          </p>
          <h1 className="section-title mt-1">AI Companions</h1>
          <p className="section-subtitle mt-2 max-w-2xl">
            Chat met fictieve, volwassen AI-personages (allemaal 21+). Elke
            Companion heeft een unieke persoonlijkheid. Berichten kosten credits
            — er is geen gratis chat.
          </p>
          <div className="mt-4 rounded-xl border border-champagne/20 bg-champagne/5 px-4 py-3 text-sm text-muted-foreground">
            <strong className="text-champagne-light">Belangrijk:</strong> Alle
            AI-personages zijn fictief en expliciet 21+. Geen echte personen.
            Geen expliciete content — wel flirterig, romantisch en speels.
          </div>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        {!user && (
          <div className="glass-panel mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Log in om een gesprek te starten en credits te gebruiken.
            </p>
            <Link
              href="/login"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-champagne/30 px-5 text-sm font-medium text-champagne-light hover:bg-champagne/10"
            >
              Inloggen
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personages.map((p) => (
            <AiCompanionCard key={p.id} personage={p} ingelogd={!!user} />
          ))}
        </div>
      </div>
    </div>
  );
}
