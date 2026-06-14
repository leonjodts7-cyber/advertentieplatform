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
      <div className="container header-inner h-11 sm:h-12">
        <Link
          href="/"
          className="min-w-0 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b36b]/30"
        >
          <span className="font-display text-base font-medium tracking-tight text-[#fff6ef]">
            Veloura
          </span>
          <span className="mt-0.5 hidden text-[0.5rem] uppercase tracking-[0.14em] text-[#c2b4ab] sm:block">
            Adult Marketplace
          </span>
        </Link>

        <nav className="header-nav-center hidden items-center lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-2.5 py-1.5 text-sm text-[#c2b4ab] transition-colors hover:bg-white/[0.06] hover:text-[#fff6ef]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <nav className="hidden items-center lg:flex">
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
            <Button
              asChild
              size="sm"
              variant="primary"
              className="ml-1 h-9 min-h-0 px-3.5 text-xs"
            >
              <Link href="/dashboard/advertenties/nieuw">Plaats advertentie</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/zoeken"
              className="rounded-full px-1.5 py-1 text-[0.6875rem] text-[#c2b4ab] hover:text-[#fff6ef] sm:px-2 sm:text-xs"
            >
              Advertenties
            </Link>
            <Link
              href="/ai-lounge"
              className="rounded-full px-1.5 py-1 text-[0.6875rem] text-[#c2b4ab] hover:text-[#fff6ef] sm:px-2 sm:text-xs"
            >
              AI Lounge
            </Link>
            <Button
              asChild
              size="sm"
              variant="primary"
              className="h-8 min-h-0 px-2.5 text-[0.6875rem] sm:h-9 sm:px-3 sm:text-xs"
            >
              <Link href="/dashboard/advertenties/nieuw">Plaatsen</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
