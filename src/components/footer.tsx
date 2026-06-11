import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-white/[0.02]">
      <div className="container py-8 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-lg text-veloura-ivory">Veloura</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-veloura-soft">
              Premium platform voor discrete advertenties
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-veloura-soft">
              Stijlvol, discreet en professioneel. Alleen 18+.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/zoeken" className="text-veloura-soft hover:text-veloura-champagne">
              Advertenties
            </Link>
            <Link
              href="/dashboard/advertenties/nieuw"
              className="text-veloura-soft hover:text-veloura-champagne"
            >
              Plaats advertentie
            </Link>
            <Link href="/dashboard" className="text-veloura-soft hover:text-veloura-champagne">
              Dashboard
            </Link>
            <Link href="/login" className="text-veloura-soft hover:text-veloura-champagne">
              Login
            </Link>
          </nav>
        </div>
        <div className="divider-soft mt-6" />
        <p className="mt-4 text-xs leading-relaxed text-veloura-soft/70">
          Alle aanbieders moeten 18+ zijn. Illegale inhoud, misleiding en
          gedwongen activiteiten zijn verboden.
        </p>
      </div>
    </footer>
  );
}
