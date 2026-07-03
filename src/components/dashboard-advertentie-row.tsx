"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/contexts/locale-context";
import { formatPrijs, statusLabel } from "@/lib/helpers";
import {
  boostActief,
  isPremiumListing,
} from "@/lib/advertentie-boost";
import { parseAdvertentieBeschrijving } from "@/lib/advertentie-metadata";
import type { Advertentie } from "@/lib/types";

interface DashboardAdvertentieRowProps {
  advertentie: Advertentie;
  afbeeldingUrl?: string | null;
}

function statusVariant(
  status: Advertentie["status"]
): "green" | "new" | "muted" {
  switch (status) {
    case "actief":
      return "green";
    case "in_review":
      return "new";
    default:
      return "muted";
  }
}

export function DashboardAdvertentieRow({
  advertentie,
  afbeeldingUrl,
}: DashboardAdvertentieRowProps) {
  const { t } = useTranslation();
  const { meta } = parseAdvertentieBeschrijving(advertentie.beschrijving);
  const isPremium = isPremiumListing(advertentie) || boostActief(meta);
  const isConcept = advertentie.status === "concept";
  const bewerkUrl = `/dashboard/advertenties/${advertentie.id}/bewerken`;

  return (
    <article className="dashboard-ad-row">
      <Link href={bewerkUrl} className="dashboard-ad-row__thumb">
        {afbeeldingUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={afbeeldingUrl} alt={advertentie.titel} />
        ) : (
          <span className="dashboard-ad-row__placeholder">Profiel</span>
        )}
      </Link>

      <div className="dashboard-ad-row__body">
        <div className="dashboard-ad-row__badges">
          <Badge variant={statusVariant(advertentie.status)} className="text-[0.5625rem]">
            {statusLabel(advertentie.status)}
          </Badge>
          {isPremium && (
            <Badge variant="premium" className="text-[0.5625rem]">
              Premium
            </Badge>
          )}
        </div>
        <h3 className="dashboard-ad-row__title">
          <Link href={bewerkUrl}>{advertentie.titel}</Link>
        </h3>
        <p className="dashboard-ad-row__meta">
          {advertentie.stad}
          {advertentie.prijs_vanaf != null && (
            <> · {formatPrijs(advertentie.prijs_vanaf)}</>
          )}
        </p>
      </div>

      <div className="dashboard-ad-row__actions">
        {advertentie.status === "actief" && (
          <Link href={`/advertentie/${advertentie.id}`} className="dashboard-btn dashboard-btn--outline dashboard-btn--sm">
            {t("dashboard.view")}
          </Link>
        )}
        <Link href={bewerkUrl} className="dashboard-btn dashboard-btn--secondary dashboard-btn--sm">
          {t("dashboard.edit")}
        </Link>
        {isConcept && (
          <Link href={`${bewerkUrl}?stap=publiceren`} className="dashboard-btn dashboard-btn--primary dashboard-btn--sm">
            {t("dashboard.publish")}
          </Link>
        )}
        <Link href={`${bewerkUrl}?stap=promotie`} className="dashboard-btn dashboard-btn--outline dashboard-btn--sm">
          {t("dashboard.boostShort")}
        </Link>
      </div>
    </article>
  );
}
