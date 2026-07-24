"use client";

import Link from "next/link";
import { AiCompanionCard } from "@/components/ai/ai-companion-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/locale-context";
import { CREDITS_PER_BERICHT, type AiCompanion } from "@/lib/ai-companions";
import type { RecentAiChat } from "@/lib/ai/queries";
import { MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface AiLoungeContentProps {
  companions: AiCompanion[];
}

interface AiLoungeSession {
  ingelogd: boolean;
  creditsSaldo: number;
  recentChats: RecentAiChat[];
}

const FEATURED_IDS = ["valentina", "mila", "sophia"];
const NEW_IDS = ["scarlett", "victoria"];
const POPULAR_IDS = ["valentina", "isabella", "mila", "sophia"];

function pickCompanions(all: AiCompanion[], ids: string[]): AiCompanion[] {
  const byId = new Map(all.map((c) => [c.id, c]));
  return ids.map((id) => byId.get(id)).filter((c): c is AiCompanion => c != null);
}

export function AiLoungeContent({ companions }: AiLoungeContentProps) {
  const { t } = useTranslation();
  const [session, setSession] = useState<AiLoungeSession>({
    ingelogd: false,
    creditsSaldo: 0,
    recentChats: [],
  });

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/ai-lounge/session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AiLoungeSession | null) => {
        if (!cancelled && data) setSession(data);
      })
      .catch(() => {
        /* silent */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { ingelogd, creditsSaldo, recentChats } = session;

  const featured = pickCompanions(companions, FEATURED_IDS);
  const popular = pickCompanions(companions, POPULAR_IDS);
  const newest = pickCompanions(companions, NEW_IDS);
  const rest = companions.filter(
    (c) => !FEATURED_IDS.includes(c.id) && !POPULAR_IDS.includes(c.id) && !NEW_IDS.includes(c.id)
  );

  const personalityCategories = [
    { key: "romantic", filter: (c: AiCompanion) => c.traits.some((t) => /romant|lief|zacht/i.test(t)) },
    { key: "playful", filter: (c: AiCompanion) => c.traits.some((t) => /flirt|speels|spont/i.test(t)) },
    { key: "mysterious", filter: (c: AiCompanion) => c.traits.some((t) => /myst|intens|dominant/i.test(t)) },
  ] as const;

  return (
    <div className="ai-lounge-page ai-lounge-page--premium">
      <section className="ai-lounge-hero ai-lounge-hero--premium">
        <div className="container">
          <p className="ai-lounge-hero__eyebrow">{t("aiLounge.eyebrow")}</p>
          <h1 className="ai-lounge-hero__title">{t("aiLounge.title")}</h1>
          <p className="ai-lounge-hero__subtitle">{t("aiLounge.subtitle")}</p>
          <div className="ai-lounge-meta">
            <span>{t("aiLounge.companions", { count: companions.length })}</span>
            <span>{t("aiLounge.creditsPerMsg", { count: CREDITS_PER_BERICHT })}</span>
            <span>{t("aiLounge.fictional")}</span>
          </div>

          {ingelogd && (
            <div className="ai-lounge-credits-bar">
              <Sparkles className="h-4 w-4 text-[#d6b36b]" aria-hidden />
              <span>{t("aiLounge.balance", { count: creditsSaldo })}</span>
              <Button asChild size="sm" variant="outline">
                <Link href="/credits">{t("aiLounge.buyCredits")}</Link>
              </Button>
            </div>
          )}

          <div className="ai-lounge-hero__actions">
            {ingelogd ? (
              <Button asChild size="md">
                <Link href="#companions">{t("aiLounge.startChat")}</Link>
              </Button>
            ) : (
              <Button asChild size="md">
                <Link href="/login?redirect=/ai-lounge">{t("aiLounge.loginChat")}</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container ai-lounge-body">
        {ingelogd && recentChats.length > 0 && (
          <section className="ai-lounge-section">
            <h2 className="ai-lounge-section__title">{t("aiLounge.continueTitle")}</h2>
            <div className="ai-lounge-continue-grid">
              {recentChats.map((chat) => (
                <Link
                  key={chat.personageId}
                  href={`/ai/${chat.personageSlug || chat.personageId}`}
                  className="ai-lounge-continue-card"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  <span className="ai-lounge-continue-card__name">{chat.personageNaam}</span>
                  <span className="ai-lounge-continue-card__cta">{t("aiLounge.continueChat")}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="ai-lounge-section">
          <h2 className="ai-lounge-section__title">{t("aiLounge.featuredTitle")}</h2>
          <p className="ai-lounge-section__subtitle">{t("aiLounge.featuredSubtitle")}</p>
          <div className="ai-lounge-grid ai-lounge-grid--featured">
            {featured.map((companion) => (
              <AiCompanionCard
                key={companion.id}
                companion={companion}
                ingelogd={ingelogd}
                creditsSaldo={creditsSaldo}
                featured
              />
            ))}
          </div>
        </section>

        <section className="ai-lounge-section">
          <h2 className="ai-lounge-section__title">{t("aiLounge.popularTitle")}</h2>
          <div className="ai-lounge-grid ai-lounge-grid--compact">
            {popular.map((companion) => (
              <AiCompanionCard
                key={companion.id}
                companion={companion}
                ingelogd={ingelogd}
                creditsSaldo={creditsSaldo}
              />
            ))}
          </div>
        </section>

        {newest.length > 0 && (
          <section className="ai-lounge-section">
            <h2 className="ai-lounge-section__title">{t("aiLounge.newTitle")}</h2>
            <div className="ai-lounge-grid ai-lounge-grid--compact">
              {newest.map((companion) => (
                <AiCompanionCard
                  key={companion.id}
                  companion={companion}
                  ingelogd={ingelogd}
                  creditsSaldo={creditsSaldo}
                />
              ))}
            </div>
          </section>
        )}

        <section className="ai-lounge-section" id="companions">
          <h2 className="ai-lounge-section__title">{t("aiLounge.allTitle")}</h2>
          <div className="ai-lounge-personality-chips">
            {personalityCategories.map((cat) => (
              <span key={cat.key} className="ai-lounge-personality-chip">
                {t(`aiLounge.personality.${cat.key}`)}
              </span>
            ))}
          </div>
          <div className="ai-lounge-grid ai-lounge-grid--compact">
            {[...newest, ...rest].map((companion) => (
              <AiCompanionCard
                key={companion.id}
                companion={companion}
                ingelogd={ingelogd}
                creditsSaldo={creditsSaldo}
              />
            ))}
          </div>
        </section>

        <p className="ai-lounge-compliance">{t("aiLounge.compliance")}</p>
      </div>
    </div>
  );
}
