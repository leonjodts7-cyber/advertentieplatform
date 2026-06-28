import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CreditsKopen } from "@/components/credits/credits-kopen";
import { haalCreditPakketten, haalCreditSaldo } from "@/lib/credits";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";

export const metadata: Metadata = {
  title: "Credits",
  description: "Koop credits voor de Veloura AI Lounge.",
};

interface CreditsPageProps {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}

export default async function CreditsPage({ searchParams }: CreditsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/credits");

  await zorgProfielBestaat(user.id, user.email ?? "");

  const saldo = await haalCreditSaldo(user.id);
  const pakketten = await haalCreditPakketten();
  const { success, cancelled } = await searchParams;

  return (
    <div>
      <div className="page-header-band">
        <div className="container">
          <Link
            href="/ai-lounge"
            className="text-sm text-muted-foreground hover:text-champagne-light"
          >
            ← AI Lounge
          </Link>
          <h1 className="section-title mt-2">Credits</h1>
          <p className="section-subtitle mt-1">
            Koop credits om te chatten met AI Companions. Elk bericht kost 2
            credits.
          </p>
        </div>
      </div>

      <div className="container py-6 sm:py-8">
        {success === "1" && (
          <div className="mb-6 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            Betaling ontvangen. Je credits worden binnen enkele seconden
            bijgewerkt — ververs de pagina als je saldo nog niet is aangepast.
          </div>
        )}
        {cancelled === "1" && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-muted-foreground">
            Betaling geannuleerd.
          </div>
        )}

        <div className="glass-panel mb-8 p-6 text-center sm:p-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Jouw saldo
          </p>
          <p className="font-display mt-2 text-5xl text-champagne-light">
            {saldo}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">credits beschikbaar</p>
        </div>

        <CreditsKopen pakketten={pakketten} />
      </div>
    </div>
  );
}
