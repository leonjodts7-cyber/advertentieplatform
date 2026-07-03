"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  ZOEK_SORT_OPTIES,
  type ZoekSortOption,
  parseZoekSort,
} from "@/lib/zoek-sort";

export function ZoekSortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
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
        Sorteren
      </label>
      <select
        id="zoek-sort"
        className="zoek-sort__select"
        value={current}
        onChange={handleChange}
        disabled={isPending}
      >
        {ZOEK_SORT_OPTIES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
