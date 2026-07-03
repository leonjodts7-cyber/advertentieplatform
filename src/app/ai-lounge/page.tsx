import type { Metadata } from "next";
import { AiLoungeContent } from "@/components/ai/ai-lounge-content";
import { getAllCompanions } from "@/lib/ai-companions";
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
    <AiLoungeContent
      companions={companions}
      ingelogd={!!user}
      creditsSaldo={creditsSaldo}
    />
  );
}
