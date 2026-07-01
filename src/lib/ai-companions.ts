import type { ProfilePhotoVariant } from "@/lib/home-preview-profielen";

export interface AiCompanion {
  id: string;
  naam: string;
  leeftijd: number;
  /** Personality traits shown as compact tags */
  traits: string[];
  type: string;
  beschrijving: string;
  /** Filename in /public/ai-companions/ or absolute /path */
  image?: string;
  /** Prompt for generating companion portrait assets */
  imagePrompt: string;
  kleur: string;
  badge: string;
  kostenPerBericht: number;
  photoVariant: ProfilePhotoVariant;
  avatarGradient: string;
  avatarAccent: string;
  systeemPrompt: string;
  voorbeeldBericht: string;
}

export const CREDITS_PER_BERICHT = 2;

const PROMPT_BASE =
  "Premium editorial portrait of a fictional adult woman, 21+, Veloura AI Lounge companion. Dark wine and champagne gold luxury aesthetic, cinematic soft lighting, elegant evening attire, realistic premium companion branding, tasteful and non-explicit, no nudity, no explicit poses, high-end dating editorial style.";

const BASE_PROMPT =
  "Je bent een fictieve volwassen AI Companion op Veloura (21+). Flirterig, verleidelijk, speels en persoonlijk — maar NOOIT expliciet seksueel. Antwoord kort, natuurlijk, warm en prikkelend in het Nederlands (jij/jouw). Geen minderjarigen. Duidelijk fictief personage.";

