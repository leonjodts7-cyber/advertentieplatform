import { genereerZoekParseAntwoord } from "@/lib/ai/claude";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import type { ParsedZoekFilters } from "@/lib/zoek-filters";

const CATEGORIE_SLUGS = MARKETPLACE_CATEGORIEEN.map((c) => c.slug);

const SYSTEM_PROMPT = `Je bent de zoekassistent van Veloura, een discreet advertentieplatform (18+).
Zet de gebruikersvraag om naar zoekfilters. Antwoord ALLEEN met geldig JSON-object, geen markdown.

Velden (optioneel):
- stad, categorie (${CATEGORIE_SLUGS.join("|")})
- leeftijd_van, leeftijd_tot, prijs_min, prijs_max, lengte_van, lengte_tot, gewicht_van, gewicht_tot
- haarkleur (blond|bruin|zwart|rood|grijs), oogkleur (blauw|bruin|groen|grijs)
- nationaliteit (belgisch|nederlands|frans|duits|spaans|italiaans), taal (nl|fr|en|de|es)
- geverifieerd, beschikbaar, thuis_ontvangen, hotel_mogelijk, video_mogelijk, koppels_welkom, roken_toegestaan: "true"
- q: overige trefwoorden`;

const STEDEN = ["antwerpen", "gent", "brussel", "leuven", "hasselt", "brugge", "mechelen", "kortrijk"];

const FILTER_KEYS: (keyof ParsedZoekFilters)[] = [
  "q", "stad", "afstand", "categorie", "type_afspraak",
  "leeftijd_van", "leeftijd_tot", "prijs_min", "prijs_max",
  "lengte_van", "lengte_tot", "haarkleur", "oogkleur", "taal",
  "geverifieerd", "beschikbaar", "thuis_ontvangen", "hotel_mogelijk",
  "video_mogelijk", "discreet_contact", "nieuw_profiel", "premium_profiel",
  "verplaatsing_mogelijk",
];

function parseJsonFilters(raw: string): ParsedZoekFilters | null {
  try {
    const cleaned = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    const result: ParsedZoekFilters = {};
    for (const key of FILTER_KEYS) {
      const val = parsed[key];
      if (val != null && String(val).trim() !== "") result[key] = String(val).trim();
    }
    if (result.categorie && !(CATEGORIE_SLUGS as readonly string[]).includes(result.categorie)) {
      delete result.categorie;
    }
    return result;
  } catch {
    return null;
  }
}

function fallbackParseZoekQuery(query: string): ParsedZoekFilters {
  const lower = query.toLowerCase();
  const filters: ParsedZoekFilters = {};

  for (const stad of STEDEN) {
    if (lower.includes(stad)) {
      filters.stad = stad.charAt(0).toUpperCase() + stad.slice(1);
      break;
    }
  }

  if (/\b(massage)\b/.test(lower)) filters.categorie = "massage";
  else if (/\b(escort)\b/.test(lower)) filters.categorie = "escort";
  else if (/\b(video|virtueel)\b/.test(lower)) { filters.categorie = "video"; filters.video_mogelijk = "true"; }
  else if (/\b(privé|prive|ontvang)\b/.test(lower)) filters.categorie = "prive-ontvangst";

  if (/\b(blond|blonde)\b/.test(lower)) filters.haarkleur = "blond";
  if (/\b(nederlands)\b/.test(lower)) filters.taal = "nl";
  if (/\b(geverifieerd)\b/.test(lower)) filters.geverifieerd = "true";
  if (/\b(vanavond|beschikbaar|online)\b/.test(lower)) filters.beschikbaar = "true";
  if (/\b(hotel)\b/.test(lower)) filters.hotel_mogelijk = "true";

  const prijsMatch = lower.match(/(?:onder|max|tot)\s*€?\s*(\d+)/);
  if (prijsMatch) filters.prijs_max = prijsMatch[1];

  if (!filters.stad && !filters.categorie && !filters.prijs_max) filters.q = query.trim();
  return filters;
}

export async function parseZoekQuery(query: string): Promise<ParsedZoekFilters> {
  const trimmed = query.trim();
  if (!trimmed) return {};
  if (!process.env.ANTHROPIC_API_KEY) return fallbackParseZoekQuery(trimmed);
  try {
    const raw = await genereerZoekParseAntwoord(SYSTEM_PROMPT, `Gebruikersvraag: "${trimmed}"`);
    const parsed = parseJsonFilters(raw);
    if (parsed && Object.keys(parsed).length > 0) return parsed;
  } catch { /* fallback */ }
  return fallbackParseZoekQuery(trimmed);
}
