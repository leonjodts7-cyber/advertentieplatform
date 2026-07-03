"use client";

import Link from "next/link";
import { AiCompanionCard } from "@/components/ai/ai-companion-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/locale-context";
import { CREDITS_PER_BERICHT, type AiCompanion } from "@/lib/ai-companions";

interface AiLoungeContentProps {
  companions: AiCompanion[];
  ingelogd: boolean;
  creditsSaldo: number;
}

export function AiLoungeContent({
  companions,
  ingelogd,
  creditsSaldo,
}: AiLoungeContentProps) {
  const { t } = useTranslation();

  return (
    <div className="ai-lounge-page ai-lounge-page--polished">
      <section className="ai-lounge-hero ai-lounge-hero--compact">
        <div className="container">
          <p className="ai-lounge-hero__eyebrow">{t("aiLounge.eyebrow")}</p>
          <h1 className="ai-lounge-hero__title">{t("aiLounge.title")}</h1>
          <p className="ai-lounge-hero__subtitle">{t("aiLounge.subtitle")}</p>
          <div className="ai-lounge-meta">
            <span>{t("aiLounge.companions", { count: companions.length })}</span>
            <span>{t("aiLounge.creditsPerMsg", { count: CREDITS_PER_BERICHT })}</span>
            <span>{t("aiLounge.fictional")}</span>
          </div>
          <p className="ai-lounge-compliance">{t("aiLounge.compliance")}</p>

          {ingelogd && (
            <p className="ai-lounge-hero__credits ai-lounge-hero__credits--prominent">
              {t("aiLounge.balance", { count: creditsSaldo })}
            </p>
          )}

          <div className="ai-lounge-hero__actions">
            {ingelogd ? (
              <>
                <Button asChild size="sm">
                  <Link href="/ai-lounge">{t("aiLounge.startChat")}</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/credits">{t("aiLounge.buyCredits")}</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="sm">
                  <Link href="/login?redirect=/ai-lounge">{t("aiLounge.loginChat")}</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/login?redirect=/credits">{t("aiLounge.prices")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="container ai-lounge-body">
        <div className="ai-lounge-grid ai-lounge-grid--compact">
          {companions.map((companion) => (
            <AiCompanionCard
              key={companion.id}
              companion={companion}
              ingelogd={ingelogd}
              creditsSaldo={creditsSaldo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
