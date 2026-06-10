import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/50">
      <div className="container py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Privé Ontvangst
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Professioneel advertentieplatform voor zelfstandige aanbieders.
              Alleen voor volwassenen van 18 jaar en ouder.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Home
            </Link>
            <Link
              href="/zoeken"
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Zoeken
            </Link>
            <Link
              href="/dashboard"
              className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <p className="mt-8 border-t border-border/60 pt-6 text-xs leading-relaxed text-muted-foreground">
          Alle aanbieders moeten 18+ zijn. Illegale inhoud, misleiding en
          gedwongen activiteiten zijn verboden.
        </p>
      </div>
    </footer>
  );
}
