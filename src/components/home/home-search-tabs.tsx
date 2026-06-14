"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CategoryChip } from "@/components/ui/category-chip";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { Search, Sparkles } from "lucide-react";

export function HomeSearchTabs() {
  const router = useRouter();
  const [tab, setTab] = useState<"snel" | "ai">("snel");
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
    const q = aiQuery.trim();
    if (!q) {
      router.push("/zoeken");
      return;
    }
    const params = new URLSearchParams({ q, ai: "1" });
    router.push(`/zoeken?${params}`);
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
            Beschrijf je wens
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
            <Button type="submit" size="md" className="w-full">
              Toon profielen
            </Button>
          </form>
        ) : (
          <form onSubmit={handleAiSubmit} className="home-search-widget__form" role="tabpanel">
            <div>
              <label htmlFor="home-ai" className="filter-label filter-label--dark">
                Beschrijf je wens
              </label>
              <Textarea
                id="home-ai"
                variant="dark"
                placeholder="Bijv. discrete massage in Gent, escort in Antwerpen, video afspraak…"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="min-h-[88px]"
              />
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
