"use client";

import Link from "next/link";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { DashboardAdvertentieRow } from "@/components/dashboard-advertentie-row";
import { useTranslation } from "@/contexts/locale-context";
import type { Advertentie } from "@/lib/types";

interface DashboardAdvertentiesContentProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
}

export function DashboardAdvertentiesContent({
  advertenties,
  fotos,
}: DashboardAdvertentiesContentProps) {
  const { t } = useTranslation();

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header dashboard-page__header--compact">
        <div className="container">
          <DashboardSubnav />
          <div className="dashboard-page__title-row">
            <div>
              <h1 className="dashboard-page__title">{t("dashboard.myAds")}</h1>
              <p className="dashboard-page__subtitle">{t("dashboard.adsSubtitle")}</p>
            </div>
            <div className="dashboard-primary-actions dashboard-primary-actions--inline">
              <Link href="/dashboard/advertenties/nieuw" className="dashboard-btn dashboard-btn--primary dashboard-btn--sm">
                {t("dashboard.newAd")}
              </Link>
              <Link href="/dashboard/boosts" className="dashboard-btn dashboard-btn--secondary dashboard-btn--sm">
                {t("dashboard.buyBoost")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-page__body dashboard-page__body--compact">
        {advertenties.length > 0 ? (
          <div className="dashboard-ads-list">
            {advertenties.map((advertentie) => (
              <DashboardAdvertentieRow
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-state dashboard-empty-state--compact">
            <p className="dashboard-empty-state__title">{t("dashboard.noAds")}</p>
            <p className="dashboard-empty-state__text">{t("dashboard.noAdsText")}</p>
            <Link href="/dashboard/advertenties/nieuw" className="dashboard-btn dashboard-btn--primary dashboard-btn--sm">
              {t("dashboard.newAd")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
