import Link from "next/link";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
}

const navLinkClass =
  "rounded-full px-2 py-0.5 text-[0.8125rem] text-[var(--muted-light)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-light)] whitespace-nowrap";

const mobileLinkClass =
  "rounded-full px-1.5 py-1 text-[0.6875rem] text-[var(--muted-light)] hover:text-[var(--text-light)] sm:text-xs whitespace-nowrap";

export function Header({ user }: HeaderProps) {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container header-inner header-inner--balanced h-10 sm:h-11">
        <Link
          href="/"
          className="header-brand min-w-0 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne)]/30"
        >
          <span className="font-display text-[0.9375rem] font-medium tracking-tight text-[var(--text-light)] sm:text-base">
            Veloura
          </span>
        </Link>

        <nav className="header-nav-center hidden items-center gap-0.5 lg:flex">
          <Link href="/zoeken" className={navLinkClass}>
            Zoeken
          </Link>
          <Link href="/ai-lounge" className={navLinkClass}>
            AI Lounge
          </Link>
          {user && (
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
            </>
          )}
        </nav>

        <div className="header-actions header-actions--balanced">
          <div className="hidden items-center gap-1.5 lg:flex">
            {user ? (
              <UitloggenKnop />
            ) : (
              <Link href="/login" className={navLinkClass}>
                Login
              </Link>
            )}
            <Button
              asChild
              size="sm"
              variant="primary"
              className="h-7 min-h-0 shrink-0 px-2.5 text-[0.6875rem] sm:text-xs"
            >
              <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
            </Button>
          </div>

          <div className="flex min-w-0 items-center gap-1 lg:hidden">
            <Link href="/zoeken" className={mobileLinkClass}>
              Zoeken
            </Link>
            <Link href="/ai-lounge" className={mobileLinkClass}>
              AI
            </Link>
            {user && (
              <Link href="/dashboard" className={mobileLinkClass}>
                Dashboard
              </Link>
            )}
            {!user && (
              <Link href="/login" className={mobileLinkClass}>
                Login
              </Link>
            )}
            <Link
              href="/dashboard/advertenties/nieuw"
              className="rounded-full px-2 py-1 text-[0.6875rem] font-medium text-[var(--champagne)] hover:text-[var(--text-light)] sm:text-xs whitespace-nowrap"
            >
              Plaatsen
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
