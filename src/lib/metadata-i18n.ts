import type { Metadata } from "next";
import { getServerTranslation } from "@/lib/i18n/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

const OG_LOCALE: Record<string, string> = {
  nl: "nl_BE",
  fr: "fr_BE",
  en: "en_US",
};

export async function buildPageMetadata(
  titleKey: string,
  descriptionKey: string,
  options?: {
    titleVars?: Record<string, string | number>;
    descriptionVars?: Record<string, string | number>;
    path?: string;
    noIndex?: boolean;
  }
): Promise<Metadata> {
  const { t, locale } = await getServerTranslation();
  const title = t(titleKey, options?.titleVars);
  const description = t(descriptionKey, options?.descriptionVars);
  const canonical = options?.path ? `${SITE_URL}${options.path}` : SITE_URL;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Veloura",
      locale: OG_LOCALE[locale] ?? "nl_BE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: options?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
