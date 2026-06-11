import { createClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";
import { CREDITS_PER_BERICHT } from "@/lib/ai-types";
import type { CreditPakket, GebruikerCredits } from "@/lib/ai-types";
import { CREDIT_PAKKETTEN_FALLBACK } from "@/lib/ai/personages-fallback";

export async function zorgCreditsAccount(gebruikerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gebruiker_credits")
    .select("gebruiker_id")
    .eq("gebruiker_id", gebruikerId)
    .maybeSingle();

  if (!data) {
    await supabase.from("gebruiker_credits").insert({
      gebruiker_id: gebruikerId,
      saldo: 0,
    });
  }
}

export async function haalCreditSaldo(gebruikerId: string): Promise<number> {
  const supabase = await createClient();
  await zorgCreditsAccount(gebruikerId);

  const { data } = await supabase
    .from("gebruiker_credits")
    .select("saldo")
    .eq("gebruiker_id", gebruikerId)
    .maybeSingle();

  return (data as Pick<GebruikerCredits, "saldo"> | null)?.saldo ?? 0;
}

export async function haalCreditPakketten(): Promise<CreditPakket[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("credit_pakketten")
    .select("*")
    .eq("actief", true)
    .order("volgorde", { ascending: true });

  if (error || !data?.length) {
    return CREDIT_PAKKETTEN_FALLBACK.map((p) => ({
      ...p,
      stripe_price_id: null,
      actief: true,
      aangemaakt_op: new Date().toISOString(),
    }));
  }

  return data as CreditPakket[];
}

export async function trekCreditsAf(
  gebruikerId: string,
  bedrag: number,
  beschrijving: string
): Promise<{ success: boolean; saldo: number }> {
  const admin = createServiceRoleSupabaseClient();

  const { data: huidig } = await admin
    .from("gebruiker_credits")
    .select("saldo")
    .eq("gebruiker_id", gebruikerId)
    .maybeSingle();

  const saldo = (huidig as Pick<GebruikerCredits, "saldo"> | null)?.saldo ?? 0;
  if (saldo < bedrag) {
    return { success: false, saldo };
  }

  const nieuwSaldo = saldo - bedrag;
  await admin
    .from("gebruiker_credits")
    .upsert({
      gebruiker_id: gebruikerId,
      saldo: nieuwSaldo,
      bijgewerkt_op: new Date().toISOString(),
    });

  await admin.from("credit_transacties").insert({
    gebruiker_id: gebruikerId,
    type: "gebruik",
    bedrag: -bedrag,
    beschrijving,
  });

  return { success: true, saldo: nieuwSaldo };
}

export async function voegCreditsToe(
  gebruikerId: string,
  bedrag: number,
  beschrijving: string,
  stripeSessionId?: string,
  metadata?: Record<string, unknown>
) {
  const admin = createServiceRoleSupabaseClient();

  const { data: huidig } = await admin
    .from("gebruiker_credits")
    .select("saldo")
    .eq("gebruiker_id", gebruikerId)
    .maybeSingle();

  const saldo = (huidig as Pick<GebruikerCredits, "saldo"> | null)?.saldo ?? 0;

  await admin.from("gebruiker_credits").upsert({
    gebruiker_id: gebruikerId,
    saldo: saldo + bedrag,
    bijgewerkt_op: new Date().toISOString(),
  });

  await admin.from("credit_transacties").insert({
    gebruiker_id: gebruikerId,
    type: "aankoop",
    bedrag,
    beschrijving,
    stripe_session_id: stripeSessionId ?? null,
    metadata: metadata ?? {},
  });
}

export { CREDITS_PER_BERICHT };
