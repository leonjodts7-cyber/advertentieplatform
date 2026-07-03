"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/contexts/locale-context";
import { cn } from "@/lib/utils";

const TAB_KEYS = [
  { href: "/dashboard", key: "dashboard.overview", exact: true },
  { href: "/dashboard/advertenties", key: "dashboard.ads", exact: false },
  { href: "/dashboard/advertenties/nieuw", key: "dashboard.newListing", exact: true },
  { href: "/dashboard/boosts", key: "dashboard.boosts", exact: true },
  { href: "/dashboard/instellingen", key: "dashboard.settings", exact: true },
] as const;

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  if (href === "/dashboard/advertenties") {
    return (
      pathname === "/dashboard/advertenties" ||
      (pathname.startsWith("/dashboard/advertenties/") &&
        !pathname.startsWith("/dashboard/advertenties/nieuw"))
    );
  }
  return pathname.startsWith(href);
}

export function DashboardSubnav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="dashboard-subnav dashboard-subnav--compact" aria-label="Dashboard">
      {TAB_KEYS.map((tab) => {
        const active = isActive(pathname, tab.href, tab.exact);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "dashboard-subnav__pill",
              active && "dashboard-subnav__pill--active"
            )}
          >
            {t(tab.key)}
          </Link>
        );
      })}
    </nav>
  );
}
