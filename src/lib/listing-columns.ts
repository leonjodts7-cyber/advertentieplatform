/** Minimal columns for listing cards — avoids SELECT * overfetch */
export const LISTING_CARD_COLUMNS =
  "id, titel, stad, leeftijd, prijs_vanaf, beschrijving, status, premium, geverifieerd, beschikbaar, aangemaakt_op, bijgewerkt_op, aanbieder_id, plaatsing_type, plaatsing_eindigt_op" as const;

export type ListingCardRow = {
  id: string;
  titel: string;
  stad: string;
  leeftijd: number | null;
  prijs_vanaf: number;
  beschrijving: string;
  status: string;
  premium: boolean;
  geverifieerd: boolean;
  beschikbaar: boolean;
  aangemaakt_op: string;
  bijgewerkt_op: string;
  aanbieder_id: string;
  plaatsing_type: string | null;
  plaatsing_eindigt_op: string | null;
};
