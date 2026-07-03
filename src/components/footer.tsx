"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/contexts/locale-context";

const PLAATS_REDIRECT = encodeURIComponent("/dashboard/advertenties/nieuw");

interface FooterProps {
  user?: User | null;
}

export function Footer({ user = null }: FooterProps) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <p className="site-footer__logo">Veloura</p>
            <p className="site-footer__tagline">{t("footer.tagline")}</p>
            <p className="site-footer__18">{t("common.only18")}</p>
            <p className="site-footer__discretion">{t("footer.discretion")}</p>
          </div>

          <div>
            <p className="site-footer__heading">{t("footer.platform")}</p>
            <ul className="site-footer__links">
              <li>
                <Link href="/zoeken">{t("footer.profiles")}</Link>
              </li>
              <li>
                <Link href="/ai-lounge">{t("nav.aiLounge")}</Link>
              </li>
              <li>
                <Link href={`/login?redirect=${PLAATS_REDIRECT}`}>
                  {t("footer.placeAd")}
                </Link>
              </li>
              <li>
                <Link
                  href={
                    user
                      ? "/dashboard"
                      : `/login?redirect=${encodeURIComponent("/dashboard")}`
                  }
                >
                  {user ? t("nav.dashboard") : t("nav.login")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="site-footer__heading">{t("footer.legal")}</p>
            <ul className="site-footer__links">
              <li>
                <Link href="/juridisch/privacy">{t("footer.privacy")}</Link>
              </li>
              <li>
                <Link href="/juridisch/voorwaarden">{t("footer.terms")}</Link>
              </li>
              <li>
                <Link href="/juridisch/contact">{t("footer.contact")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="site-footer__heading">{t("footer.language")}</p>
            <LanguageSwitcher className="site-footer__lang" />
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} Veloura. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
