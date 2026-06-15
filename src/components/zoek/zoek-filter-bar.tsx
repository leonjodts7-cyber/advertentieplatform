"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryChip } from "@/components/ui/category-chip";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { AFSTAND_OPTIES, MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import {
  buildFilterParams,
  HAARKLEUR_OPTIES,
  parsedFiltersToParams,
  TAAL_OPTIES,
  type ZoekFilterValues,
} from "@/lib/zoek-filters";
import { cn } from "@/lib/utils";
import { ChevronDown, Sparkles } from "lucide-react";

const MOGELIJKHEDEN_OPTIES = [
  { value: "", label: "Alle mogelijkheden" },
  { value: "thuis_ontvangen", label: "Thuis ontvangen" },
  { value: "hotel_mogelijk", label: "Hotel mogelijk" },
  { value: "video_mogelijk", label: "Video mogelijk" },
] as const;

const AI_VOORBEELDEN = [
  "Blonde dame Antwerpen onder €200",
  "Massage Gent vanavond",
  "Video afspraak Nederlands",
];

function boolFromParam(value: string | null) {
  return value === "true" || value === "1";
}

export function ZoekFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [aiLoading, setAiLoading] = useState(false);
  const [extendedOpen, setExtendedOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(searchParams.get("ai") === "1");

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [stad, setStad] = useState(searchParams.get("stad") ?? "");
  const [categorie, setCategorie] = useState<string | null>(
    searchParams.get("categorie")
  );
  const [afstand, setAfstand] = useState(searchParams.get("afstand") ?? "");
  const [leeftijdVan, setLeeftijdVan] = useState(searchParams.get("leeftijd_van") ?? "");
  const [leeftijdTot, setLeeftijdTot] = useState(searchParams.get("leeftijd_tot") ?? "");
  const [prijsMin, setPrijsMin] = useState(searchParams.get("prijs_min") ?? "");
  const [prijsMax, setPrijsMax] = useState(searchParams.get("prijs_max") ?? "");
  const [lengteVan, setLengteVan] = useState(searchParams.get("lengte_van") ?? "");
  const [lengteTot, setLengteTot] = useState(searchParams.get("lengte_tot") ?? "");
  const [haarkleur, setHaarkleur] = useState(searchParams.get("haarkleur") ?? "");
  const [taal, setTaal] = useState(searchParams.get("taal") ?? "");
  const [mogelijkheid, setMogelijkheid] = useState(() => {
    if (boolFromParam(searchParams.get("thuis_ontvangen"))) return "thuis_ontvangen";
    if (boolFromParam(searchParams.get("hotel_mogelijk"))) return "hotel_mogelijk";
    if (boolFromParam(searchParams.get("video_mogelijk"))) return "video_mogelijk";
    return "";
  });
  const [geverifieerd, setGeverifieerd] = useState(
    boolFromParam(searchParams.get("geverifieerd"))
  );
  const [aiQuery, setAiQuery] = useState(
    searchParams.get("ai") === "1" ? searchParams.get("q") ?? "" : ""
  );

  function getValues(): ZoekFilterValues {
    return {
      q,
      stad,
      afstand,
      categorie,
      leeftijdVan,
      leeftijdTot,
      prijsMin,
      prijsMax,
      lengteVan,
      lengteTot,
      gewichtVan: "",
      gewichtTot: "",
      haarkleur,
      oogkleur: "",
      nationaliteit: "",
      taal,
      geverifieerd,
      beschikbaar: false,
      hotelMogelijk: mogelijkheid === "hotel_mogelijk",
      thuisOntvangen: mogelijkheid === "thuis_ontvangen",
      videoMogelijk: mogelijkheid === "video_mogelijk",
      koppelsWelkom: false,
      rokenToegestaan: false,
    };
  }

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/zoeken?${qs}` : "/zoeken");
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(buildFilterParams(getValues()));
  }

  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = aiQuery.trim();
    if (!trimmed) return navigate(new URLSearchParams());
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/zoek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      if (res.ok) {
        const data = (await res.json()) as { filters?: Record<string, string> };
        navigate(parsedFiltersToParams(data.filters ?? {}));
        return;
      }
    } catch {
      /* fallback */
    } finally {
      setAiLoading(false);
    }
    navigate(new URLSearchParams({ q: trimmed }));
  }

  function handleClear() {
    setQ("");
    setStad("");
    setCategorie(null);
    setAfstand("");
    setLeeftijdVan("");
    setLeeftijdTot("");
    setPrijsMin("");
    setPrijsMax("");
    setLengteVan("");
    setLengteTot("");
    setHaarkleur("");
    setTaal("");
    setMogelijkheid("");
    setGeverifieerd(false);
    setAiQuery("");
    setExtendedOpen(false);
    setAiOpen(false);
    navigate(new URLSearchParams());
  }

  const hasFilters = Array.from(searchParams.keys()).some(
    (k) => k !== "ai" && searchParams.get(k)
  );

  return (
    <div className="zoek-filter-bar">
      {aiOpen ? (
        <form onSubmit={handleAiSubmit} className="zoek-filter-bar__ai">
          <div className="zoek-filter-bar__ai-header">
            <button
              type="button"
              className="zoek-filter-bar__back"
              onClick={() => setAiOpen(false)}
            >
              ← Snel zoeken
            </button>
          </div>
          <label htmlFor="zoek-ai" className="filter-label">
            Beschrijf je wens
          </label>
          <Textarea
            id="zoek-ai"
            variant="light"
            placeholder="Beschrijf wat je zoekt…"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="min-h-[88px]"
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
          <Button
            type="submit"
            size="md"
            disabled={aiLoading || isPending}
            className="mt-3 w-full gap-2 sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            {aiLoading ? "Bezig…" : "Zoek met AI"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="zoek-filter-bar__compact">
          <div className="zoek-filter-bar__row">
            <div className="zoek-filter-bar__field zoek-filter-bar__field--grow">
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
            <div className="zoek-filter-bar__field zoek-filter-bar__field--grow">
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
            <div className="zoek-filter-bar__field zoek-filter-bar__field--btn">
              <Button type="submit" size="md" disabled={isPending} className="w-full">
                Toon profielen
              </Button>
            </div>
          </div>

          <div className="zoek-filter-bar__chips">
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

          <div className="zoek-filter-bar__meta">
            <button
              type="button"
              className="zoek-filter-bar__extend-btn"
              onClick={() => setExtendedOpen((v) => !v)}
              aria-expanded={extendedOpen}
            >
              Uitgebreide filters
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", extendedOpen && "rotate-180")}
              />
            </button>
            <button
              type="button"
              className="zoek-filter-bar__ai-link"
              onClick={() => setAiOpen(true)}
            >
              Beschrijf je wens
            </button>
            {hasFilters && (
              <button
                type="button"
                className="zoek-filter-bar__clear"
                onClick={handleClear}
              >
                Filters wissen
              </button>
            )}
          </div>

          {extendedOpen && (
            <div className="zoek-filter-bar__extended">
              <div className="zoek-filter-bar__extended-grid">
                <div>
                  <label htmlFor="afstand" className="filter-label">Afstand</label>
                  <select
                    id="afstand"
                    className="filter-select filter-select--compact"
                    value={afstand}
                    onChange={(e) => setAfstand(e.target.value)}
                  >
                    {AFSTAND_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="leeftijd-van" className="filter-label">Leeftijd min</label>
                  <Input id="leeftijd-van" variant="light" size="compact" type="number" min={18} placeholder="18" value={leeftijdVan} onChange={(e) => setLeeftijdVan(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="leeftijd-tot" className="filter-label">Leeftijd max</label>
                  <Input id="leeftijd-tot" variant="light" size="compact" placeholder="65+" value={leeftijdTot} onChange={(e) => setLeeftijdTot(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="prijs-min" className="filter-label">Prijs min €</label>
                  <Input id="prijs-min" variant="light" size="compact" type="number" min={0} placeholder="0" value={prijsMin} onChange={(e) => setPrijsMin(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="prijs-max" className="filter-label">Prijs max €</label>
                  <Input id="prijs-max" variant="light" size="compact" type="number" min={0} placeholder="500" value={prijsMax} onChange={(e) => setPrijsMax(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="lengte-van" className="filter-label">Lengte min cm</label>
                  <Input id="lengte-van" variant="light" size="compact" type="number" placeholder="150" value={lengteVan} onChange={(e) => setLengteVan(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="lengte-tot" className="filter-label">Lengte max cm</label>
                  <Input id="lengte-tot" variant="light" size="compact" type="number" placeholder="190" value={lengteTot} onChange={(e) => setLengteTot(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="haarkleur" className="filter-label">Haarkleur</label>
                  <select id="haarkleur" className="filter-select filter-select--compact" value={haarkleur} onChange={(e) => setHaarkleur(e.target.value)}>
                    {HAARKLEUR_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="taal" className="filter-label">Taal</label>
                  <select id="taal" className="filter-select filter-select--compact" value={taal} onChange={(e) => setTaal(e.target.value)}>
                    {TAAL_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="mogelijkheden" className="filter-label">Mogelijkheden</label>
                  <select id="mogelijkheden" className="filter-select filter-select--compact" value={mogelijkheid} onChange={(e) => setMogelijkheid(e.target.value)}>
                    {MOGELIJKHEDEN_OPTIES.map((o) => (
                      <option key={o.value || "all"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <ToggleSwitch
                id="geverifieerd"
                label="Alleen geverifieerd"
                checked={geverifieerd}
                onChange={setGeverifieerd}
                className="mt-3"
              />
            </div>
          )}
        </form>
      )}
    </div>
  );
}
