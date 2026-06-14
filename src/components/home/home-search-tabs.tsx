"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_CATEGORIEEN } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { Search, Sparkles } from "lucide-react";

const AI_VOORBEELDEN = [
  "Blonde vrouw rond 30 in Antwerpen",
  "Discrete massage in Gent",
  "Escort beschikbaar vanavond",
  "Koppel regio Brussel",
];

export function HomeSearchTabs() {
  const router = useRouter();
  const [tab, setTab] = useState<"klassiek" | "ai">("klassiek");
  const [stad, setStad] = useState("");
  const [categorie, setCategorie] = useState<string | null>(null);
  const [beschikbaarVandaag, setBeschikbaarVandaag] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  function handleKlassiekSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (stad.trim()) params.set("stad", stad.trim());
    if (categorie) params.set("categorie", categorie);
    if (beschikbaarVandaag) params.set("beschikbaar", "true");
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
                  Stad
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
                <p className="discovery-label">Categorie</p>
                <div className="flex flex-wrap gap-2">
                  {MARKETPLACE_CATEGORIEEN.slice(0, 8).map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() =>
                        setCategorie(
                          categorie === cat.slug ? null : cat.slug
                        )
                      }
                      className={cn(
                        "discovery-chip",
                        categorie === cat.slug && "discovery-chip--active"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="discovery-checkbox">
                <input
                  type="checkbox"
                  checked={beschikbaarVandaag}
                  onChange={(e) => setBeschikbaarVandaag(e.target.checked)}
                  className="discovery-checkbox__input"
                />
                <span>Beschikbaar vandaag</span>
              </label>

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
