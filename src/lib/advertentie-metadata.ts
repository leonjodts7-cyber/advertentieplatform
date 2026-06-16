export const ADVERTENTIE_META_MARKER = "\n<!--VELAURA_META:";
export const ADVERTENTIE_META_END = "-->";

export type AdvertentiePakket = "basis" | "premium";

export type WerktijdDag = {
  dag: string;
  actief: boolean;
  van: string;
  tot: string;
};

export interface AdvertentieMetadata {
  pakket?: AdvertentiePakket;
  categorie?: string;
  whatsapp?: string;
  adresTypes?: string[];
  geslacht?: string;
  haarkleur?: string;
  oogkleur?: string;
  lengteCm?: number;
  cupmaat?: string;
  nationaliteit?: string;
  talen?: string[];
  roker?: boolean;
  tattoos?: boolean;
  piercings?: boolean;
  mogelijkheden?: string[];
  videoUrl?: string;
  werktijden?: WerktijdDag[];
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
  { value: "geverifieerd-aanvraag", label: "Geverifieerd profiel aanvragen" },
] as const;

export function serialiseerBeschrijving(
  tekst: string,
  meta: AdvertentieMetadata
): string {
  const clean = tekst.trim();
  const payload = JSON.stringify(meta);
  return `${clean}${ADVERTENTIE_META_MARKER}${payload}${ADVERTENTIE_META_END}`;
}

export function parseAdvertentieBeschrijving(beschrijving: string): {
  tekst: string;
  meta: AdvertentieMetadata;
} {
  const start = beschrijving.indexOf(ADVERTENTIE_META_MARKER);
  if (start === -1) {
    return { tekst: beschrijving.trim(), meta: {} };
  }

  const end = beschrijving.indexOf(ADVERTENTIE_META_END, start);
  if (end === -1) {
    return { tekst: beschrijving.slice(0, start).trim(), meta: {} };
  }

  try {
    const meta = JSON.parse(
      beschrijving.slice(start + ADVERTENTIE_META_MARKER.length, end)
    ) as AdvertentieMetadata;
    return { tekst: beschrijving.slice(0, start).trim(), meta };
  } catch {
    return { tekst: beschrijving.slice(0, start).trim(), meta: {} };
  }
}

export function categorieLabel(slug?: string): string | undefined {
  if (!slug) return undefined;
  const labels: Record<string, string> = {
    "prive-ontvangst": "Privé ontvangst",
    escort: "Escort",
    massage: "Massage",
    video: "Video",
    koppels: "Koppels",
    trans: "Trans",
    mannen: "Mannen",
    vrouwen: "Vrouwen",
    privehuizen: "Privéhuizen",
    "rendez-vous-hotels": "Rendez-vous hotels",
    "prive-saunas": "Privé sauna's",
    parenclubs: "Parenclubs",
  };
  return labels[slug] ?? slug;
}

export function metaBevatTerm(meta: AdvertentieMetadata, term: string): boolean {
  const lower = term.toLowerCase();
  const haystack = JSON.stringify(meta).toLowerCase();
  return haystack.includes(lower);
}
