"use client";

import Link from "next/link";
import { DashboardSubnav } from "@/components/dashboard-subnav";
import { UitloggenKnop } from "@/components/uitloggen-knop";
import { useTranslation } from "@/contexts/locale-context";

interface DashboardSettingsContentProps {
  email: string;
  emailConfirmed: boolean;
}

export function DashboardSettingsContent({
  email,
  emailConfirmed,
}: DashboardSettingsContentProps) {
  const { t } = useTranslation();

  return (
    <div className="dashboard-page">
      <div className="dashboard-page__header">
        <div className="container">
          <DashboardSubnav />
          <h1 className="dashboard-page__title">{t("settings.title")}</h1>
          <p className="dashboard-page__subtitle">{t("settings.subtitle")}</p>
        </div>
      </div>

      <div className="container dashboard-page__body">
        <div className="dashboard-settings-stack">
          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">{t("settings.account")}</h2>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">{t("settings.email")}</span>
              <span className="dashboard-settings-row__value">{email}</span>
            </div>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">{t("settings.status")}</span>
              <span className="dashboard-settings-badge">
                {emailConfirmed ? t("settings.statusActive") : t("settings.statusPending")}
              </span>
            </div>
          </section>

          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">{t("settings.preferences")}</h2>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">{t("settings.defaultCity")}</span>
              <span className="dashboard-settings-row__placeholder">{t("settings.notSet")}</span>
            </div>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">{t("settings.defaultLanguage")}</span>
              <span className="dashboard-settings-row__value">{t("settings.dutch")}</span>
            </div>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">{t("settings.notifications")}</span>
              <span className="dashboard-settings-row__placeholder">{t("settings.soon")}</span>
            </div>
          </section>

          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">{t("settings.security")}</h2>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">{t("settings.changePassword")}</span>
              <span className="dashboard-settings-row__placeholder">{t("settings.soon")}</span>
            </div>
            <div className="dashboard-settings-logout">
              <UitloggenKnop />
            </div>
          </section>

          <section className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">{t("settings.publication")}</h2>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">{t("settings.defaultStatus")}</span>
              <span className="dashboard-settings-row__value">{t("settings.publishDefault")}</span>
            </div>
            <p className="dashboard-settings-note">{t("settings.draftNote")}</p>
            <div className="dashboard-settings-row">
              <span className="dashboard-settings-row__label">{t("settings.verification")}</span>
              <span className="dashboard-settings-row__placeholder">{t("settings.soon")}</span>
            </div>
          </section>

          <div className="dashboard-quick-actions dashboard-quick-actions--footer">
            <Link href="/dashboard" className="dashboard-btn dashboard-btn--secondary">
              {t("settings.backToOverview")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
