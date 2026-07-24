import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Veloura — Premium adult marketplace",
    template: "%s | Veloura",
  },
  description:
    "Ontdek en plaats discrete profielen op een stijlvol, professioneel adult marketplace platform.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "nl_BE",
    siteName: "Veloura",
    title: "Veloura — Premium adult marketplace",
    description:
      "Ontdek en plaats discrete profielen op een stijlvol, professioneel adult marketplace platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
