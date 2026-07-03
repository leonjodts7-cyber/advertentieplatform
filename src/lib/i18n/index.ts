import type { Locale } from "./config";
import nl from "./dictionaries/nl";
import fr from "./dictionaries/fr";
import en from "./dictionaries/en";
import type { Dictionary } from "./dictionaries/nl";

const dictionaries: Record<Locale, Dictionary> = { nl, fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? nl;
}

function resolvePath(obj: unknown, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (!current || typeof current !== "object" || !(key in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(locale: Locale) {
  const dict = getDictionary(locale);
  const fallback = getDictionary("nl");

  return function t(
    path: string,
    vars?: Record<string, string | number>
  ): string {
    let text = resolvePath(dict, path) ?? resolvePath(fallback, path) ?? path;
    if (vars) {
      for (const [key, value] of Object.entries(vars)) {
        text = text.replace(`{${key}}`, String(value));
      }
    }
    return text;
  };
}

export type { Dictionary };
