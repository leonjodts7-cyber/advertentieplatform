"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Overzicht", exact: true },
  { href: "/dashboard/advertenties", label: "Mijn advertenties", exact: false },
  { href: "/dashboard/advertenties/nieuw", label: "Nieuwe advertentie", exact: true },
  { href: "/dashboard/boosts", label: "Boosts", exact: true },
  { href: "/dashboard#instellingen", label: "Instellingen", exact: false },
] as const;

function isActive(pathname: string, href: string, exact: boolean) {
  if (href === "/dashboard#instellingen") return false;
  if (exact) return pathname === href;
  if (href === "/dashboard/advertenties") {
    return (
      pathname === "/dashboard/advertenties" ||
      pathname.startsWith("/dashboard/advertenties/") &&
        !pathname.startsWith("/dashboard/advertenties/nieuw")
    );
  }
  return pathname.startsWith(href);
}

export function DashboardSubnav() {
  const pathname = usePathname();

  return (
    <nav className="dashboard-subnav" aria-label="Dashboard navigatie">
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href, tab.exact);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn("dashboard-subnav__pill", active && "dashboard-subnav__pill--active")}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
