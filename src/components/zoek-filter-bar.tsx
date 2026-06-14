"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryChip } from "@/components/ui/category-chip";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const AFSTAND_OPTIONS = [
  { value: "", label: "Elke afstand" },
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
] as const;

const CATEGORIE_LABELS = Object.fromEntries(
  MARKETPLACE_CATEGORIEEN.map((c) => [c.slug, c.label])
);

function buildParamsFromForm(values: {
  q: string;
  stad: string;
  afstand: string;
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
  if (values.afstand) params.set("afstand", values.afstand);
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
    const afstand = searchParams.get("afstand");
    const categorie = searchParams.get("categorie");
    const leeftijdVan = searchParams.get("leeftijd_van");
    const leeftijdTot = searchParams.get("leeftijd_tot");
    const prijsMin = searchParams.get("prijs_min");
    const prijsMax = searchParams.get("prijs_max");
    const geverifieerd = searchParams.get("geverifieerd");

    if (q) list.push({ key: "q", label: `Zoek: ${q}` });
    if (stad) list.push({ key: "stad", label: `Stad: ${stad}` });
    if (afstand) {
      const label =
        AFSTAND_OPTIONS.find((o) => o.value === afstand)?.label ?? `${afstand} km`;
      list.push({ key: "afstand", label: `Afstand: ${label}` });
    }
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

  function handleRemove(key: string) {
    onRemove(key);
  }

  return (
    <div className="active-filters">
      <p className="active-filters__label">Actieve filters</p>
      <div className="active-filters__list">
        {chips.map((chip) => (
          <button
            key={chip.key + chip.label}
            type="button"
            className="active-filter-chip"
            onClick={() => handleRemove(chip.key)}
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

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [stad, setStad] = useState(searchParams.get("stad") ?? "");
  const [afstand, setAfstand] = useState(searchParams.get("afstand") ?? "");
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

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/zoeken?${qs}` : "/zoeken");
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(
      buildParamsFromForm({
        q,
        stad,
        afstand,
        categorie,
        leeftijdVan,
        leeftijdTot,
        prijsMin,
        prijsMax,
        geverifieerd,
      })
    );
  }

  function handleClear() {
    setQ("");
    setStad("");
    setAfstand("");
    setCategorie(null);
    setLeeftijdVan("");
    setLeeftijdTot("");
    setPrijsMin("");
    setPrijsMax("");
    setGeverifieerd(false);
    navigate(new URLSearchParams());
  }

  function removeParam(key: string) {
    const params = new URLSearchParams(searchParams.toString());

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
      if (key === "q") setQ("");
      if (key === "stad") setStad("");
      if (key === "afstand") setAfstand("");
      if (key === "categorie") setCategorie(null);
      if (key === "geverifieerd") setGeverifieerd(false);
    }

    navigate(params);
  }

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit} className="filter-panel filter-panel-premium">
        <div className="filter-grid">
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

          <div>
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

          <div>
            <label htmlFor="zoek-afstand" className="filter-label">
              Afstand
            </label>
            <select
              id="zoek-afstand"
              value={afstand}
              onChange={(e) => setAfstand(e.target.value)}
              className="filter-select"
            >
              {AFSTAND_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
              label="Alleen geverifieerde profielen"
              checked={geverifieerd}
              onChange={setGeverifieerd}
            />
          </div>
        </div>

        <div className="filter-actions">
          <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
            Toon profielen
          </Button>
          <Button
            type="button"
            variant="secondary-light"
            size="lg"
            onClick={handleClear}
            className="w-full sm:w-auto"
          >
            Filters wissen
          </Button>
        </div>
      </form>

      <ActiveFilterChips searchParams={searchParams} onRemove={removeParam} />
    </div>
  );
}

export function ZoekCategoryBar({ activeSlug }: { activeSlug?: string }) {
  const searchParams = useSearchParams();

  function hrefFor(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activeSlug === slug) params.delete("categorie");
    else params.set("categorie", slug);
    const qs = params.toString();
    return qs ? `/zoeken?${qs}` : "/zoeken";
  }

  const NAV_CATEGORIEEN = [
    { slug: "prive-ontvangst", label: "Privé ontvangst" },
    { slug: "escort", label: "Escort" },
    { slug: "video", label: "Video" },
    { slug: "massage", label: "Massage" },
    { slug: "koppels", label: "Koppels" },
    { slug: "trans", label: "Trans" },
    { slug: "mannen", label: "Mannen" },
    { slug: "vrouwen", label: "Vrouwen" },
  ] as const;

  return (
    <nav className="category-nav" aria-label="Categorieën">
      <div className="container">
        <div className="category-nav__inner">
          <p className="category-nav__title">Categorieën</p>
          <div className="category-nav__scroll no-scrollbar">
            {NAV_CATEGORIEEN.map((cat) => (
              <CategoryChip
                key={cat.slug}
                href={hrefFor(cat.slug)}
                label={cat.label}
                active={activeSlug === cat.slug}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
