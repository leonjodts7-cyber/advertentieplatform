"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryChip } from "@/components/ui/category-chip";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { Search, Sparkles } from "lucide-react";

const AI_VOORBEELDEN = [
  "Escort Antwerpen",
  "Massage Brussel",
  "Video afspraak",
];

export function HomeSearchTabs() {
  const router = useRouter();
  const [tab, setTab] = useState<"snel" | "ai">("snel");
  const [stad, setStad] = useState("");
  const [categorie, setCategorie] = useState<string | null>(null);
  const [leeftijdVan, setLeeftijdVan] = useState("");
  const [prijsMax, setPrijsMax] = useState("");
  const [geverifieerd, setGeverifieerd] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  function handleSnelSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (stad.trim()) params.set("stad", stad.trim());
    if (categorie) params.set("categorie", categorie);
    if (leeftijdVan.trim()) params.set("leeftijd_van", leeftijdVan.trim());
    if (prijsMax.trim()) params.set("prijs_max", prijsMax.trim());
    if (geverifieerd) params.set("geverifieerd", "true");
    router.push(`/zoeken${params.toString() ? `?${params}` : ""}`);
  }

  function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = aiQuery.trim();
    if (!q) {
      router.push("/zoeken");
      return;
    }
    router.push(`/zoeken?q=${encodeURIComponent(q)}&ai=1`);
  }

  return (
    <div className="home-search-widget">
      <div className="home-search-widget__panel">
        <div className="search-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "snel"}
            onClick={() => setTab("snel")}
            className={cn("search-tabs__btn", tab === "snel" && "search-tabs__btn--active")}
          >
            <Search className="h-3.5 w-3.5" />
            Snel zoeken
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "ai"}
            onClick={() => setTab("ai")}
            className={cn("search-tabs__btn", tab === "ai" && "search-tabs__btn--active")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI zoeken
          </button>
        </div>

        {tab === "snel" ? (
          <form onSubmit={handleSnelSubmit} className="home-search-widget__form" role="tabpanel">
            <div>
              <label htmlFor="home-stad" className="filter-label filter-label--dark">
                Stad / regio
              </label>
              <Input
                id="home-stad"
                variant="dark"
                size="compact"
                placeholder="Bijv. Antwerpen"
                value={stad}
                onChange={(e) => setStad(e.target.value)}
              />
            </div>
            <div>
              <p className="filter-label filter-label--dark">Categorie</p>
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
            <div className="home-search-widget__extras">
              <div>
                <label htmlFor="home-leeftijd" className="filter-label filter-label--dark">
                  Leeftijd vanaf
                </label>
                <Input
                  id="home-leeftijd"
                  variant="dark"
                  size="compact"
                  type="number"
                  min={18}
                  placeholder="18"
                  value={leeftijdVan}
                  onChange={(e) => setLeeftijdVan(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="home-prijs" className="filter-label filter-label--dark">
                  Max prijs €
                </label>
                <Input
                  id="home-prijs"
                  variant="dark"
                  size="compact"
                  type="number"
                  min={0}
                  placeholder="250"
                  value={prijsMax}
                  onChange={(e) => setPrijsMax(e.target.value)}
                />
              </div>
            </div>
            <ToggleSwitch
              id="home-geverifieerd"
              label="Alleen geverifieerd"
              checked={geverifieerd}
              onChange={setGeverifieerd}
              className="toggle-switch--dark"
            />
            <Button type="submit" size="md" className="w-full">
              Toon profielen
            </Button>
          </form>
        ) : (
          <form onSubmit={handleAiSubmit} className="home-search-widget__form" role="tabpanel">
            <div>
              <label htmlFor="home-ai" className="filter-label filter-label--dark">
                Beschrijf wat je zoekt…
              </label>
              <Textarea
                id="home-ai"
                variant="dark"
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
                    className="popular-chip popular-chip--dark"
                    onClick={() => setAiQuery(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" size="md" className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              Zoek met AI
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
