import Link from "next/link";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
}

const mainNav = [
  { href: "/zoeken", label: "Advertenties" },
  { href: "/ai-lounge", label: "AI Lounge" },
  { href: "/dashboard/advertenties/nieuw", label: "Plaats advertentie" },
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
              className="rounded-full px-2.5 py-1 text-sm text-[var(--muted-light)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-light)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="hidden items-center lg:flex">
            {user ? (
              <UitloggenKnop />
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
              className="ml-1.5 h-8 min-h-0 px-3 text-xs"
            >
              <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/zoeken"
              className="rounded-full px-1.5 py-1 text-[0.6875rem] text-[var(--muted-light)] hover:text-[var(--text-light)] sm:text-xs"
            >
              Advertenties
            </Link>
            <Link
              href="/ai-lounge"
              className="rounded-full px-1.5 py-1 text-[0.6875rem] text-[var(--muted-light)] hover:text-[var(--text-light)] sm:text-xs"
            >
              AI Lounge
            </Link>
            <Button
              asChild
              size="sm"
              variant="primary"
              className="h-8 min-h-0 px-2.5 text-[0.6875rem] sm:px-3 sm:text-xs"
            >
              <Link href="/dashboard/advertenties/nieuw">Plaatsen</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
