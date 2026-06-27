import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AiChatInterface } from "@/components/ai/ai-chat-interface";
import { getCompanionById } from "@/lib/ai-companions";
import { haalGesprekBerichten, haalAiPersonage } from "@/lib/ai/queries";
import { haalCreditSaldo } from "@/lib/credits";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";

interface AiChatPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AiChatPageProps): Promise<Metadata> {
  const { id } = await params;
  const companion = getCompanionById(id);
  if (!companion) return { title: "AI Companion" };
  return {
    title: `Chat met ${companion.naam}`,
    description: `Chat met ${companion.naam} (${companion.leeftijd}) — fictieve companion op Veloura.`,
  };
}

export default async function AiChatPage({ params }: AiChatPageProps) {
  const { id } = await params;
  const companion = getCompanionById(id);
  if (!companion) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let creditsSaldo = 0;
  let initialBerichten: { rol: "user" | "assistant"; inhoud: string }[] | undefined;

  if (user) {
    await zorgProfielBestaat(user.id, user.email ?? "");
    creditsSaldo = await haalCreditSaldo(user.id);

    const personage = await haalAiPersonage(id);
    if (personage) {
      const { data: gesprek } = await supabase
        .from("ai_gesprekken")
        .select("id")
        .eq("gebruiker_id", user.id)
        .eq("personage_id", personage.id)
        .maybeSingle();

      if (gesprek?.id) {
        const opgeslagen = await haalGesprekBerichten(gesprek.id);
        if (opgeslagen.length > 0) {
          initialBerichten = opgeslagen
            .filter((b) => b.rol === "user" || b.rol === "assistant")
            .map((b) => ({
              rol: b.rol as "user" | "assistant",
              inhoud: b.inhoud,
            }));
        }
      }
    }
  }

  return (
    <div className="ai-chat-page">
      <AiChatInterface
        companion={companion}
        ingelogd={!!user}
        creditsSaldo={creditsSaldo}
        initialBerichten={initialBerichten}
      />
    </div>
  );
}
