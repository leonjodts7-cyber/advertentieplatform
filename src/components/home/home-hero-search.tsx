"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryChip } from "@/components/ui/category-chip";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const AI_VOORBEELDEN = [
  "Escort Antwerpen",
  "Massage Gent",
  "Video afspraak",
  "Geverifieerd onder €200",
];

type SearchTab = "snel" | "ai";

export function HomeHeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<SearchTab>("snel");
  const [stad, setStad] = useState("");
  const [categorie, setCategorie] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState("");

  function handleSnelSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (stad.trim()) params.set("stad", stad.trim());
    if (categorie) params.set("categorie", categorie);
    router.push(`/zoeken${params.toString() ? `?${params}` : ""}`);
  }

  function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = aiQuery.trim();
    if (!trimmed) {
      router.push("/zoeken?ai=1");
      return;
    }
    const params = new URLSearchParams({ q: trimmed, ai: "1" });
    router.push(`/zoeken?${params}`);
  }

  return (
    <div className="hero-search-card hero-search-card--premium">
      <div className="hero-search-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "snel"}
          className={cn("hero-search-tabs__btn", tab === "snel" && "hero-search-tabs__btn--active")}
          onClick={() => setTab("snel")}
        >
          Snel zoeken
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "ai"}
          className={cn("hero-search-tabs__btn", tab === "ai" && "hero-search-tabs__btn--active")}
          onClick={() => setTab("ai")}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          AI zoeken
        </button>
      </div>

      {tab === "snel" ? (
        <form onSubmit={handleSnelSubmit} className="hero-search-card__body">
          <div className="hero-search-card__fields">
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
          </div>
          <Button type="submit" size="md" className="w-full">
            Toon profielen
          </Button>
        </form>
      ) : (
        <form onSubmit={handleAiSubmit} className="hero-search-card__body">
          <label htmlFor="home-ai" className="filter-label filter-label--dark">
            Beschrijf wat je zoekt…
          </label>
          <Textarea
            id="home-ai"
            variant="dark"
            placeholder="Bijv. escort in Antwerpen, massage in Gent, video afspraak, geverifieerd profiel onder €200…"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="min-h-[88px]"
          />
          <div className="hero-search-card__examples">
            {AI_VOORBEELDEN.map((ex) => (
              <button
                key={ex}
                type="button"
                className="hero-search-card__example-chip"
                onClick={() => setAiQuery(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
          <Button type="submit" size="md" className="mt-3 w-full gap-2">
            <Sparkles className="h-4 w-4" />
            Zoek met AI
          </Button>
        </form>
      )}
    </div>
  );
}
