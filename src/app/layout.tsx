import { cookies } from "next/headers";
import { HeaderShell } from "@/components/header-shell";
import { Footer } from "@/components/footer";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { LocaleProvider } from "@/contexts/locale-context";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale } from "@/lib/i18n/config";
import "./globals.css";
import { display, sans } from "@/lib/fonts";

export { metadata } from "@/lib/site-metadata";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  const initialLocale = isValidLocale(localeCookie) ? localeCookie : DEFAULT_LOCALE;

  return (
    <html
      lang={initialLocale}
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body className="marketplace-bg relative flex min-h-screen flex-col antialiased">
        <LocaleProvider initialLocale={initialLocale}>
          <FavoritesProvider>
            <HeaderShell />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </FavoritesProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
