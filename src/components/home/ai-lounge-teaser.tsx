"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useTranslation } from "@/contexts/locale-context";

export function AiLoungeTeaser() {
  const { t } = useTranslation();

  return (
    <section className="discovery-section discovery-teaser">
      <div className="container">
        <div className="discovery-teaser__card">
          <div className="discovery-teaser__icon">
            <Sparkles className="h-5 w-5 text-[#d6b36b]" strokeWidth={1.5} />
          </div>
          <div className="discovery-teaser__content">
            <h2 className="font-display text-lg font-medium text-[#fff6ef] sm:text-xl">
              {t("discovery.aiLoungeTitle")}
            </h2>
            <p className="mt-1 text-sm text-[#c2b4ab]">{t("discovery.aiLoungeSubtitle")}</p>
          </div>
          <Button asChild variant="secondary" size="md" className="shrink-0">
            <Link href="/ai-lounge">{t("discovery.aiLoungeCta")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
