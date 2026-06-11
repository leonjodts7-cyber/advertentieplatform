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
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/75 backdrop-blur-2xl backdrop-saturate-150">
      <div className="container flex h-14 items-center justify-between gap-2 sm:h-[3.75rem]">
        <Link
          href="/"
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <span className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Red<span className="text-champagne">Light</span>
          </span>
          <span className="mt-0.5 hidden text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground sm:block">
            Premium Marketplace
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <UitloggenKnop />
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Login
            </Link>
          )}
          <Button asChild size="sm" className="ml-2">
            <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
          </Button>
        </nav>

        {/* Mobile: scroll nav + CTA */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 lg:hidden">
          <nav className="flex max-w-[55%] gap-1 overflow-x-auto no-scrollbar sm:max-w-none">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:text-champagne sm:px-2.5 sm:text-sm"
              >
                {link.label === "Plaats advertentie" ? "Plaatsen" : link.label}
              </Link>
            ))}
            {user ? (
              <span className="shrink-0 px-1">
                <UitloggenKnop />
              </span>
            ) : (
              <Link
                href="/login"
                className="shrink-0 rounded-lg px-2 py-1.5 text-xs text-muted-foreground sm:text-sm"
              >
                Login
              </Link>
            )}
          </nav>
          <Button asChild size="sm" className="shrink-0 px-3">
            <Link href="/dashboard/advertenties/nieuw">Plaatsen</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
