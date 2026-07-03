"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";

export function HomeProviderCta() {
  const { t } = useTranslation();

  return (
    <section className="home-provider-cta home-provider-cta--pro">
      <div className="container">
        <div className="home-provider-cta__card">
          <div className="home-provider-cta__content">
            <p className="home-provider-cta__eyebrow">{t("home.providerEyebrow")}</p>
            <h2 className="home-provider-cta__title">{t("home.providerTitle")}</h2>
            <p className="home-provider-cta__desc">{t("home.providerDesc")}</p>
          </div>
          <div className="home-provider-cta__actions">
            <Link
              href="/login?redirect=%2Fdashboard%2Fadvertenties%2Fnieuw"
              className="home-provider-cta__btn home-provider-cta__btn--primary"
            >
              {t("home.providerCta")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/dashboard/boosts"
              className="home-provider-cta__btn home-provider-cta__btn--secondary"
            >
              {t("home.providerBoost")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
