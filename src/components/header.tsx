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
    <header className="sticky top-0 z-50 border-b border-white/[0.10] bg-[rgba(20,11,18,0.72)] backdrop-blur-2xl">
      <div className="container flex h-14 items-center justify-between gap-3 sm:h-[3.75rem]">
        <Link
          href="/"
          className="shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veloura-champagne/40"
        >
          <span className="font-display text-xl font-medium tracking-tight text-veloura-ivory">
            Veloura
          </span>
          <span className="mt-0.5 hidden text-[0.625rem] uppercase tracking-[0.18em] text-veloura-muted md:block">
            Premium Marketplace
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm text-veloura-soft transition-colors hover:bg-white/[0.05] hover:text-veloura-champagne"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <UitloggenKnop />
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3.5 py-2 text-sm text-veloura-soft hover:text-veloura-ivory"
            >
              Login
            </Link>
          )}
          <Button asChild size="sm" variant="primary" className="ml-2">
            <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" variant="primary" className="px-4">
            <Link href="/dashboard/advertenties/nieuw">Plaatsen</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
