import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { genereerAiAntwoord } from "@/lib/ai/claude";
import {
  haalAiPersonage,
  haalGesprekBerichten,
  haalOfMaakGesprek,
} from "@/lib/ai/queries";
import { CREDITS_PER_BERICHT, trekCreditsAf } from "@/lib/credits";
import { zorgProfielBestaat } from "@/lib/profiel";
import type { AiBericht } from "@/lib/ai-types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  let body: { personageSlug?: string; bericht?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }

  const personageSlug = body.personageSlug?.trim();
  const bericht = body.bericht?.trim();

  if (!personageSlug || !bericht) {
    return NextResponse.json(
      { error: "Personage en bericht zijn verplicht." },
      { status: 400 }
    );
  }

  if (bericht.length > 2000) {
    return NextResponse.json(
      { error: "Bericht is te lang (max 2000 tekens)." },
      { status: 400 }
    );
  }

  await zorgProfielBestaat(user.id, user.email ?? "");

  const personage = await haalAiPersonage(personageSlug);
  if (!personage) {
    return NextResponse.json(
      { error: "AI Companion niet gevonden." },
      { status: 404 }
    );
  }

  const gesprek = await haalOfMaakGesprek(user.id, personage.id);
  if (!gesprek) {
    return NextResponse.json(
      { error: "Gesprek kon niet worden gestart." },
      { status: 500 }
    );
  }

  const eerdereBerichten = await haalGesprekBerichten(gesprek.id);
  const claudeGeschiedenis = eerdereBerichten.map((b) => ({
    role: b.rol as "user" | "assistant",
    content: b.inhoud,
  }));

  const creditResult = await trekCreditsAf(
    user.id,
    CREDITS_PER_BERICHT,
    `AI bericht — ${personage.naam}`
  );

  if (!creditResult.success) {
    return NextResponse.json(
      {
        error: "Onvoldoende credits.",
        saldo: creditResult.saldo,
        creditsNodig: CREDITS_PER_BERICHT,
      },
      { status: 402 }
    );
  }

  const { error: userMsgError } = await supabase.from("ai_berichten").insert({
    gesprek_id: gesprek.id,
    rol: "user",
    inhoud: bericht,
    credits_gebruikt: CREDITS_PER_BERICHT,
  });

  if (userMsgError) {
    return NextResponse.json(
      { error: "Bericht opslaan mislukt." },
      { status: 500 }
    );
  }

  let aiAntwoord: string;
  try {
    aiAntwoord = await genereerAiAntwoord(
      personage.system_prompt,
      claudeGeschiedenis,
      bericht
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "AI antwoord mislukt.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const { data: assistantMsg, error: aiMsgError } = await supabase
    .from("ai_berichten")
    .insert({
      gesprek_id: gesprek.id,
      rol: "assistant",
      inhoud: aiAntwoord,
      credits_gebruikt: 0,
    })
    .select("*")
    .single();

  if (aiMsgError) {
    return NextResponse.json(
      { error: "AI antwoord opslaan mislukt." },
      { status: 500 }
    );
  }

  await supabase
    .from("ai_gesprekken")
    .update({ bijgewerkt_op: new Date().toISOString() })
    .eq("id", gesprek.id);

  return NextResponse.json({
    saldo: creditResult.saldo,
    userBericht: {
      rol: "user" as const,
      inhoud: bericht,
      credits_gebruikt: CREDITS_PER_BERICHT,
    },
    assistantBericht: assistantMsg as AiBericht,
  });
}
