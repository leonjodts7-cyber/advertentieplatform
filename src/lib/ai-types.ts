export interface AiPersonage {
  id: string;
  slug: string;
  naam: string;
  leeftijd: number;
  persoonlijkheid: string;
  beschrijving: string;
  system_prompt: string;
  gradient: string;
  online: boolean;
  volgorde: number;
  aangemaakt_op: string;
}

export interface AiGesprek {
  id: string;
  gebruiker_id: string;
  personage_id: string;
  aangemaakt_op: string;
  bijgewerkt_op: string;
}

export interface AiBericht {
  id: string;
  gesprek_id: string;
  rol: "user" | "assistant";
  inhoud: string;
  credits_gebruikt: number;
  aangemaakt_op: string;
}

export interface CreditPakket {
  id: string;
  slug: string;
  naam: string;
  credits: number;
  prijs_cent: number;
  stripe_price_id: string | null;
  actief: boolean;
  volgorde: number;
  aangemaakt_op: string;
}

export interface GebruikerCredits {
  gebruiker_id: string;
  saldo: number;
  bijgewerkt_op: string;
}

export type CreditTransactieType = "aankoop" | "gebruik" | "bonus";

export interface CreditTransactie {
  id: string;
  gebruiker_id: string;
  type: CreditTransactieType;
  bedrag: number;
  beschrijving: string;
  stripe_session_id: string | null;
  metadata: Record<string, unknown> | null;
  aangemaakt_op: string;
}

export const CREDITS_PER_BERICHT = 2;
