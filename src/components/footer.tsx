import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-soft/50">
      <div className="container py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <p className="font-display text-xl font-medium text-foreground">
              Veloura
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Premium platform voor discrete, professionele advertenties.
              Alleen 18+.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Platform
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/zoeken"
                  className="text-muted-foreground hover:text-primary-dark"
                >
                  Advertenties
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/advertenties/nieuw"
                  className="text-muted-foreground hover:text-primary-dark"
                >
                  Plaats advertentie
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary-dark"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Juridisch
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Privacybeleid</li>
              <li>Gebruiksvoorwaarden</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="divider-soft mt-8" />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Veloura. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}
