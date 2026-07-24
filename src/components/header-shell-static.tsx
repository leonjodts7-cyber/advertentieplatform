"use client";

import Link from "next/link";
import { useTranslation } from "@/contexts/locale-context";

export function HeaderShellStatic() {
  const { t } = useTranslation();

  return (
    <header className="site-header glass-nav sticky top-0 z-50">
      <div className="container header-shell header-shell--premium">
        <Link href="/" prefetch className="header-brand">
          <span className="header-brand__text">Veloura</span>
        </Link>

        <nav className="header-nav-center header-nav-center--static" aria-label={t("nav.menu")}>
          <Link href="/zoeken" prefetch className="header-nav-link">
            {t("nav.search")}
          </Link>
          <Link href="/ai-lounge" prefetch className="header-nav-link">
            {t("nav.aiLounge")}
          </Link>
        </nav>

        <div className="header-actions header-actions--skeleton" aria-hidden>
          <span className="header-skeleton-pill header-skeleton-pill--dark" />
          <span className="header-skeleton-pill header-skeleton-pill--dark header-skeleton-pill--wide" />
        </div>
      </div>
    </header>
  );
}
