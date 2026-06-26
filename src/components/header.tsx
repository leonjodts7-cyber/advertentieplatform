import Link from "next/link";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
}

const navLinkClass =
  "header-nav-link rounded-full px-2.5 py-1.5 text-[0.8125rem] font-medium text-[var(--text-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-main)] whitespace-nowrap shrink-0";

export function Header({ user }: HeaderProps) {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container header-shell">
        <Link
          href="/"
          className="header-brand shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/35"
        >
          <span className="font-display text-[0.9375rem] font-medium tracking-tight text-[var(--text-main)] sm:text-base">
            Veloura
          </span>
        </Link>

        <nav className="header-nav-scroll" aria-label="Hoofdnavigatie">
          <Link href="/zoeken" className={navLinkClass}>
            Zoeken
          </Link>
          <Link href="/ai-lounge" className={navLinkClass}>
            AI Lounge
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
              <Link href="/dashboard/advertenties" className={navLinkClass}>
                Mijn advertenties
              </Link>
              <Link href="/dashboard/boosts" className={navLinkClass}>
                Boosts
              </Link>
              <Link href="/dashboard/instellingen" className={navLinkClass}>
                Instellingen
              </Link>
              <span className="header-nav-scroll__mobile-only">
                <UitloggenKnop compact />
              </span>
            </>
          ) : (
            <Link href="/login" className={navLinkClass}>
              Login
            </Link>
          )}
          <Link
            href="/dashboard/advertenties/nieuw"
            className="header-nav-link header-nav-link--cta header-nav-scroll__mobile-only rounded-full px-2.5 py-1.5 text-[0.8125rem] font-semibold whitespace-nowrap shrink-0"
          >
            Plaats advertentie
          </Link>
        </nav>

        <div className="header-cta-group">
          {user && (
            <span className="header-cta-group__desktop-only">
              <UitloggenKnop />
            </span>
          )}
          <Button
            asChild
            size="sm"
            variant="primary"
            className="header-cta-group__desktop-only shrink-0"
          >
            <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
