"use client";

import { ShieldCheck, Smartphone, Zap } from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";

const ITEMS = [
  { titleKey: "discovery.trustVerified", textKey: "discovery.trustVerifiedText", icon: ShieldCheck },
  { titleKey: "discovery.trustFast", textKey: "discovery.trustFastText", icon: Zap },
  { titleKey: "discovery.trustMobile", textKey: "discovery.trustMobileText", icon: Smartphone },
] as const;

export function WhyVelouraDiscovery() {
  const { t } = useTranslation();

  return (
    <section className="discovery-section discovery-section--light">
      <div className="container">
        <h2 className="font-display text-xl font-medium text-[#24191f] sm:text-2xl">
          {t("discovery.trustTitle")}
        </h2>
        <div className="discovery-trust-grid mt-5">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.titleKey} className="discovery-trust-card">
                <div className="discovery-trust-card__icon">
                  <Icon className="h-5 w-5 text-[#7b2f49]" strokeWidth={1.5} />
                </div>
                <h3 className="discovery-trust-card__title">{t(item.titleKey)}</h3>
                <p className="discovery-trust-card__text">{t(item.textKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
