"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user: User | null;
}

const links = [
  { href: "/zoeken", label: "Advertenties" },
  { href: "/dashboard/advertenties/nieuw", label: "Plaats advertentie" },
  { href: "/dashboard", label: "Dashboard" },
];

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-card/50 text-foreground transition-colors hover:border-champagne/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={open ? "Menu sluiten" : "Menu openen"}
        aria-expanded={open}
      >
        <span className="relative h-4 w-5">
          <span
            className={cn(
              "absolute left-0 h-0.5 w-5 bg-foreground transition-all duration-200",
              open ? "top-2 rotate-45" : "top-0"
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-2 h-0.5 w-5 bg-foreground transition-all duration-200",
              open ? "opacity-0" : "opacity-100"
            )}
          />
          <span
            className={cn(
              "absolute left-0 h-0.5 w-5 bg-foreground transition-all duration-200",
              open ? "top-2 -rotate-45" : "top-4"
            )}
          />
        </span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className="fixed left-0 right-0 top-16 z-50 border-b border-border/60 bg-card/95 p-4 backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center rounded-xl px-4 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="divider-gold my-2" />
              {user ? (
                <div className="px-2">
                  <UitloggenKnop />
                </div>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                </Button>
              )}
              <Button asChild className="mt-2 w-full">
                <Link
                  href="/dashboard/advertenties/nieuw"
                  onClick={() => setOpen(false)}
                >
                  Plaats advertentie
                </Link>
              </Button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
