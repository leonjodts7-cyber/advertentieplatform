import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { AiChatInterface } from "@/components/ai/ai-chat-interface";
import {
  haalAiPersonage,
  haalGesprekBerichten,
  haalOfMaakGesprek,
} from "@/lib/ai/queries";
import { haalCreditSaldo, CREDITS_PER_BERICHT } from "@/lib/credits";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";

interface AiChatPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AiChatPageProps): Promise<Metadata> {
  const { id } = await params;
  const personage = await haalAiPersonage(id);
  if (!personage) return { title: "AI Companion" };
  return {
    title: `Chat met ${personage.naam}`,
    description: `Chat met ${personage.naam} (${personage.leeftijd}+) — fictieve AI Companion op Veloura.`,
  };
}

export default async function AiChatPage({ params }: AiChatPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/ai/${id}`);
  }

  await zorgProfielBestaat(user.id, user.email ?? "");

  const personage = await haalAiPersonage(id);
  if (!personage) notFound();

  const gesprek = await haalOfMaakGesprek(user.id, personage.id);
  const berichten = gesprek ? await haalGesprekBerichten(gesprek.id) : [];
  const saldo = await haalCreditSaldo(user.id);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col sm:min-h-[calc(100vh-3.75rem)]">
      <div className="glass-nav border-b border-white/10">
        <div className="container flex h-14 items-center gap-3">
          <Link
            href="/ai-lounge"
            className="shrink-0 text-sm text-muted-foreground hover:text-champagne-light"
          >
            ← Lounge
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base text-foreground">
              {personage.naam}
              <span className="ml-2 text-sm text-muted-foreground">
                {personage.leeftijd} · fictief AI
              </span>
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {personage.persoonlijkheid}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">Credits</p>
            <p className="font-display text-lg text-champagne-light">{saldo}</p>
          </div>
        </div>
      </div>

      <AiChatInterface
        personageSlug={personage.slug}
        personageNaam={personage.naam}
        initialBerichten={berichten}
        initialSaldo={saldo}
        creditsPerBericht={CREDITS_PER_BERICHT}
      />
    </div>
  );
}
