"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslation } from "@/contexts/locale-context";
import {
  type ZoekSortOption,
  parseZoekSort,
} from "@/lib/zoek-sort";

const SORT_KEYS: { value: ZoekSortOption; key: string }[] = [
  { value: "aanbevolen", key: "search.sortRecommended" },
  { value: "nieuwste", key: "search.sortNewest" },
  { value: "premium", key: "search.sortPremium" },
  { value: "prijs_laag", key: "search.sortPriceLow" },
  { value: "prijs_hoog", key: "search.sortPriceHigh" },
];

export function ZoekSortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();
  const current = parseZoekSort(searchParams.get("sort"));

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sort = e.target.value as ZoekSortOption;
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "aanbevolen") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/zoeken?${qs}` : "/zoeken");
    });
  }

  return (
    <div className="zoek-sort">
      <label htmlFor="zoek-sort" className="zoek-sort__label">
        {t("search.sort")}
      </label>
      <select
        id="zoek-sort"
        className="zoek-sort__select"
        value={current}
        onChange={handleChange}
        disabled={isPending}
      >
        {SORT_KEYS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t(opt.key)}
          </option>
        ))}
      </select>
    </div>
  );
}
