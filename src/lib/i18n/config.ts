export const LOCALES = ["nl", "fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "nl";
export const LOCALE_COOKIE = "veloura_locale";
export const LOCALE_STORAGE = "veloura_locale";

export function isValidLocale(value: string | null | undefined): value is Locale {
  return value === "nl" || value === "fr" || value === "en";
}

export const LOCALE_LABELS: Record<Locale, string> = {
  nl: "NL",
  fr: "FR",
  en: "EN",
};
