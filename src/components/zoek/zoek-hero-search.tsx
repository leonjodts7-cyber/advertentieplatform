"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryChip } from "@/components/ui/category-chip";
import { useTranslation } from "@/contexts/locale-context";
import { categoryLabelI18n } from "@/lib/i18n/marketplace-i18n";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import { buildFilterParams } from "@/lib/zoek-filters";
import { fetchAiZoekParams } from "@/lib/ai-zoek-nav";
import { cn } from "@/lib/utils";

const AI_EXAMPLE_KEYS = [
  "search.aiExample1",
  "search.aiExample2",
  "search.aiExample3",
  "search.aiExample4",
  "search.aiExample5",
  "search.aiExample6",
  "search.aiExample7",
  "search.aiExample8",
] as const;

const RECENT_KEY = "veloura_recent_searches";

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]).slice(0, 5) : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  if (!query.trim()) return;
  const prev = loadRecent().filter((q) => q !== query);
  localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, 8)));
}

type SearchMode = "normal" | "ai";

export function ZoekHeroSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [mode, setMode] = useState<SearchMode>(
    searchParams.get("ai") === "1" ? "ai" : "normal"
  );
  const [isPending, startTransition] = useTransition();
  const [aiLaden, setAiLaden] = useState(false);

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [stad, setStad] = useState(searchParams.get("stad") ?? "");
  const [categorie, setCategorie] = useState<string | null>(
    searchParams.get("categorie")
  );
  const [prijsMax, setPrijsMax] = useState(searchParams.get("prijs_max") ?? "");
  const [aiQuery, setAiQuery] = useState(
    searchParams.get("ai") === "1" ? searchParams.get("q") ?? "" : ""
  );
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `/zoeken?${qs}` : "/zoeken");
    });
  }

  function handleNormalSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveRecent(q.trim() || stad.trim());
    navigate(
      buildFilterParams({
        q,
        stad,
        categorie,
        prijsMax,
        afstand: "",
        typeAfspraak: "",
        leeftijdVan: "",
        leeftijdTot: "",
        prijsMin: "",
        lengteVan: "",
        lengteTot: "",
        haarkleur: "",
        oogkleur: "",
        taal: "",
        geverifieerd: false,
        beschikbaar: false,
        hotelMogelijk: false,
        thuisOntvangen: false,
        videoMogelijk: false,
        discreetContact: false,
        nieuwProfiel: false,
        premiumProfiel: false,
        verplaatsingMogelijk: false,
        koppelsWelkom: false,
      })
    );
  }

  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAiLaden(true);
    try {
      saveRecent(aiQuery);
      setRecent(loadRecent());
      const params = await fetchAiZoekParams(aiQuery);
      startTransition(() => {
        router.push(`/zoeken?${params}`);
      });
    } finally {
      setAiLaden(false);
    }
  }

  return (
    <section className="zoek-hero-search" aria-label={t("search.title")}>
      <div className="zoek-hero-search__modes" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "normal"}
          className={cn(
            "zoek-hero-search__mode",
            mode === "normal" && "zoek-hero-search__mode--active"
          )}
          onClick={() => setMode("normal")}
        >
          {t("search.modeNormal")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "ai"}
          className={cn(
            "zoek-hero-search__mode",
            mode === "ai" && "zoek-hero-search__mode--active"
          )}
          onClick={() => setMode("ai")}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {t("search.modeAi")}
        </button>
      </div>

      {mode === "normal" ? (
        <form onSubmit={handleNormalSubmit} className="zoek-hero-search__form">
          <div className="zoek-hero-search__row">
            <div className="zoek-hero-search__field zoek-hero-search__field--grow">
              <label htmlFor="hero-q" className="sr-only">
                {t("filters.labels.search")}
              </label>
              <Input
                id="hero-q"
                variant="light"
                size="compact"
                placeholder={t("search.heroPlaceholder")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="zoek-hero-search__field">
              <label htmlFor="hero-stad" className="sr-only">
                {t("filters.labels.city")}
              </label>
              <Input
                id="hero-stad"
                variant="light"
                size="compact"
                placeholder={t("search.locationPlaceholder")}
                value={stad}
                onChange={(e) => setStad(e.target.value)}
              />
            </div>
            <div className="zoek-hero-search__field zoek-hero-search__field--price">
              <label htmlFor="hero-prijs" className="sr-only">
                {t("filters.labels.priceMax")}
              </label>
              <Input
                id="hero-prijs"
                variant="light"
                size="compact"
                type="number"
                min={0}
                placeholder="€ max"
                value={prijsMax}
                onChange={(e) => setPrijsMax(e.target.value)}
              />
            </div>
            <Button type="submit" size="md" disabled={isPending} className="zoek-hero-search__submit">
              {t("search.searchBtn")}
            </Button>
          </div>
          <div className="zoek-hero-search__chips">
            <span className="zoek-hero-search__chips-label">{t("search.categoryLabel")}</span>
            <div className="category-chip-scroll no-scrollbar">
              {MARKETPLACE_CATEGORIEEN.map((cat) => (
                <CategoryChip
                  key={cat.slug}
                  label={categoryLabelI18n(t, cat.slug, cat.label)}
                  active={categorie === cat.slug}
                  onClick={() =>
                    setCategorie(categorie === cat.slug ? null : cat.slug)
                  }
                />
              ))}
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAiSubmit} className="zoek-hero-search__ai">
          <label htmlFor="hero-ai" className="filter-label">
            {t("search.aiDescribe")}
          </label>
          <Textarea
            id="hero-ai"
            variant="light"
            placeholder={t("search.aiDescribe")}
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="zoek-hero-search__ai-input"
          />

          {recent.length > 0 && (
            <div className="zoek-hero-search__chip-section">
              <p className="zoek-hero-search__chip-title">{t("search.aiRecent")}</p>
              <div className="popular-chip-grid">
                {recent.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="popular-chip"
                    onClick={() => setAiQuery(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="zoek-hero-search__chip-section">
            <p className="zoek-hero-search__chip-title">{t("search.aiExamples")}</p>
            <div className="popular-chip-grid">
              {AI_EXAMPLE_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="popular-chip"
                  onClick={() => setAiQuery(t(key))}
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="md"
            disabled={isPending || aiLaden}
            className="zoek-hero-search__ai-submit gap-2"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            {aiLaden ? t("search.aiAnalyzing") : t("search.aiSubmit")}
          </Button>
        </form>
      )}
    </section>
  );
}
