"use client";

import Link from "next/link";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { useTranslation } from "@/contexts/locale-context";

interface DashboardOverviewProps {
  actief: number;
  concept: number;
  premiumActief: number;
  actieveBoosts: number;
  premiumDagen: number;
  listingFavorites: number;
  aiCredits: number;
  totaal: number;
}

export function DashboardOverview({
  actief,
  concept,
  premiumActief,
  actieveBoosts,
  premiumDagen,
  listingFavorites,
  aiCredits,
  totaal,
}: DashboardOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header dashboard-page__header--compact">
        <div className="container">
          <DashboardSubnav />
          <h1 className="dashboard-page__title">{t("dashboard.title")}</h1>
          <p className="dashboard-page__subtitle">{t("dashboard.subtitle")}</p>
        </div>
      </div>

      <div className="container dashboard-page__body dashboard-page__body--compact">
        <div className="dashboard-metrics dashboard-metrics--compact">
          <div className="dashboard-metric-card">
            <span className="dashboard-metric-card__label">{t("dashboard.activeAds")}</span>
            <span className="dashboard-metric-card__value dashboard-metric-card__value--success">
              {actief}
            </span>
          </div>
          <div className="dashboard-metric-card">
            <span className="dashboard-metric-card__label">{t("dashboard.drafts")}</span>
            <span className="dashboard-metric-card__value">{concept}</span>
          </div>
          <div className="dashboard-metric-card">
            <span className="dashboard-metric-card__label">{t("dashboard.listingFavorites")}</span>
            <span className="dashboard-metric-card__value">{listingFavorites}</span>
          </div>
          <div className="dashboard-metric-card">
            <span className="dashboard-metric-card__label">{t("dashboard.activeBoosts")}</span>
            <span className="dashboard-metric-card__value">{actieveBoosts}</span>
          </div>
        </div>

        <div className="dashboard-primary-actions">
          <Link href="/dashboard/advertenties/nieuw" className="dashboard-btn dashboard-btn--primary">
            {t("dashboard.newAd")}
          </Link>
          <Link href="/dashboard/advertenties" className="dashboard-btn dashboard-btn--secondary">
            {t("dashboard.myAds")}
          </Link>
          <Link href="/dashboard/boosts" className="dashboard-btn dashboard-btn--secondary">
            {t("dashboard.buyBoost")}
          </Link>
        </div>

        <div className="dashboard-panels dashboard-panels--compact">
          <section className="dashboard-panel dashboard-panel--compact">
            <h2 className="dashboard-panel__title">{t("dashboard.yourAds")}</h2>
            <div className="dashboard-mini-grid">
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">{t("dashboard.total")}</span>
                <span className="dashboard-mini-stat__value">{totaal}</span>
              </div>
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">{t("dashboard.active")}</span>
                <span className="dashboard-mini-stat__value dashboard-mini-stat__value--success">
                  {actief}
                </span>
              </div>
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">{t("dashboard.draft")}</span>
                <span className="dashboard-mini-stat__value">{concept}</span>
              </div>
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">{t("dashboard.premiumActive")}</span>
                <span className="dashboard-mini-stat__value">{premiumActief}</span>
              </div>
            </div>
          </section>

          <section className="dashboard-panel dashboard-panel--compact">
            <h2 className="dashboard-panel__title">{t("dashboard.visibility")}</h2>
            <div className="dashboard-mini-grid dashboard-mini-grid--2">
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">{t("dashboard.activeBoosts")}</span>
                <span className="dashboard-mini-stat__value">{actieveBoosts}</span>
              </div>
              <div className="dashboard-mini-stat">
                <span className="dashboard-mini-stat__label">{t("dashboard.premiumDays")}</span>
                <span className="dashboard-mini-stat__value">
                  {premiumDagen > 0 ? premiumDagen : "—"}
                </span>
              </div>
            </div>
            <Link href="/dashboard/boosts" className="dashboard-btn dashboard-btn--outline dashboard-btn--sm mt-3">
              {t("dashboard.buyBoost")}
            </Link>
          </section>
        </div>

        <section className="dashboard-panel dashboard-panel--secondary">
          <h2 className="dashboard-panel__title">{t("dashboard.aiCreditsTitle")}</h2>
          <p className="dashboard-panel__text dashboard-panel__text--sm">
            {t("dashboard.aiCredits", { count: aiCredits })}
          </p>
          <div className="dashboard-quick-actions dashboard-quick-actions--inline mt-2">
            <Link href="/ai-lounge" className="dashboard-btn dashboard-btn--outline dashboard-btn--sm">
              {t("dashboard.aiGo")}
            </Link>
            <Link href="/credits" className="dashboard-btn dashboard-btn--outline dashboard-btn--sm">
              {t("dashboard.buyCredits")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
