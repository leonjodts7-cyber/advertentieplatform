import { cookies } from "next/headers";
import { createTranslator } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isValidLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getServerTranslation() {
  const locale = await getServerLocale();
  return { locale, t: createTranslator(locale) };
}
