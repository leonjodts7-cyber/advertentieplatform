"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryChip } from "@/components/ui/category-chip";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { Sparkles, X } from "lucide-react";

const CATEGORIE_LABELS = Object.fromEntries(
  MARKETPLACE_CATEGORIEEN.map((c) => [c.slug, c.label])
);

const AI_VOORBEELDEN = [
  "Escort in Antwerpen",
  "Massage in Brussel",
  "Video afspraak",
];

function buildFilterParams(values: {
  q: string;
  stad: string;
  categorie: string | null;
  leeftijdVan: string;
  leeftijdTot: string;
  prijsMin: string;
  prijsMax: string;
  geverifieerd: boolean;
}) {
  const params = new URLSearchParams();
  if (values.q.trim()) params.set("q", values.q.trim());
  if (values.stad.trim()) params.set("stad", values.stad.trim());
  if (values.categorie) params.set("categorie", values.categorie);
  if (values.leeftijdVan.trim()) params.set("leeftijd_van", values.leeftijdVan.trim());
  if (values.leeftijdTot.trim()) params.set("leeftijd_tot", values.leeftijdTot.trim());
  if (values.prijsMin.trim()) params.set("prijs_min", values.prijsMin.trim());
  if (values.prijsMax.trim()) params.set("prijs_max", values.prijsMax.trim());
  if (values.geverifieerd) params.set("geverifieerd", "true");
  return params;
}

