import Link from "next/link";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
}

const navLinkClass =
  "header-nav-link rounded-full px-2.5 py-1.5 text-[0.8125rem] font-medium text-[var(--text-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-main)] whitespace-nowrap shrink-0";

const PLAATS_REDIRECT = encodeURIComponent("/dashboard/advertenties/nieuw");

export function Header({ user }: HeaderProps) {
  const plaatsHref = user
    ? "/dashboard/advertenties/nieuw"
    : `/login?redirect=${PLAATS_REDIRECT}`;

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
              <Link href="/favorieten" className={navLinkClass}>
                Favorieten
              </Link>
              <Link href="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={navLinkClass}>
                Login
              </Link>
              <Link href="/login?tab=registreren" className={navLinkClass}>
                Registreren
              </Link>
            </>
          )}
          <span className="header-nav-scroll__mobile-only flex items-center gap-1">
            {user && <UitloggenKnop compact />}
            <Link
              href={plaatsHref}
              className="header-nav-link header-nav-link--cta rounded-full px-2.5 py-1.5 text-[0.8125rem] font-semibold whitespace-nowrap shrink-0"
            >
              Plaatsen
            </Link>
          </span>
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
            <Link href={plaatsHref}>Plaats advertentie</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
