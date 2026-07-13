import { AiLoungeContent } from "@/components/ai/ai-lounge-content";
import { getAllCompanions } from "@/lib/ai-companions";
import { haalCreditSaldo } from "@/lib/credits";
import { haalRecenteAiGesprekken } from "@/lib/ai/queries";
import { buildPageMetadata } from "@/lib/metadata-i18n";
import { createClient } from "@/lib/supabase/server";
import { zorgProfielBestaat } from "@/lib/profiel";

export async function generateMetadata() {
  return buildPageMetadata("pages.aiLounge.title", "pages.aiLounge.description", {
    path: "/ai-lounge",
  });
}

export default async function AiLoungePage() {
  const companions = getAllCompanions();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let creditsSaldo = 0;
  let recentChats: Awaited<ReturnType<typeof haalRecenteAiGesprekken>> = [];

  if (user) {
    await zorgProfielBestaat(user.id, user.email ?? "");
    [creditsSaldo, recentChats] = await Promise.all([
      haalCreditSaldo(user.id),
      haalRecenteAiGesprekken(user.id),
    ]);
  }

  return (
    <AiLoungeContent
      companions={companions}
      ingelogd={!!user}
      creditsSaldo={creditsSaldo}
      recentChats={recentChats}
    />
  );
}
