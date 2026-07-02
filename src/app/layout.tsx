import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { haalFavorietIds } from "@/lib/favorieten-queries";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Veloura — Premium adult marketplace",
    template: "%s | Veloura",
  },
  description:
    "Ontdek en plaats discrete profielen op een stijlvol, professioneel adult marketplace platform.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000"
  ),
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let favoriteIds: string[] = [];
  if (user) {
    favoriteIds = await haalFavorietIds(supabase, user.id);
  }

  return (
    <html lang="nl" className={`${display.variable} ${sans.variable}`}>
      <body className="marketplace-bg relative flex min-h-screen flex-col antialiased">
        <FavoritesProvider initialIds={favoriteIds} isLoggedIn={!!user}>
          <Header user={user} />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer user={user} />
        </FavoritesProvider>
      </body>
    </html>
  );
}
