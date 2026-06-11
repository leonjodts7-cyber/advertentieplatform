import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
    default: "Privé Ontvangst — Premium advertentieplatform",
    template: "%s | Privé Ontvangst",
  },
  description:
    "Premium advertentieplatform voor zelfstandige aanbieders. Vind en plaats advertenties — alleen 18+.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000"
  ),
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

  return (
    <html lang="nl" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <Header user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
