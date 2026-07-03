"use client";

import Link from "next/link";
import { useState } from "react";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { useTranslation } from "@/contexts/locale-context";

export interface DashboardActivityItem {
  id: string;
  messageKey: string;
  detail?: string;
  href?: string;
}

interface DashboardOverviewProps {
  actief: number;
  concept: number;
  premiumActief: number;
  actieveBoosts: number;
  premiumDagen: number;
  listingFavorites: number;
  aiCredits: number;
  totaal: number;
  activity: DashboardActivityItem[];
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
  activity,
}: DashboardOverviewProps) {
  const { t } = useTranslation();
  const [chartRange, setChartRange] = useState<"7" | "30" | "90">("7");

  const todayMetrics = [
    { label: t("dashboardInsights.views"), value: "—" },
    { label: t("dashboardInsights.favorites"), value: listingFavorites },
    { label: t("dashboardInsights.contacts"), value: "—" },
    { label: t("dashboardInsights.chats"), value: aiCredits > 0 ? "AI" : "—" },
    { label: t("dashboardInsights.appointments"), value: actief },
  ];

  const chartBars = [
    Math.max(1, listingFavorites),
    Math.max(1, actief),
    Math.max(1, premiumActief),
    Math.max(1, actieveBoosts),
    Math.max(1, concept),
    Math.max(1, totaal),
    Math.max(1, listingFavorites + actief),
  ];
  const chartMax = Math.max(...chartBars, 1);

  return (
    <div className="dashboard-page dashboard-page--cockpit">
      <div className="dashboard-page__header dashboard-page__header--compact">
        <div className="container">
          <DashboardSubnav />
          <p className="dashboard-welcome">{t("dashboard.welcome")}</p>
          <h1 className="dashboard-page__title">{t("dashboard.title")}</h1>
          <p className="dashboard-page__subtitle">{t("dashboard.subtitle")}</p>
        </div>
      </div>

      <div className="container dashboard-page__body dashboard-page__body--cockpit">
        <section className="dashboard-cockpit-today">
          <h2 className="dashboard-cockpit-section__title">{t("dashboardInsights.today")}</h2>
          <div className="dashboard-cockpit-today__grid">
            {todayMetrics.map((m) => (
              <div key={m.label} className="dashboard-cockpit-stat">
                <span className="dashboard-cockpit-stat__label">{m.label}</span>
                <span className="dashboard-cockpit-stat__value">{m.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-cockpit-chart">
          <div className="dashboard-cockpit-chart__head">
            <h2 className="dashboard-cockpit-section__title">{t("dashboardInsights.chartTitle")}</h2>
            <div className="dashboard-cockpit-chart__tabs" role="tablist">
              {(["7", "30", "90"] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  role="tab"
                  aria-selected={chartRange === range}
                  className={
                    chartRange === range
                      ? "dashboard-cockpit-chart__tab dashboard-cockpit-chart__tab--active"
                      : "dashboard-cockpit-chart__tab"
                  }
                  onClick={() => setChartRange(range)}
                >
                  {t(`dashboardInsights.days${range}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="dashboard-cockpit-chart__bars" aria-hidden>
            {chartBars.map((v, i) => (
              <div
                key={i}
                className="dashboard-cockpit-chart__bar"
                style={{ height: `${Math.round((v / chartMax) * 100)}%` }}
              />
            ))}
          </div>
          <div className="dashboard-cockpit-chart__legend">
            <span>{t("dashboardInsights.chartFavorites")}</span>
            <span>{t("dashboardInsights.chartViews")}</span>
            <span>{t("dashboard.listingFavorites")}</span>
          </div>
        </section>

        <div className="dashboard-cockpit-split">
          <section className="dashboard-panel dashboard-panel--compact">
            <h2 className="dashboard-panel__title">{t("dashboardInsights.activityTitle")}</h2>
            {activity.length > 0 ? (
              <ul className="dashboard-activity-list">
                {activity.map((item) => (
                  <li key={item.id} className="dashboard-activity-list__item">
                    {item.href ? (
                      <Link href={item.href} className="dashboard-activity-list__link">
                        <span>{t(item.messageKey)}</span>
                        {item.detail && (
                          <span className="dashboard-activity-list__detail">{item.detail}</span>
                        )}
                      </Link>
                    ) : (
                      <div>
                        <span>{t(item.messageKey)}</span>
                        {item.detail && (
                          <span className="dashboard-activity-list__detail">{item.detail}</span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dashboard-panel__text dashboard-panel__text--sm">
                {t("dashboardInsights.activityNoItems")}
              </p>
            )}
          </section>

          <section className="dashboard-panel dashboard-panel--compact">
            <h2 className="dashboard-panel__title">{t("dashboardInsights.insightsTitle")}</h2>
            <ul className="dashboard-insights-list">
              {listingFavorites > 0 && (
                <li>{t("dashboardInsights.insightBetterWeek")}</li>
              )}
              <li>{t("dashboardInsights.insightPeakTime")}</li>
              <li>
                {t("dashboardInsights.insightSaveRatio")}:{" "}
                {totaal > 0 ? `${Math.round((listingFavorites / Math.max(totaal, 1)) * 10) / 10}` : "—"}
              </li>
              <li>
                {t("dashboard.activeAds")}: {actief} · {t("dashboard.premiumActive")}: {premiumActief}
              </li>
            </ul>
          </section>
        </div>

        <section className="dashboard-cockpit-actions">
          <h2 className="dashboard-cockpit-section__title">{t("dashboardInsights.quickActions")}</h2>
          <div className="dashboard-primary-actions">
            <Link href="/dashboard/advertenties/nieuw" className="dashboard-btn dashboard-btn--primary">
              {t("dashboard.newAd")}
            </Link>
            <Link href="/dashboard/boosts" className="dashboard-btn dashboard-btn--secondary">
              {t("dashboard.buyBoost")}
            </Link>
            <Link href="/dashboard/advertenties" className="dashboard-btn dashboard-btn--secondary">
              {t("dashboardInsights.manageAds")}
            </Link>
            <Link href="/ai-lounge" className="dashboard-btn dashboard-btn--outline">
              {t("dashboard.aiLounge")}
            </Link>
          </div>
        </section>

        <section className="dashboard-panel dashboard-panel--secondary dashboard-cockpit-metrics">
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
          <p className="dashboard-panel__text dashboard-panel__text--sm mt-2">
            {t("dashboard.aiCredits", { count: aiCredits })}
            {premiumDagen > 0 && ` · ${t("dashboard.premiumDays")}: ${premiumDagen}`}
          </p>
        </section>
      </div>
    </div>
  );
}
