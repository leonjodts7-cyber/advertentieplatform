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
      <div className="container flex h-12 items-center justify-between gap-2 sm:h-[3.25rem]">
        <Link
          href="/"
          className="min-w-0 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/30"
        >
          <span className="font-display text-base font-medium tracking-tight text-[#fff6ef] sm:text-lg">
            Veloura
          </span>
          <span className="mt-0.5 block text-[0.5rem] uppercase tracking-[0.14em] text-[#c2b4ab] sm:text-[0.5625rem]">
            Adult Marketplace
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-2.5 py-1.5 text-sm text-[#c2b4ab] transition-colors hover:bg-white/[0.06] hover:text-[#fff6ef]"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <UitloggenKnop />
          ) : (
            <Link
              href="/login"
              className="rounded-full px-2.5 py-1.5 text-sm text-[#c2b4ab] hover:text-[#fff6ef]"
            >
              Login
            </Link>
          )}
          <Button asChild size="sm" variant="primary" className="ml-1 h-9 min-h-0 px-3.5 text-xs">
            <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
          </Button>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
          <Link
            href="/zoeken"
            className="rounded-full px-2 py-1.5 text-xs text-[#c2b4ab] hover:text-[#fff6ef]"
          >
            Zoeken
          </Link>
          <Button asChild size="sm" variant="primary" className="h-9 min-h-0 px-3 text-xs">
            <Link href="/dashboard/advertenties/nieuw">Plaatsen</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
