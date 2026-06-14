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

const AI_VOORBEELDEN = [
  "Blonde vrouw rond 30 in Antwerpen",
  "Discrete massage in Gent",
  "Escort in regio Brussel",
  "Koppel regio Vlaanderen",
];

export function HomeSearchTabs() {
  const router = useRouter();
  const [tab, setTab] = useState<"klassiek" | "ai">("klassiek");
  const [stad, setStad] = useState("");
  const [categorie, setCategorie] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState("");

  function handleKlassiekSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (stad.trim()) params.set("stad", stad.trim());
    if (categorie) params.set("categorie", categorie);
    router.push(`/zoeken${params.toString() ? `?${params}` : ""}`);
  }

  function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = aiQuery.trim();
    router.push(q ? `/zoeken?q=${encodeURIComponent(q)}` : "/zoeken");
  }

  return (
    <section className="discovery-search">
      <div className="container">
        <div className="discovery-search__panel">
          <div className="discovery-search__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "klassiek"}
              onClick={() => setTab("klassiek")}
              className={cn(
                "discovery-search__tab",
                tab === "klassiek" && "discovery-search__tab--active"
              )}
            >
              <Search className="h-4 w-4" />
              Klassiek zoeken
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "ai"}
              onClick={() => setTab("ai")}
              className={cn(
                "discovery-search__tab",
                tab === "ai" && "discovery-search__tab--active"
              )}
            >
              <Sparkles className="h-4 w-4" />
              AI Zoekassistent
            </button>
          </div>

          {tab === "klassiek" ? (
            <form
              onSubmit={handleKlassiekSubmit}
              className="discovery-search__form"
              role="tabpanel"
            >
              <div className="discovery-search__field">
                <label htmlFor="home-stad" className="discovery-label">
                  Stad of regio
                </label>
                <Input
                  id="home-stad"
                  placeholder="Bijv. Antwerpen"
                  value={stad}
                  onChange={(e) => setStad(e.target.value)}
                  className="discovery-input-light"
                />
              </div>

              <div className="discovery-search__field">
                <p className="discovery-label">Type dienst</p>
                <div className="category-chip-scroll no-scrollbar">
                  {MARKETPLACE_CATEGORIEEN.map((cat) => (
                    <CategoryChip
                      key={cat.slug}
                      label={cat.label}
                      active={categorie === cat.slug}
                      onClick={() =>
                        setCategorie(
                          categorie === cat.slug ? null : cat.slug
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Zoeken
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleAiSubmit}
              className="discovery-search__form"
              role="tabpanel"
            >
              <div className="discovery-search__field">
                <label htmlFor="ai-zoek" className="discovery-label">
                  Beschrijf wat je zoekt
                </label>
                <Textarea
                  id="ai-zoek"
                  placeholder={AI_VOORBEELDEN.join("\n")}
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="discovery-textarea-light min-h-[120px]"
                />
                <p className="discovery-hint">
                  Bijvoorbeeld: &ldquo;{AI_VOORBEELDEN[0]}&rdquo;
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2 sm:w-auto">
                <Sparkles className="h-4 w-4" />
                AI zoekopdracht starten
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
