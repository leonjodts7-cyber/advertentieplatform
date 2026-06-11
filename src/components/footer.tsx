import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/30 bg-card/40 backdrop-blur-sm">
      <div className="container py-8 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-lg font-medium text-foreground">
              Red<span className="text-champagne">Light</span>
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Premium Adult Marketplace
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Discreet platform voor zelfstandige aanbieders. Alleen 18+.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/zoeken" className="text-muted-foreground hover:text-champagne">
              Advertenties
            </Link>
            <Link
              href="/dashboard/advertenties/nieuw"
              className="text-muted-foreground hover:text-champagne"
            >
              Plaats advertentie
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-champagne">
              Dashboard
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-champagne">
              Login
            </Link>
          </nav>
        </div>

        <div className="divider-gold mt-6" />
        <p className="mt-4 text-[0.6875rem] leading-relaxed text-muted-foreground/60">
          Alle aanbieders moeten 18+ zijn. Illegale inhoud, misleiding en
          gedwongen activiteiten zijn verboden.
        </p>
      </div>
    </footer>
  );
}
