"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/locale-context";
import { cn } from "@/lib/utils";

const QUICK_FILTERS = [
  { key: "online", params: { beschikbaar: "true" } },
  { key: "verified", params: { geverifieerd: "true" } },
  { key: "premium", params: { premium_profiel: "true" } },
  { key: "spotlight", params: { spotlight: "1" } },
  { key: "video", params: { video_mogelijk: "true" } },
  { key: "newToday", params: { nieuw_profiel: "true" } },
] as const;

export function ZoekQuickFilters() {
  const router = useRouter();
  const { t } = useTranslation();

  function apply(params: Record<string, string>) {
    const qs = new URLSearchParams(params).toString();
    router.push(`/zoeken?${qs}`);
  }

  return (
    <div className="zoek-quick-filters" role="toolbar" aria-label={t("search.quickFilters")}>
      {QUICK_FILTERS.map((filter) => (
        <button
          key={filter.key}
          type="button"
          className={cn("zoek-quick-filters__chip")}
          onClick={() => apply(filter.params)}
        >
          {t(`search.quick.${filter.key}`)}
        </button>
      ))}
    </div>
  );
}
