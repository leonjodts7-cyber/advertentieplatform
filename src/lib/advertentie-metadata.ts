export type BoostType = "none" | "stad" | "categorie" | "homepage";

export const ADVERTENTIE_META_MARKER = "\n<!--VELAURA_META:";
export const ADVERTENTIE_META_END = "-->";

export type AdvertentiePakket = "gratis" | "premium";

export type WerktijdDag = {
  dag: string;
  actief: boolean;
  van: string;
  tot: string;
};

export type MediaItem = {
  url: string;
  type: "foto" | "video";
  positie: number;
  isHoofd?: boolean;
};

export interface AdvertentieMetadata {
  pakket?: AdvertentiePakket;
  categorie?: string;
  regio?: string;
  whatsapp?: string;
  website?: string;
  telegram?: string;
  adresTypes?: string[];
  geslacht?: string;
  haarkleur?: string;
  oogkleur?: string;
  lengteCm?: number;
  gewichtKg?: number;
  cupmaat?: string;
  nationaliteit?: string;
  talen?: string[];
  roker?: boolean;
  tattoos?: boolean;
  piercings?: boolean;
  mogelijkheden?: string[];
  extraMogelijkheden?: string[];
  mediaItems?: MediaItem[];
  videoUrls?: string[];
  videoUrl?: string;
  hoofdFotoUrl?: string;
  beschikbaarheid?: string[];
  werktijden?: WerktijdDag[];
  boostType?: BoostType;
  boostStad?: string;
  boostCategorie?: string;
  boostStart?: string;
  boostEindigtOp?: string;
  boostDuurDagen?: number;
}

export const DAGEN = [
  "maandag",
  "dinsdag",
  "woensdag",
  "donderdag",
  "vrijdag",
  "zaterdag",
  "zondag",
] as const;

export const DEFAULT_WERKTIJDEN: WerktijdDag[] = DAGEN.map((dag) => ({
  dag,
  actief: dag !== "zondag",
  van: "10:00",
  tot: "22:00",
}));

export const BESCHIKBAARHEID_OPTIES = [
  { value: "vandaag", label: "Vandaag beschikbaar" },
  { value: "morgen", label: "Morgen beschikbaar" },
  { value: "24-7", label: "24/7 beschikbaar" },
  { value: "afspraak", label: "Alleen op afspraak" },
] as const;

export const CATEGORIE_OPTIES = [
  { slug: "prive-ontvangst", label: "Privé ontvangst" },
  { slug: "escort", label: "Escort" },
  { slug: "massage", label: "Massage" },
  { slug: "video", label: "Video" },
  { slug: "koppels", label: "Koppels" },
  { slug: "trans", label: "Trans" },
  { slug: "mannen", label: "Mannen" },
  { slug: "vrouwen", label: "Vrouwen" },
  { slug: "privehuizen", label: "Privéhuizen" },
  { slug: "rendez-vous-hotels", label: "Rendez-vous hotels" },
  { slug: "prive-saunas", label: "Privé sauna's" },
  { slug: "parenclubs", label: "Parenclubs" },
] as const;

export const ADRES_TYPE_OPTIES = [
  { value: "prive-ontvangst", label: "Privé ontvangst" },
  { value: "hotel", label: "Hotel mogelijk" },
  { value: "verplaatsing", label: "Verplaatsing mogelijk" },
  { value: "club", label: "Club" },
  { value: "video", label: "Video" },
] as const;

export const MOGELIJKHEDEN_OPTIES = [
  { value: "massage", label: "Massage" },
  { value: "body-to-body", label: "Body to body" },
  { value: "tantra", label: "Tantra massage" },
  { value: "rollenspel", label: "Rollenspel" },
  { value: "duo", label: "Duo mogelijk" },
  { value: "koppels", label: "Koppels welkom" },
  { value: "video", label: "Video mogelijk" },
  { value: "hotel", label: "Hotel mogelijk" },
  { value: "discreet", label: "Discreet contact" },
  { value: "whatsapp-only", label: "Alleen WhatsApp" },
  { value: "thuis", label: "Thuis ontvangen" },
  { value: "verplaatsing", label: "Verplaatsing mogelijk" },
] as const;

export const TAAL_OPTIES = [
  "Nederlands",
  "Frans",
  "Engels",
  "Duits",
  "Spaans",
] as const;

export const MEDIA_LIMIETEN = {
  gratis: { fotos: 20, videos: 1 },
  premium: { fotos: 100, videos: 5 },
} as const;

export function serialiseerBeschrijving(
  tekst: string,
  meta: AdvertentieMetadata
): string {
  const clean = tekst.trim();
  return `${clean}${ADVERTENTIE_META_MARKER}${JSON.stringify(meta)}${ADVERTENTIE_META_END}`;
}

export function parseAdvertentieBeschrijving(beschrijving: string): {
  tekst: string;
  meta: AdvertentieMetadata;
} {
  const start = beschrijving.indexOf(ADVERTENTIE_META_MARKER);
  if (start === -1) return { tekst: beschrijving.trim(), meta: {} };

  const end = beschrijving.indexOf(ADVERTENTIE_META_END, start);
  if (end === -1) return { tekst: beschrijving.slice(0, start).trim(), meta: {} };

  try {
    const raw = JSON.parse(
      beschrijving.slice(start + ADVERTENTIE_META_MARKER.length, end)
    ) as Record<string, unknown>;
    if (raw.pakket === "basis") raw.pakket = "gratis";
    return { tekst: beschrijving.slice(0, start).trim(), meta: raw as AdvertentieMetadata };
  } catch {
    return { tekst: beschrijving.slice(0, start).trim(), meta: {} };
  }
}

export function categorieLabel(slug?: string): string | undefined {
  if (!slug) return undefined;
  return CATEGORIE_OPTIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function metaBevatTerm(meta: AdvertentieMetadata, term: string): boolean {
  return JSON.stringify(meta).toLowerCase().includes(term.toLowerCase());
}

export function alleMogelijkheden(meta: AdvertentieMetadata): string[] {
  const standaard = (meta.mogelijkheden ?? []).map(
    (v) => MOGELIJKHEDEN_OPTIES.find((o) => o.value === v)?.label ?? v
  );
  return [...standaard, ...(meta.extraMogelijkheden ?? [])];
}
