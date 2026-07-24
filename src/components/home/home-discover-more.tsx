"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";

const DISCOVER_LINKS = [
  { href: "/zoeken?sort=nieuwste", labelKey: "discovery.newTodayTitle" },
  { href: "/zoeken?premium_profiel=true", labelKey: "home.premiumTitle" },
  { href: "/zoeken?beschikbaar=true", labelKey: "discovery.onlineNowTitle" },
  { href: "/zoeken?sort=aanbevolen", labelKey: "home.trendingTitle" },
] as const;

export function HomeDiscoverMore() {
  const { t } = useTranslation();

  return (
    <section className="home-discover-more">
      <div className="container">
        <div className="home-discover-more__inner">
          <div>
            <h2 className="home-discover-more__title">{t("discovery.exploreMoreTitle")}</h2>
            <p className="home-discover-more__subtitle">{t("discovery.exploreMoreSubtitle")}</p>
          </div>
          <div className="home-discover-more__links">
            {DISCOVER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} prefetch className="home-discover-more__link">
                {t(link.labelKey)}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
