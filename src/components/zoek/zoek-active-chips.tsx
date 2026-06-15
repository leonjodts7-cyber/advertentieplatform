"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { AFSTAND_OPTIES } from "@/lib/marketplace";
import {
  CATEGORIE_LABELS,
  HAARKLEUR_OPTIES,
  labelFromOptions,
  TAAL_OPTIES,
} from "@/lib/zoek-filters";
import { Check, X } from "lucide-react";

function boolFromParam(value: string | null) {
  return value === "true" || value === "1";
}

const MOGELIJKHEID_LABELS: Record<string, string> = {
  thuis_ontvangen: "Thuis ontvangen",
  hotel_mogelijk: "Hotel mogelijk",
  video_mogelijk: "Video mogelijk",
};

export function ZoekActiveChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const chips = useMemo(() => {
    const list: { key: string; label: string }[] = [];
    const q = searchParams.get("q");
    const stad = searchParams.get("stad");
    const afstand = searchParams.get("afstand");
    const categorie = searchParams.get("categorie");

    if (q && searchParams.get("ai") !== "1") list.push({ key: "q", label: `Zoek: ${q}` });
    if (stad) list.push({ key: "stad", label: stad });
    if (afstand) list.push({ key: "afstand", label: labelFromOptions(afstand, AFSTAND_OPTIES) });
    if (categorie) list.push({ key: "categorie", label: CATEGORIE_LABELS[categorie] ?? categorie });

    if (searchParams.get("leeftijd_van") || searchParams.get("leeftijd_tot")) {
      list.push({ key: "leeftijd", label: `Leeftijd ${searchParams.get("leeftijd_van") || "18"}–${searchParams.get("leeftijd_tot") || "65+"}` });
    }
    if (searchParams.get("prijs_min") || searchParams.get("prijs_max")) {
      list.push({ key: "prijs", label: `€${searchParams.get("prijs_min") || "0"}–€${searchParams.get("prijs_max") || "∞"}` });
    }
    if (searchParams.get("lengte_van") || searchParams.get("lengte_tot")) {
      list.push({ key: "lengte", label: `Lengte ${searchParams.get("lengte_van") || "?"}–${searchParams.get("lengte_tot") || "?"} cm` });
    }

    const haarkleur = searchParams.get("haarkleur");
    const taal = searchParams.get("taal");
    if (haarkleur) list.push({ key: "haarkleur", label: labelFromOptions(haarkleur, HAARKLEUR_OPTIES) });
    if (taal) list.push({ key: "taal", label: labelFromOptions(taal, TAAL_OPTIES) });

    for (const key of ["thuis_ontvangen", "hotel_mogelijk", "video_mogelijk"] as const) {
      if (boolFromParam(searchParams.get(key))) {
        list.push({ key, label: MOGELIJKHEID_LABELS[key] });
      }
    }
    if (boolFromParam(searchParams.get("geverifieerd"))) {
      list.push({ key: "geverifieerd", label: "Geverifieerd" });
    }

    return list;
  }, [searchParams]);

  if (chips.length === 0) return null;

  function removeParam(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("ai");
    if (key === "leeftijd") {
      params.delete("leeftijd_van");
      params.delete("leeftijd_tot");
    } else if (key === "prijs") {
      params.delete("prijs_min");
      params.delete("prijs_max");
    } else if (key === "lengte") {
      params.delete("lengte_van");
      params.delete("lengte_tot");
    } else {
      params.delete(key);
    }
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/zoeken?${qs}` : "/zoeken");
    });
  }

  return (
    <div className="active-filters active-filters--inline">
      <div className="active-filters__list">
        {chips.map((chip) => (
          <button
            key={chip.key + chip.label}
            type="button"
            className="active-filter-chip"
            onClick={() => removeParam(chip.key)}
          >
            <Check className="active-filter-chip__icon h-3 w-3" aria-hidden />
            {chip.label}
            <X className="h-3 w-3 opacity-80" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}
