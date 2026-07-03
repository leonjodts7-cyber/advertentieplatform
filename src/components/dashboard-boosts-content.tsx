"use client";

import Link from "next/link";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { useTranslation } from "@/contexts/locale-context";
import {
  AUTO_BOOST_PRIJZEN,
  BOOST_BESCHRIJVINGEN,
  BOOST_DUUR_OPTIES,
  BOOST_PRIJZEN,
  BOOST_ZICHTBAARHEID,
  PREMIUM_MAAND_PRIJS,
  formatEuro,
} from "@/lib/advertentie-boost";

export function DashboardBoostsContent() {
  const { t } = useTranslation();

  const packages = [
    {
      id: "gratis",
      title: t("boosts.free"),
      desc: t("boosts.freeDesc"),
      prijs: "€0",
      looptijd: t("boosts.unlimited"),
      voordelen: [t("boosts.freeBenefit1"), t("boosts.freeBenefit2"), t("boosts.freeBenefit3")],
      cta: t("dashboard.createFirst"),
      href: "/dashboard/advertenties/nieuw",
      enabled: true,
    },
    {
      id: "premium",
      title: t("boosts.premium"),
      desc: t("boosts.premiumDesc"),
      prijs: formatEuro(PREMIUM_MAAND_PRIJS),
      looptijd: t("boosts.days30"),
      voordelen: [t("boosts.premiumBenefit1"), t("boosts.premiumBenefit2"), t("boosts.premiumBenefit3")],
      cta: t("boosts.comingSoon"),
      enabled: false,
    },
    {
      id: "stad",
      title: t("boosts.cityBoost"),
      desc: BOOST_BESCHRIJVINGEN.stad,
      prijs: `${t("boosts.from")} ${formatEuro(BOOST_PRIJZEN.stad[1])}`,
      looptijd: `${BOOST_DUUR_OPTIES.stad.join(" / ")} ${t("boosts.days")}`,
      voordelen: [BOOST_ZICHTBAARHEID.stad, t("boosts.cityBenefit2"), t("boosts.cityBenefit3")],
      cta: t("boosts.comingSoon"),
      enabled: false,
    },
    {
      id: "homepage",
      title: t("boosts.spotlight"),
      desc: BOOST_BESCHRIJVINGEN.homepage,
      prijs: `${t("boosts.from")} ${formatEuro(BOOST_PRIJZEN.homepage[1])}`,
      looptijd: `${BOOST_DUUR_OPTIES.homepage.join(" / ")} ${t("boosts.days")}`,
      voordelen: [BOOST_ZICHTBAARHEID.homepage, t("boosts.spotlightBenefit2"), t("boosts.spotlightBenefit3")],
      cta: t("boosts.comingSoon"),
      enabled: false,
    },
  ] as const;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div className="container">
          <DashboardSubnav />
          <h1 className="dashboard-page__title">{t("boosts.title")}</h1>
          <p className="dashboard-page__subtitle">{t("boosts.subtitle")}</p>
        </div>
      </div>

      <div className="container dashboard-page__body">
        <div className="boost-stripe-notice">
          <p>{t("boosts.notice")}</p>
        </div>

        <div className="boost-packages-grid">
          {packages.map((pakket) => (
            <article key={pakket.id} className="boost-package-card">
              <h2 className="boost-package-card__title">{pakket.title}</h2>
              <p className="boost-package-card__desc">{pakket.desc}</p>
              <p className="boost-package-card__price">{pakket.prijs}</p>
              <p className="boost-package-card__duration">
                {t("boosts.duration")}: {pakket.looptijd}
              </p>
              <ul className="boost-package-card__benefits">
                {pakket.voordelen.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              {pakket.enabled && "href" in pakket ? (
                <Link href={pakket.href} className="dashboard-btn dashboard-btn--primary w-full">
                  {pakket.cta}
                </Link>
              ) : (
                <button type="button" className="dashboard-btn dashboard-btn--secondary w-full" disabled>
                  {pakket.cta}
                </button>
              )}
            </article>
          ))}
        </div>

        <div className="boost-plan-card boost-plan-card--auto mt-4">
          <h2 className="boost-plan-card__title">{t("boosts.autoBoost")}</h2>
          <p className="boost-plan-card__desc">{t("boosts.autoBoostDesc")}</p>
          <ul className="boost-plan-card__prices">
            <li>
              <span>{t("boosts.weekendBoost")}</span>
              <span className="boost-plan-card__price">
                {formatEuro(AUTO_BOOST_PRIJZEN.weekend)}/{t("boosts.perMonth")}
              </span>
            </li>
            <li>
              <span>{t("boosts.eveningBoost")}</span>
              <span className="boost-plan-card__price">
                {formatEuro(AUTO_BOOST_PRIJZEN.avond)}/{t("boosts.perMonth")}
              </span>
            </li>
          </ul>
          <button type="button" className="dashboard-btn dashboard-btn--secondary w-full" disabled>
            {t("boosts.comingSoon")}
          </button>
        </div>

        <div className="dashboard-quick-actions mt-4">
          <Link
            href="/dashboard/advertenties/nieuw?stap=promotie"
            className="dashboard-btn dashboard-btn--primary"
          >
            {t("boosts.viaWizard")}
          </Link>
          <Link href="/dashboard/advertenties" className="dashboard-btn dashboard-btn--secondary">
            {t("dashboard.myAds")}
          </Link>
        </div>
      </div>
    </div>
  );
}
