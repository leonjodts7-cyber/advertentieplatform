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
import { Check, ChevronDown, Sparkles, X } from "lucide-react";

const CATEGORIE_LABELS = Object.fromEntries(
  MARKETPLACE_CATEGORIEEN.map((c) => [c.slug, c.label])
);

const TYPE_AFSPRAAK = [
  { slug: "prive-ontvangst", label: "Privé ontvangst" },
  { slug: "escort", label: "Escort" },
  { slug: "massage", label: "Massage" },
  { slug: "video", label: "Video" },
  { slug: "hotel", label: "Hotel" },
  { slug: "club", label: "Club" },
] as const;

const AFSTAND_OPTIES = [
  { value: "", label: "Alle afstanden" },
  { value: "5", label: "Binnen 5 km" },
  { value: "10", label: "Binnen 10 km" },
  { value: "25", label: "Binnen 25 km" },
  { value: "50", label: "Binnen 50 km" },
  { value: "100", label: "Binnen 100 km" },
];

const HAARKLEUR_OPTIES = [
  { value: "", label: "Alle haarkleuren" },
  { value: "blond", label: "Blond" },
  { value: "bruin", label: "Bruin" },
  { value: "zwart", label: "Zwart" },
  { value: "rood", label: "Rood" },
  { value: "grijs", label: "Grijs" },
  { value: "anders", label: "Anders" },
];

const TAAL_OPTIES = [
  { value: "", label: "Alle talen" },
  { value: "nl", label: "Nederlands" },
  { value: "fr", label: "Frans" },
  { value: "en", label: "Engels" },
  { value: "de", label: "Duits" },
  { value: "es", label: "Spaans" },
];

const MOGELIJKHEDEN_OPTIES = [
  { value: "", label: "Alle mogelijkheden" },
  { value: "outcall", label: "Outcall" },
  { value: "incall", label: "Incall" },
  { value: "overnight", label: "Overnight" },
  { value: "dinner", label: "Dinner date" },
  { value: "travel", label: "Reisgezelschap" },
];

const AI_VOORBEELDEN = [
  "Escort Antwerpen",
  "Massage Brussel",
  "Video afspraak",
];

export type FilterValues = {
  q: string;
  stad: string;
  afstand: string;
  categorie: string | null;
  typeAfspraak: string | null;
  leeftijdVan: string;
  leeftijdTot: string;
  prijsMin: string;
  prijsMax: string;
  lengteVan: string;
  lengteTot: string;
  haarkleur: string;
  taal: string;
  mogelijkheden: string;
  geverifieerd: boolean;
};

export function buildFilterParams(values: FilterValues) {
  const params = new URLSearchParams();
  if (values.q.trim()) params.set("q", values.q.trim());
  if (values.stad.trim()) params.set("stad", values.stad.trim());
  if (values.afstand) params.set("afstand", values.afstand);
  if (values.categorie) params.set("categorie", values.categorie);
  if (values.typeAfspraak) params.set("type_afspraak", values.typeAfspraak);
  if (values.leeftijdVan.trim()) params.set("leeftijd_van", values.leeftijdVan.trim());
  if (values.leeftijdTot.trim()) params.set("leeftijd_tot", values.leeftijdTot.trim());
  if (values.prijsMin.trim()) params.set("prijs_min", values.prijsMin.trim());
  if (values.prijsMax.trim()) params.set("prijs_max", values.prijsMax.trim());
  if (values.lengteVan.trim()) params.set("lengte_van", values.lengteVan.trim());
  if (values.lengteTot.trim()) params.set("lengte_tot", values.lengteTot.trim());
  if (values.haarkleur) params.set("haarkleur", values.haarkleur);
  if (values.taal) params.set("taal", values.taal);
  if (values.mogelijkheden) params.set("mogelijkheden", values.mogelijkheden);
  if (values.geverifieerd) params.set("geverifieerd", "true");
  return params;
}