function ActiveFilterChips({
  searchParams,
  onRemove,
}: {
  searchParams: URLSearchParams;
  onRemove: (key: string) => void;
}) {
  const chips = useMemo(() => {
    const list: { key: string; label: string }[] = [];
    const q = searchParams.get("q");
    const stad = searchParams.get("stad");
    const categorie = searchParams.get("categorie");
    const leeftijdVan = searchParams.get("leeftijd_van");
    const leeftijdTot = searchParams.get("leeftijd_tot");
    const prijsMin = searchParams.get("prijs_min");
    const prijsMax = searchParams.get("prijs_max");
    const geverifieerd = searchParams.get("geverifieerd");

    if (q) list.push({ key: "q", label: `Zoek: ${q}` });
    if (stad) list.push({ key: "stad", label: `Stad: ${stad}` });
    if (categorie) {
      list.push({
        key: "categorie",
        label: `Categorie: ${CATEGORIE_LABELS[categorie] ?? categorie}`,
      });
    }
    if (leeftijdVan || leeftijdTot) {
      list.push({
        key: "leeftijd",
        label: `Leeftijd: ${leeftijdVan || "18"}–${leeftijdTot || "65+"}`,
      });
    }
    if (prijsMin || prijsMax) {
      list.push({
        key: "prijs",
        label: `Prijs: €${prijsMin || "0"}–€${prijsMax || "∞"}`,
      });
    }
    if (geverifieerd === "true" || geverifieerd === "1") {
      list.push({ key: "geverifieerd", label: "Geverifieerd" });
    }
    return list;
  }, [searchParams]);

  if (chips.length === 0) return null;

  return (
    <div className="active-filters">
      <p className="active-filters__label">Actieve filters</p>
      <div className="active-filters__list">
        {chips.map((chip) => (
          <button
            key={chip.key + chip.label}
            type="button"
            className="active-filter-chip"
            onClick={() => onRemove(chip.key)}
          >
            {chip.label}
            <X className="h-3 w-3 opacity-70" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ZoekFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isAiMode = searchParams.get("ai") === "1";
  const [tab, setTab] = useState<"filters" | "ai">(isAiMode ? "ai" : "filters");

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [stad, setStad] = useState(searchParams.get("stad") ?? "");
  const [categorie, setCategorie] = useState<string | null>(
    searchParams.get("categorie")
  );
  const [leeftijdVan, setLeeftijdVan] = useState(
    searchParams.get("leeftijd_van") ?? ""
  );
  const [leeftijdTot, setLeeftijdTot] = useState(
    searchParams.get("leeftijd_tot") ?? ""
  );
  const [prijsMin, setPrijsMin] = useState(searchParams.get("prijs_min") ?? "");
  const [prijsMax, setPrijsMax] = useState(searchParams.get("prijs_max") ?? "");
  const [geverifieerd, setGeverifieerd] = useState(
    searchParams.get("geverifieerd") === "true" ||
      searchParams.get("geverifieerd") === "1"
  );
  const [aiQuery, setAiQuery] = useState(
    isAiMode ? searchParams.get("q") ?? "" : ""
  );

  useEffect(() => {
    setTab(isAiMode ? "ai" : "filters");
    if (isAiMode) setAiQuery(searchParams.get("q") ?? "");
  }, [isAiMode, searchParams]);

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/zoeken?${qs}` : "/zoeken");
    });
  }

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(
      buildFilterParams({
        q,
        stad,
        categorie,
        leeftijdVan,
        leeftijdTot,
        prijsMin,
        prijsMax,
        geverifieerd,
      })
    );
  }

  function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = aiQuery.trim();
    if (!trimmed) {
      navigate(new URLSearchParams());
      return;
    }
    const params = new URLSearchParams({ q: trimmed, ai: "1" });
    navigate(params);
  }

  function handleClear() {
    setQ("");
    setStad("");
    setCategorie(null);
    setLeeftijdVan("");
    setLeeftijdTot("");
    setPrijsMin("");
    setPrijsMax("");
    setGeverifieerd(false);
    setAiQuery("");
    setTab("filters");
    navigate(new URLSearchParams());
  }

  function removeParam(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("ai");

    if (key === "leeftijd") {
      params.delete("leeftijd_van");
      params.delete("leeftijd_tot");
      setLeeftijdVan("");
      setLeeftijdTot("");
    } else if (key === "prijs") {
      params.delete("prijs_min");
      params.delete("prijs_max");
      setPrijsMin("");
      setPrijsMax("");
    } else {
      params.delete(key);
      if (key === "q") {
        setQ("");
        setAiQuery("");
      }
      if (key === "stad") setStad("");
      if (key === "categorie") setCategorie(null);
      if (key === "geverifieerd") setGeverifieerd(false);
    }

    navigate(params);
  }

  return (
    <div className="search-section">
      <div className="filter-panel filter-panel-premium">
        <div className="search-tabs search-tabs--light" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "filters"}
            onClick={() => setTab("filters")}
            className={cn(
              "search-tabs__btn search-tabs__btn--light",
              tab === "filters" && "search-tabs__btn--light-active"
            )}
          >
            Filters
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "ai"}
            onClick={() => setTab("ai")}
            className={cn(
              "search-tabs__btn search-tabs__btn--light",
              tab === "ai" && "search-tabs__btn--light-active"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI zoeken
          </button>
        </div>

        {tab === "filters" ? (
          <form onSubmit={handleFilterSubmit} className="filter-grid mt-4" role="tabpanel">
            <div className="filter-grid__full">
              <label htmlFor="zoek-q" className="filter-label">
                Zoeken
              </label>
              <Input
                id="zoek-q"
                variant="light"
                placeholder="Zoek op stad, naam of trefwoord…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="filter-grid__full">
              <label htmlFor="zoek-stad" className="filter-label">
                Stad / regio
              </label>
              <Input
                id="zoek-stad"
                variant="light"
                placeholder="Bijv. Antwerpen"
                value={stad}
                onChange={(e) => setStad(e.target.value)}
              />
            </div>

            <div className="filter-grid__full">
              <p className="filter-label">Categorie</p>
              <div className="category-chip-scroll no-scrollbar">
                {MARKETPLACE_CATEGORIEEN.map((cat) => (
                  <CategoryChip
                    key={cat.slug}
                    label={cat.label}
                    active={categorie === cat.slug}
                    onClick={() =>
                      setCategorie(categorie === cat.slug ? null : cat.slug)
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="leeftijd-van" className="filter-label">
                Leeftijd vanaf
              </label>
              <Input
                id="leeftijd-van"
                variant="light"
                type="number"
                min={18}
                placeholder="18"
                value={leeftijdVan}
                onChange={(e) => setLeeftijdVan(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="leeftijd-tot" className="filter-label">
                Leeftijd tot
              </label>
              <Input
                id="leeftijd-tot"
                variant="light"
                type="text"
                placeholder="65+"
                value={leeftijdTot}
                onChange={(e) => setLeeftijdTot(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="prijs-min" className="filter-label">
                Min €
              </label>
              <Input
                id="prijs-min"
                variant="light"
                type="number"
                min={0}
                placeholder="0"
                value={prijsMin}
                onChange={(e) => setPrijsMin(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="prijs-max" className="filter-label">
                Max €
              </label>
              <Input
                id="prijs-max"
                variant="light"
                type="number"
                min={0}
                placeholder="500"
                value={prijsMax}
                onChange={(e) => setPrijsMax(e.target.value)}
              />
            </div>

            <div className="filter-grid__full">
              <ToggleSwitch
                id="geverifieerd-toggle"
                label="Alleen geverifieerd"
                checked={geverifieerd}
                onChange={setGeverifieerd}
              />
            </div>

            <div className="filter-grid__full filter-actions filter-actions--inline">
              <Button type="submit" size="md" disabled={isPending} className="w-full sm:w-auto">
                Toon profielen
              </Button>
              <Button
                type="button"
                variant="secondary-light"
                size="md"
                onClick={handleClear}
                className="w-full sm:w-auto"
              >
                Filters wissen
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAiSubmit} className="mt-4 space-y-4" role="tabpanel">
            <div>
              <label htmlFor="zoek-ai" className="filter-label">
                Beschrijf wat je zoekt…
              </label>
              <Textarea
                id="zoek-ai"
                variant="light"
                placeholder="Beschrijf wat je zoekt…"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="min-h-[100px]"
              />
              <ul className="ai-examples mt-2 space-y-1">
                {AI_VOORBEELDEN.map((ex) => (
                  <li key={ex}>
                    <button
                      type="button"
                      className="ai-examples__item"
                      onClick={() => setAiQuery(ex)}
                    >
                      {ex}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="filter-actions filter-actions--inline">
              <Button type="submit" size="md" className="w-full gap-2 sm:w-auto">
                <Sparkles className="h-4 w-4" />
                Zoeken met AI
              </Button>
              <Button
                type="button"
                variant="secondary-light"
                size="md"
                onClick={handleClear}
                className="w-full sm:w-auto"
              >
                Filters wissen
              </Button>
            </div>
          </form>
        )}
      </div>

      <ActiveFilterChips searchParams={searchParams} onRemove={removeParam} />
    </div>
  );
}
