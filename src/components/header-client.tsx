"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { AccountDropdown } from "@/components/account-dropdown";
import { HeaderNotifications } from "@/components/header-notifications";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/contexts/locale-context";
import {
  buildLoginHref,
  buildPlaatsAdvertentieHref,
  isProviderRole,
  type UserRole,
} from "@/lib/user-role";
import { cn } from "@/lib/utils";

interface HeaderClientProps {
  user: User | null;
  role: UserRole;
  displayName?: string | null;
}

function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderClient({ user, role, displayName }: HeaderClientProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const provider = user ? isProviderRole(role) : false;
  const plaatsHref = buildPlaatsAdvertentieHref(!!user);
  const loginHref = buildLoginHref();

  const centerLinks = provider
    ? [
        { href: "/dashboard", label: t("nav.dashboard") },
        { href: "/dashboard/advertenties", label: t("nav.ads") },
        { href: "/dashboard/boosts", label: t("nav.boosts") },
        { href: "/ai-lounge", label: t("nav.aiLounge") },
      ]
    : [
        { href: "/zoeken", label: t("nav.search") },
        { href: "/ai-lounge", label: t("nav.aiLounge") },
        ...(user ? [{ href: "/favorieten", label: t("nav.favorites") }] : []),
      ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const linkClass = (href: string) =>
    cn("header-nav-link", navActive(pathname, href) && "header-nav-link--active");

  return (
    <header className="site-header glass-nav sticky top-0 z-50">
      <div className="container header-shell header-shell--premium">
        <Link href="/" className="header-brand">
          <span className="header-brand__text">Veloura</span>
        </Link>

        <nav className="header-nav-center" aria-label={t("nav.menu")}>
          {centerLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher compact className="header-actions__lang" />

          {!user ? (
            <Link href={loginHref} className="header-btn header-btn--soft">
              {t("nav.loginRegister")}
            </Link>
          ) : (
            <>
              <HeaderNotifications user={user} role={role} />
              <AccountDropdown user={user} role={role} displayName={displayName} />
            </>
          )}

          <Link href={plaatsHref} className="header-btn header-btn--primary header-btn--place-ad">
            {t("nav.placeAd")}
          </Link>

          <button
            type="button"
            className="header-menu-btn"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("nav.close") : t("nav.menu")}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            className="header-mobile-backdrop"
            aria-label={t("nav.close")}
            onClick={() => setMenuOpen(false)}
          />
          <div className="header-mobile-panel">
            <nav className="header-mobile-nav" aria-label={t("nav.menu")}>
              {centerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "header-mobile-link",
                    navActive(pathname, link.href) && "header-mobile-link--active"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {!user && (
                <Link href={loginHref} className="header-mobile-link">
                  {t("nav.loginRegister")}
                </Link>
              )}

              <Link href={plaatsHref} className="header-mobile-cta">
                {t("nav.placeAd")}
              </Link>
            </nav>
            <div className="header-mobile-lang">
              <LanguageSwitcher />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
