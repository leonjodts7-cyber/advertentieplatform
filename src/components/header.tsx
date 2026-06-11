import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
}

const navLinks = [
  { href: "/zoeken", label: "Advertenties" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="container flex h-14 items-center justify-between gap-3 sm:h-16">
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-tight text-foreground transition-colors hover:text-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm sm:text-xl"
        >
          Privé Ontvangst
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <UitloggenKnop />
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Login
            </Link>
          )}
          <Button asChild size="sm" className="ml-2">
            <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
          </Button>
        </nav>

        <MobileNav user={user} />
      </div>
    </header>
  );
}
