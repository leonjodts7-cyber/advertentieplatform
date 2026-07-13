"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/contexts/locale-context";
import {
  buildSearchLabel,
  getSavedSearches,
  removeSavedSearch,
  saveSearch,
  type SavedSearch,
} from "@/lib/saved-searches";

export function ZoekSavedSearches() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [saved, setSaved] = useState<SavedSearch[]>([]);

  useEffect(() => {
    setSaved(getSavedSearches());
  }, []);

  function handleSave() {
    const qs = searchParams.toString();
    if (!qs) return;
    const label = buildSearchLabel(searchParams, t("search.savedDefault"));
    setSaved(saveSearch(label, `/zoeken?${qs}`));
  }

  function handleRemove(id: string) {
    setSaved(removeSavedSearch(id));
  }

  const hasActiveFilters = Array.from(searchParams.keys()).some((k) => k !== "ai");

  return (
    <div className="zoek-saved-searches">
      {hasActiveFilters && (
        <button type="button" className="zoek-saved-searches__save" onClick={handleSave}>
          <Bookmark className="h-3.5 w-3.5" aria-hidden />
          {t("search.saveSearch")}
        </button>
      )}
      {saved.length > 0 && (
        <div className="zoek-saved-searches__list">
          <span className="zoek-saved-searches__label">{t("search.savedSearches")}</span>
          {saved.map((item) => (
            <span key={item.id} className="zoek-saved-searches__item">
              <Link href={item.href} className="zoek-saved-searches__link">
                {item.label}
              </Link>
              <button
                type="button"
                className="zoek-saved-searches__remove"
                onClick={() => handleRemove(item.id)}
                aria-label={t("search.removeSaved")}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
