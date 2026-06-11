import { createClient } from "@/lib/supabase/server";
import type { AiBericht, AiGesprek, AiPersonage } from "@/lib/ai-types";
import { AI_PERSONAGES_FALLBACK } from "@/lib/ai/personages-fallback";

export async function haalAiPersonages(): Promise<AiPersonage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_personages")
    .select("*")
    .order("volgorde", { ascending: true });

  if (error || !data?.length) {
    return AI_PERSONAGES_FALLBACK;
  }

  return data as AiPersonage[];
}

export async function haalAiPersonage(
  slugOrId: string
): Promise<AiPersonage | null> {
  const supabase = await createClient();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slugOrId
    );

  let query = supabase.from("ai_personages").select("*");
  query = isUuid
    ? query.eq("id", slugOrId)
    : query.eq("slug", slugOrId);

  const { data, error } = await query.maybeSingle();
  if (error || !data) {
    return (
      AI_PERSONAGES_FALLBACK.find(
        (p) => p.slug === slugOrId || p.id === slugOrId
      ) ?? null
    );
  }

  return data as AiPersonage;
}

export async function haalOfMaakGesprek(
  gebruikerId: string,
  personageId: string
): Promise<AiGesprek | null> {
  const supabase = await createClient();

  const { data: bestaand } = await supabase
    .from("ai_gesprekken")
    .select("*")
    .eq("gebruiker_id", gebruikerId)
    .eq("personage_id", personageId)
    .maybeSingle();

  if (bestaand) return bestaand as AiGesprek;

  const { data: nieuw, error } = await supabase
    .from("ai_gesprekken")
    .insert({ gebruiker_id: gebruikerId, personage_id: personageId })
    .select("*")
    .single();

  if (error) return null;
  return nieuw as AiGesprek;
}

export async function haalGesprekBerichten(
  gesprekId: string
): Promise<AiBericht[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_berichten")
    .select("*")
    .eq("gesprek_id", gesprekId)
    .order("aangemaakt_op", { ascending: true });

  return (data ?? []) as AiBericht[];
}

export async function haalAiLoungeStats(gebruikerId: string) {
  const supabase = await createClient();

  const [{ count: gesprekken }, { data: transacties }] = await Promise.all([
    supabase
      .from("ai_gesprekken")
      .select("*", { count: "exact", head: true })
      .eq("gebruiker_id", gebruikerId),
    supabase
      .from("credit_transacties")
      .select("bedrag, type")
      .eq("gebruiker_id", gebruikerId)
      .eq("type", "gebruik"),
  ]);

  const gebruikteCredits = (transacties ?? []).reduce(
    (sum, t) => sum + Math.abs((t as { bedrag: number }).bedrag),
    0
  );

  const saldoRow = await supabase
    .from("gebruiker_credits")
    .select("saldo")
    .eq("gebruiker_id", gebruikerId)
    .maybeSingle();

  return {
    gesprekken: gesprekken ?? 0,
    gebruikteCredits,
    resterendeCredits:
      (saldoRow.data as { saldo: number } | null)?.saldo ?? 0,
  };
}
