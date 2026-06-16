import Link from "next/link";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
}

const mainNav = [
  { href: "/zoeken", label: "Zoeken" },
  { href: "/ai-lounge", label: "AI Lounge" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header({ user }: HeaderProps) {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container header-inner h-10 sm:h-11">
        <Link
          href="/"
          className="min-w-0 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne)]/30"
        >
          <span className="font-display text-[0.9375rem] font-medium tracking-tight text-[var(--text-light)] sm:text-base">
            Veloura
          </span>
        </Link>

        <nav className="header-nav-center hidden items-center lg:flex">
          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-2 py-0.5 text-[0.8125rem] text-[var(--muted-light)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-light)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="hidden items-center gap-1 lg:flex">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-full px-2.5 py-1 text-sm text-[var(--muted-light)] hover:text-[var(--text-light)]"
                >
                  Dashboard
                </Link>
                <UitloggenKnop />
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full px-2.5 py-1 text-sm text-[var(--muted-light)] hover:text-[var(--text-light)]"
              >
                Login
              </Link>
            )}
            <Button
              asChild
              size="sm"
              variant="primary"
              className="ml-1 h-7 min-h-0 px-2.5 text-[0.6875rem] sm:text-xs"
            >
              <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
            </Button>
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            <Link
              href="/zoeken"
              className="rounded-full px-1.5 py-1 text-[0.6875rem] text-[var(--muted-light)] hover:text-[var(--text-light)] sm:text-xs"
            >
              Zoeken
            </Link>
            <Link
              href="/ai-lounge"
              className="rounded-full px-1.5 py-1 text-[0.6875rem] text-[var(--muted-light)] hover:text-[var(--text-light)] sm:text-xs"
            >
              AI Lounge
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-full px-1.5 py-1 text-[0.6875rem] text-[var(--muted-light)] hover:text-[var(--text-light)] sm:text-xs"
                >
                  Dashboard
                </Link>
                <UitloggenKnop />
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full px-1.5 py-1 text-[0.6875rem] text-[var(--muted-light)] hover:text-[var(--text-light)] sm:text-xs"
              >
                Login
              </Link>
            )}
            <Link
              href="/dashboard/advertenties/nieuw"
              className="rounded-full px-2 py-1 text-[0.6875rem] font-medium text-[var(--champagne)] hover:text-[var(--text-light)] sm:text-xs"
            >
              Plaatsen
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