function labelFromOptions(
  value: string,
  options: { value: string; label: string }[]
) {
  return options.find((o) => o.value === value)?.label ?? value;
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
    const afstand = searchParams.get("afstand");
    const categorie = searchParams.get("categorie");
    const typeAfspraak = searchParams.get("type_afspraak");
    const leeftijdVan = searchParams.get("leeftijd_van");
    const leeftijdTot = searchParams.get("leeftijd_tot");
    const prijsMin = searchParams.get("prijs_min");
    const prijsMax = searchParams.get("prijs_max");
    const lengteVan = searchParams.get("lengte_van");
    const lengteTot = searchParams.get("lengte_tot");
    const haarkleur = searchParams.get("haarkleur");
    const taal = searchParams.get("taal");
    const mogelijkheden = searchParams.get("mogelijkheden");
    const geverifieerd = searchParams.get("geverifieerd");

    if (q) list.push({ key: "q", label: `Zoek: ${q}` });
    if (stad) list.push({ key: "stad", label: `Stad: ${stad}` });
    if (afstand) {
      list.push({
        key: "afstand",
        label: labelFromOptions(afstand, AFSTAND_OPTIES),
      });
    }
    if (categorie) {
      list.push({
        key: "categorie",
        label: `Categorie: ${CATEGORIE_LABELS[categorie] ?? categorie}`,
      });
    }
    if (typeAfspraak) {
      list.push({
        key: "type_afspraak",
        label: `Type: ${labelFromOptions(typeAfspraak, TYPE_AFSPRAAK.map((t) => ({ value: t.slug, label: t.label })))}`,
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
    if (lengteVan || lengteTot) {
      list.push({
        key: "lengte",
        label: `Lengte: ${lengteVan || "150"}–${lengteTot || "200"} cm`,
      });
    }
    if (haarkleur) {
      list.push({
        key: "haarkleur",
        label: labelFromOptions(haarkleur, HAARKLEUR_OPTIES),
      });
    }
    if (taal) {
      list.push({
        key: "taal",
        label: labelFromOptions(taal, TAAL_OPTIES),
      });
    }
    if (mogelijkheden) {
      list.push({
        key: "mogelijkheden",
        label: labelFromOptions(mogelijkheden, MOGELIJKHEDEN_OPTIES),
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
            <Check className="active-filter-chip__icon h-3 w-3" aria-hidden />
            {chip.label}
            <X className="h-3 w-3 opacity-80" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="filter-label">
        {label}
      </label>
      <select
        id={id}
        className="filter-select filter-select--compact"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value || "all"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ZoekFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isAiMode = searchParams.get("ai") === "1";
  const [tab, setTab] = useState<"filters" | "ai">(isAiMode ? "ai" : "filters");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [stad, setStad] = useState(searchParams.get("stad") ?? "");
  const [afstand, setAfstand] = useState(searchParams.get("afstand") ?? "");
  const [categorie, setCategorie] = useState<string | null>(
    searchParams.get("categorie")
  );
  const [typeAfspraak, setTypeAfspraak] = useState<string | null>(
    searchParams.get("type_afspraak")
  );
  const [leeftijdVan, setLeeftijdVan] = useState(
    searchParams.get("leeftijd_van") ?? ""
  );
  const [leeftijdTot, setLeeftijdTot] = useState(
    searchParams.get("leeftijd_tot") ?? ""
  );
  const [prijsMin, setPrijsMin] = useState(searchParams.get("prijs_min") ?? "");
  const [prijsMax, setPrijsMax] = useState(searchParams.get("prijs_max") ?? "");
  const [lengteVan, setLengteVan] = useState(
    searchParams.get("lengte_van") ?? ""
  );
  const [lengteTot, setLengteTot] = useState(
    searchParams.get("lengte_tot") ?? ""
  );
  const [haarkleur, setHaarkleur] = useState(searchParams.get("haarkleur") ?? "");
  const [taal, setTaal] = useState(searchParams.get("taal") ?? "");
  const [mogelijkheden, setMogelijkheden] = useState(
    searchParams.get("mogelijkheden") ?? ""
  );
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

  function getValues(): FilterValues {
    return {
      q,
      stad,
      afstand,
      categorie,
      typeAfspraak,
      leeftijdVan,
      leeftijdTot,
      prijsMin,
      prijsMax,
      lengteVan,
      lengteTot,
      haarkleur,
      taal,
      mogelijkheden,
      geverifieerd,
    };
  }

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/zoeken?${qs}` : "/zoeken");
    });
  }

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(buildFilterParams(getValues()));
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

  function resetForm() {
    setQ("");
    setStad("");
    setAfstand("");
    setCategorie(null);
    setTypeAfspraak(null);
    setLeeftijdVan("");
    setLeeftijdTot("");
    setPrijsMin("");
    setPrijsMax("");
    setLengteVan("");
    setLengteTot("");
    setHaarkleur("");
    setTaal("");
    setMogelijkheden("");
    setGeverifieerd(false);
    setAiQuery("");
    setTab("filters");
    setShowMoreFilters(false);
  }

  function handleClear() {
    resetForm();
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
    } else if (key === "lengte") {
      params.delete("lengte_van");
      params.delete("lengte_tot");
      setLengteVan("");
      setLengteTot("");
    } else {
      params.delete(key);
      if (key === "q") {
        setQ("");
        setAiQuery("");
      }
      if (key === "stad") setStad("");
      if (key === "afstand") setAfstand("");
      if (key === "categorie") setCategorie(null);
      if (key === "type_afspraak") setTypeAfspraak(null);
      if (key === "haarkleur") setHaarkleur("");
      if (key === "taal") setTaal("");
      if (key === "mogelijkheden") setMogelijkheden("");
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
          <form onSubmit={handleFilterSubmit} className="filter-form mt-4" role="tabpanel">
            <div className="filter-row filter-row--top">
              <div className="filter-row__field filter-row__field--grow">
                <label htmlFor="zoek-q" className="filter-label">
                  Zoeken
                </label>
                <Input
                  id="zoek-q"
                  variant="light"
                  size="compact"
                  placeholder="Zoek op stad, naam of trefwoord…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="filter-row__field filter-row__field--grow">
                <label htmlFor="zoek-stad" className="filter-label">
                  Stad / regio
                </label>
                <Input
                  id="zoek-stad"
                  variant="light"
                  size="compact"
                  placeholder="Bijv. Antwerpen"
                  value={stad}
                  onChange={(e) => setStad(e.target.value)}
                />
              </div>
              <div className="filter-row__field">
                <FilterSelect
                  id="zoek-afstand"
                  label="Afstand"
                  value={afstand}
                  onChange={setAfstand}
                  options={AFSTAND_OPTIES}
                />
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-row__full">
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
            </div>

            <div className="filter-row">
              <div className="filter-row__full">
                <p className="filter-label">Type afspraak</p>
                <div className="category-chip-scroll no-scrollbar">
                  {TYPE_AFSPRAAK.map((type) => (
                    <CategoryChip
                      key={type.slug}
                      label={type.label}
                      active={typeAfspraak === type.slug}
                      onClick={() =>
                        setTypeAfspraak(
                          typeAfspraak === type.slug ? null : type.slug
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-row filter-row--numbers">
              <div>
                <label htmlFor="prijs-min" className="filter-label">
                  Prijs min €
                </label>
                <Input
                  id="prijs-min"
                  variant="light"
                  size="compact"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={prijsMin}
                  onChange={(e) => setPrijsMin(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="prijs-max" className="filter-label">
                  Prijs max €
                </label>
                <Input
                  id="prijs-max"
                  variant="light"
                  size="compact"
                  type="number"
                  min={0}
                  placeholder="500"
                  value={prijsMax}
                  onChange={(e) => setPrijsMax(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="leeftijd-van" className="filter-label">
                  Leeftijd vanaf
                </label>
                <Input
                  id="leeftijd-van"
                  variant="light"
                  size="compact"
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
                  size="compact"
                  type="text"
                  placeholder="65+"
                  value={leeftijdTot}
                  onChange={(e) => setLeeftijdTot(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lengte-van" className="filter-label">
                  Lengte vanaf cm
                </label>
                <Input
                  id="lengte-van"
                  variant="light"
                  size="compact"
                  type="number"
                  min={140}
                  placeholder="150"
                  value={lengteVan}
                  onChange={(e) => setLengteVan(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lengte-tot" className="filter-label">
                  Lengte tot cm
                </label>
                <Input
                  id="lengte-tot"
                  variant="light"
                  size="compact"
                  type="number"
                  min={140}
                  placeholder="190"
                  value={lengteTot}
                  onChange={(e) => setLengteTot(e.target.value)}
                />
              </div>
            </div>

            <div
              className={cn(
                "filter-more-section",
                showMoreFilters && "filter-more-section--open"
              )}
            >
              <div className="filter-row filter-row--dropdowns">
                <FilterSelect
                  id="haarkleur"
                  label="Haarkleur"
                  value={haarkleur}
                  onChange={setHaarkleur}
                  options={HAARKLEUR_OPTIES}
                />
                <FilterSelect
                  id="taal"
                  label="Taal"
                  value={taal}
                  onChange={setTaal}
                  options={TAAL_OPTIES}
                />
                <FilterSelect
                  id="mogelijkheden"
                  label="Mogelijkheden"
                  value={mogelijkheden}
                  onChange={setMogelijkheden}
                  options={MOGELIJKHEDEN_OPTIES}
                />
              </div>
            </div>

            <div className="filter-row filter-row--toggle">
              <ToggleSwitch
                id="geverifieerd-toggle"
                label="Alleen geverifieerd"
                checked={geverifieerd}
                onChange={setGeverifieerd}
              />
            </div>

            <div className="filter-actions filter-actions--inline">
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
                Filters resetten
              </Button>
              <button
                type="button"
                className="filter-more-toggle"
                onClick={() => setShowMoreFilters((v) => !v)}
                aria-expanded={showMoreFilters}
              >
                {showMoreFilters ? "Minder filters" : "Meer filters"}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showMoreFilters && "rotate-180"
                  )}
                />
              </button>
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
              <div className="popular-chip-grid mt-2">
                {AI_VOORBEELDEN.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    className="popular-chip"
                    onClick={() => setAiQuery(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-actions filter-actions--inline">
              <Button type="submit" size="md" className="w-full gap-2 sm:w-auto">
                <Sparkles className="h-4 w-4" />
                Zoek met AI
              </Button>
              <Button
                type="button"
                variant="secondary-light"
                size="md"
                onClick={handleClear}
                className="w-full sm:w-auto"
              >
                Filters resetten
              </Button>
            </div>
          </form>
        )}
      </div>

      <ActiveFilterChips searchParams={searchParams} onRemove={removeParam} />
    </div>
  );
}
