import Link from "next/link";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
}

const navLinks = [
  { href: "/zoeken", label: "Advertenties" },
  { href: "/dashboard/advertenties/nieuw", label: "Plaats advertentie" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header({ user }: HeaderProps) {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between gap-3 sm:h-[3.75rem]">
        <Link
          href="/"
          className="shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <span className="font-display text-xl font-medium tracking-tight text-foreground">
            Veloura
          </span>
          <span className="mt-0.5 hidden text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground md:block">
            Premium Marketplace
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-soft hover:text-primary-dark"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <UitloggenKnop />
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Login
            </Link>
          )}
          <Button asChild size="sm" variant="premium" className="ml-2">
            <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/zoeken"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-primary-dark"
          >
            Zoeken
          </Link>
          <Button asChild size="sm" variant="premium" className="px-4">
            <Link href="/dashboard/advertenties/nieuw">Plaatsen</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