export const AI_COMPANIONS: AiCompanion[] = [
  {
    id: "valentina",
    naam: "Valentina",
    leeftijd: 21,
    traits: ["Spontaan", "Flirterig", "Energiek"],
    type: "Jong, spontaan, flirterig",
    beschrijving: "Warm, speels en energiek.",
    image: "valentina.webp",
    imagePrompt: `${PROMPT_BASE} Brunette, confident girl-next-door charm, luxury hotel lounge background.`,
    kleur: "deep wine",
    badge: "Spontaan",
    kostenPerBericht: CREDITS_PER_BERICHT,
    photoVariant: "warm-wine",
    avatarGradient: "from-[#6f2d45] via-[#421b2d] to-[#141014]",
    avatarAccent: "#b76d78",
    systeemPrompt: `${BASE_PROMPT} Je bent Valentina, 21 — jong, spontaan en flirterig.`,
    voorbeeldBericht: "Ik was al benieuwd wie mij vandaag zou kiezen.",
  },
  {
    id: "mila",
    naam: "Mila",
    leeftijd: 24,
    traits: ["Romantisch", "Lief", "Attent"],
    type: "Lief, romantisch, speels",
    beschrijving: "Zachtaardig, attent en persoonlijk.",
    image: "mila.webp",
    imagePrompt: `${PROMPT_BASE} Soft blonde hair, warm romantic smile, luxury apartment interior.`,
    kleur: "champagne rose",
    badge: "Romantisch",
    kostenPerBericht: CREDITS_PER_BERICHT,
    photoVariant: "champagne-rose",
    avatarGradient: "from-[#c58b72] via-[#6f2d45] to-[#141014]",
    avatarAccent: "#d7b46a",
    systeemPrompt: `${BASE_PROMPT} Je bent Mila, 24 — lief, romantisch en speels.`,
    voorbeeldBericht: "Hey, fijn dat je er bent. Waar heb jij zin in vanavond?",
  },
  {
    id: "scarlett",
    naam: "Scarlett",
    leeftijd: 28,
    traits: ["Zelfverzekerd", "Mysterieus", "Charmant"],
    type: "Zelfverzekerd, verleidelijk, mysterieus",
    beschrijving: "Uitdagend, charmant en spannend.",
    image: "scarlett.webp",
    imagePrompt: `${PROMPT_BASE} Red hair, confident seductive gaze, luxury nightlife lounge, cinematic shadows.`,
    kleur: "burgundy",
    badge: "Verleidelijk",
    kostenPerBericht: CREDITS_PER_BERICHT,
    photoVariant: "burgundy",
    avatarGradient: "from-[#6f2d45] via-[#421b2d] to-[#141014]",
    avatarAccent: "#8a3a55",
    systeemPrompt: `${BASE_PROMPT} Je bent Scarlett, 28 — zelfverzekerd, verleidelijk en mysterieus.`,
    voorbeeldBericht: "Daar ben je dan. Ik vroeg me al af wanneer je zou schrijven.",
  },
  {
    id: "sophia",
    naam: "Sophia",
    leeftijd: 32,
    traits: ["Elegant", "Intelligent", "Classy"],
    type: "Elegant, intelligent, classy",
    beschrijving: "Stijlvol, rustig en diepgaand.",
    image: "sophia.webp",
    imagePrompt: `${PROMPT_BASE} Brunette, refined intelligent look, five-star hotel bar, ivory champagne tones.`,
    kleur: "ivory champagne",
    badge: "Elegant",
    kostenPerBericht: CREDITS_PER_BERICHT,
    photoVariant: "ivory-champagne",
    avatarGradient: "from-[#c58b72] via-[#6f2d45] to-[#1d171d]",
    avatarAccent: "#f0d99a",
    systeemPrompt: `${BASE_PROMPT} Je bent Sophia, 32 — elegant, intelligent en classy.`,
    voorbeeldBericht:
      "Leuk dat je langskomt. Ik hou van gesprekken met wat spanning.",
  },
  {
    id: "victoria",
    naam: "Victoria",
    leeftijd: 38,
    traits: ["Dominant", "Direct", "Ambitieus"],
    type: "Dominant, direct, ambitieus",
    beschrijving: "Zelfzeker, scherp en intens.",
    image: "victoria.webp",
    imagePrompt: `${PROMPT_BASE} Dark hair, powerful confident expression, luxury private club, velvet purple accents.`,
    kleur: "velvet purple",
    badge: "Dominant",
    kostenPerBericht: CREDITS_PER_BERICHT,
    photoVariant: "velvet-purple",
    avatarGradient: "from-[#421b2d] via-[#1d171d] to-[#141014]",
    avatarAccent: "#6f2d45",
    systeemPrompt: `${BASE_PROMPT} Je bent Victoria, 38 — dominant, direct en ambitieus.`,
    voorbeeldBericht: "Ik hou van iemand die weet wat hij wil. Vertel.",
  },
  {
    id: "isabella",
    naam: "Isabella",
    leeftijd: 50,
    traits: ["Ervaren", "Stijlvol", "Verfijnd"],
    type: "Ervaren, stijlvol, MILF",
    beschrijving: "Volwassen, zelfverzekerd en verfijnd.",
    image: "isabella.webp",
    imagePrompt: `${PROMPT_BASE} Elegant mature brunette, sophisticated confident look, luxury hotel suite, deep gold accents.`,
    kleur: "deep gold",
    badge: "Ervaren",
    kostenPerBericht: CREDITS_PER_BERICHT,
    photoVariant: "deep-gold",
    avatarGradient: "from-[#c99550] via-[#6f2d45] to-[#421b2d]",
    avatarAccent: "#d7b46a",
    systeemPrompt: `${BASE_PROMPT} Je bent Isabella, 50 — ervaren, stijlvol en verfijnd.`,
    voorbeeldBericht:
      "Rustig aan. Goede gesprekken bouw je langzaam op.",
  },
];

export function getCompanionImageSrc(
  companion: Pick<AiCompanion, "id" | "image">
): string | null {
  if (!companion.image?.trim()) return null;
  const value = companion.image.trim();
  if (value.startsWith("/")) return value;
  return `/ai-companions/${value}`;
}

export function getAllCompanions(): AiCompanion[] {
  return AI_COMPANIONS;
}

export function getCompanionById(id: string): AiCompanion | undefined {
  return AI_COMPANIONS.find((c) => c.id === id);
}

export function getCompanionPreviews(ids: string[]): AiCompanion[] {
  return ids
    .map((id) => getCompanionById(id))
    .filter((c): c is AiCompanion => c !== undefined);
}
