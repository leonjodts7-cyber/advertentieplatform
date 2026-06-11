import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="container py-10 sm:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg font-medium text-foreground">
              Privé Ontvangst
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Premium advertentieplatform voor zelfstandige aanbieders. Alleen
              voor volwassenen van 18 jaar en ouder.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-sm">
            <Link
              href="/zoeken"
              className="text-muted-foreground transition-colors hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Advertenties
            </Link>
            <Link
              href="/dashboard/advertenties/nieuw"
              className="text-muted-foreground transition-colors hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Plaats advertentie
            </Link>
            <Link
              href="/dashboard"
              className="text-muted-foreground transition-colors hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="divider-gold mt-8" />

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground/70">
          Alle aanbieders moeten 18+ zijn. Illegale inhoud, misleiding en
          gedwongen activiteiten zijn verboden.
        </p>
      </div>
    </footer>
  );
}
