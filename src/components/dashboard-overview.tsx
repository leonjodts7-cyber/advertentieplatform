"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { useTranslation } from "@/contexts/locale-context";
import type { ProviderAnalyticsSummary } from "@/lib/analytics/types";
import { formatPrijs } from "@/lib/helpers";

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
  initialAnalytics: ProviderAnalyticsSummary;
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
  initialAnalytics,
}: DashboardOverviewProps) {
  const { t } = useTranslation();
  const [chartRange, setChartRange] = useState<"7" | "30" | "90">("7");
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (chartRange === "7") {
      setAnalytics(initialAnalytics);
      return;
    }
    setLoadingAnalytics(true);
    void fetch(`/api/analytics/provider?days=${chartRange}`)
      .then((res) => (res.ok ? res.json() : initialAnalytics))
      .then((data: ProviderAnalyticsSummary) => setAnalytics(data))
      .catch(() => setAnalytics(initialAnalytics))
      .finally(() => setLoadingAnalytics(false));
  }, [chartRange, initialAnalytics]);

  const contacts =
    analytics.phoneClicks +
    analytics.whatsappClicks +
    analytics.websiteClicks +
    analytics.chatStarts;

  const todayMetrics = [
    { label: t("dashboardInsights.views"), value: String(analytics.profileViews) },
    { label: t("dashboardInsights.favorites"), value: analytics.favoriteAdds },
    { label: t("dashboardInsights.contacts"), value: String(contacts) },
    { label: t("dashboardInsights.chats"), value: analytics.chatStarts || (aiCredits > 0 ? "AI" : "—") },
    { label: t("dashboardInsights.appointments"), value: actief },
  ];

  const chartBars =
    analytics.dailyViews.length > 0
      ? analytics.dailyViews.map((d) => d.count)
      : [1, 1, 1, 1, 1, 1, 1];
  const chartMax = Math.max(...chartBars, 1);

  const insights: string[] = [];

  if (analytics.viewsChangePercent !== null) {
    insights.push(
      analytics.viewsChangePercent >= 0
        ? t("analytics.viewsUp", { percent: analytics.viewsChangePercent })
        : t("analytics.viewsDown", { percent: Math.abs(analytics.viewsChangePercent) })
    );
  }

  if (analytics.popularDay) {
    insights.push(
      t("analytics.popularDay", { day: t(`analytics.days.${analytics.popularDay}`) })
    );
  }

  if (analytics.popularHour !== null) {
    insights.push(t("analytics.popularHour", { hour: analytics.popularHour }));
  }

  if (analytics.contactRatio !== null) {
    insights.push(t("analytics.contactRatio", { ratio: analytics.contactRatio }));
  }

  if (analytics.saveRatio !== null) {
    insights.push(t("analytics.saveRatio", { ratio: analytics.saveRatio }));
  }

  if (analytics.topAdvertentieTitle) {
    insights.push(t("analytics.topListing", { title: analytics.topAdvertentieTitle }));
  }

  if (analytics.avgPrice !== null) {
    insights.push(t("analytics.avgPrice", { price: analytics.avgPrice }));
  }

  if (analytics.newVisitors > 0) {
    insights.push(t("analytics.newVisitors", { count: analytics.newVisitors }));
  }

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
          <div
            className="dashboard-cockpit-chart__bars"
            aria-hidden
            data-loading={loadingAnalytics || undefined}
          >
            {chartBars.map((v, i) => (
              <div
                key={i}
                className="dashboard-cockpit-chart__bar"
                style={{ height: `${Math.round((v / chartMax) * 100)}%` }}
              />
            ))}
          </div>
          <div className="dashboard-cockpit-chart__legend">
            <span>{t("dashboardInsights.chartViews")}</span>
            {analytics.avgPrice !== null && (
              <span>{formatPrijs(analytics.avgPrice)}</span>
            )}
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
              {insights.length > 0 ? (
                insights.map((line) => <li key={line}>{line}</li>)
              ) : (
                <li>{t("dashboardInsights.activityNoItems")}</li>
              )}
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
