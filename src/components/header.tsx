import Link from "next/link";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User | null;
}

const navLinks = [
  { href: "/zoeken", label: "Advertenties" },
  { href: "/ai-lounge", label: "AI Lounge" },
  { href: "/dashboard/advertenties/nieuw", label: "Plaats advertentie" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Header({ user }: HeaderProps) {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between gap-2 sm:h-[3.75rem]">
        <Link
          href="/"
          className="min-w-0 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/30"
        >
          <span className="font-display text-lg font-medium tracking-tight text-foreground sm:text-xl">
            Veloura
          </span>
          <span className="mt-0.5 block text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground sm:text-[0.625rem]">
            Adult Marketplace
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-soft-champagne"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <UitloggenKnop />
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Login
            </Link>
          )}
          <Button asChild size="sm" variant="primary" className="ml-1.5">
            <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
          </Button>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:hidden">
          <Link
            href="/zoeken"
            className="rounded-full px-2 py-2 text-xs text-muted-foreground hover:text-soft-champagne sm:px-2.5 sm:text-sm"
          >
            Advertenties
          </Link>
          <Link
            href="/ai-lounge"
            className="hidden rounded-full px-2 py-2 text-xs text-muted-foreground hover:text-soft-champagne min-[400px]:inline sm:px-2.5 sm:text-sm"
          >
            AI Lounge
          </Link>
          <Link
            href="/ai-lounge"
            className="rounded-full px-2 py-2 text-xs text-muted-foreground hover:text-soft-champagne min-[400px]:hidden"
            aria-label="AI Lounge"
          >
            Lounge
          </Link>
          <Button asChild size="sm" variant="primary" className="px-2.5 text-xs sm:px-3">
            <Link href="/dashboard/advertenties/nieuw">Plaatsen</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
