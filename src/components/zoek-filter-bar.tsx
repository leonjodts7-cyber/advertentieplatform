"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_CATEGORIEEN, MARKETPLACE_STEDEN } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";

function FilterContent({
  stad,
  setStad,
  actieveCategorie,
  filterBeschikbaar,
  filterGeverifieerd,
  searchParams,
  pushParams,
  handleZoeken,
  isPending,
}: {
  stad: string;
  setStad: (v: string) => void;
  actieveCategorie: string | null;
  filterBeschikbaar: boolean;
  filterGeverifieerd: boolean;
  searchParams: URLSearchParams;
  pushParams: (updates: Record<string, string | null>) => void;
  handleZoeken: (e: React.FormEvent) => void;
  isPending: boolean;
}) {
  function toggleChip(key: string, active: boolean) {
    pushParams({ [key]: active ? null : "1" });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleZoeken} className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="Zoek op stad..."
          value={stad}
          onChange={(e) => setStad(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isPending} className="shrink-0">
          Zoeken
        </Button>
      </form>

      <div>
        <p className="form-label mb-2">Categorie</p>
        <div className="flex flex-wrap gap-2">
          {MARKETPLACE_CATEGORIEEN.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() =>
                pushParams({
                  categorie:
                    actieveCategorie === cat.slug ? null : cat.slug,
                })
              }
              className={cn(
                "type-chip",
                actieveCategorie === cat.slug && "type-chip-active"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="form-label mb-2">Filters</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleChip("beschikbaar", filterBeschikbaar)}
            className={cn("type-chip", filterBeschikbaar && "type-chip-active")}
          >
            Beschikbaar
          </button>
          <button
            type="button"
            onClick={() => toggleChip("geverifieerd", filterGeverifieerd)}
            className={cn(
              "type-chip",
              filterGeverifieerd && "type-chip-active"
            )}
          >
            Geverifieerd
          </button>
        </div>
      </div>

      <div>
        <p className="form-label mb-2">Populaire steden</p>
        <div className="flex flex-wrap gap-2">
          {MARKETPLACE_STEDEN.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStad(s);
                pushParams({ stad: s });
              }}
              className={cn(
                "city-pill !min-h-[40px] px-3 py-1.5 text-xs",
                searchParams.get("stad") === s && "city-pill-active"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ZoekFilterBar({ variant = "inline" }: { variant?: "inline" | "drawer" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [stad, setStad] = useState(searchParams.get("stad") ?? "");
  const actieveCategorie = searchParams.get("categorie");
  const filterBeschikbaar = searchParams.get("beschikbaar") === "1";
  const filterGeverifieerd = searchParams.get("geverifieerd") === "1";

  const activeFilterCount =
    (actieveCategorie ? 1 : 0) +
    (filterBeschikbaar ? 1 : 0) +
    (filterGeverifieerd ? 1 : 0) +
    (searchParams.get("stad") ? 1 : 0);

  function pushParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    });
    startTransition(() => {
      router.push(`/zoeken?${params.toString()}`);
    });
  }

  function handleZoeken(e: React.FormEvent) {
    e.preventDefault();
    pushParams({ stad: stad.trim() || null });
    setDrawerOpen(false);
  }

  const contentProps = {
    stad,
    setStad,
    actieveCategorie,
    filterBeschikbaar,
    filterGeverifieerd,
    searchParams,
    pushParams,
    handleZoeken,
    isPending,
  };

  if (variant === "drawer") {
    return (
      <>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4 text-champagne" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-champagne/15 px-1.5 text-xs font-semibold text-champagne-light">
              {activeFilterCount}
            </span>
          )}
        </button>

        {drawerOpen && (
          <>
            <div
              className="filter-drawer-backdrop"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <div className="filter-drawer animate-slide-up">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-medium text-foreground">
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground"
                  aria-label="Sluiten"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterContent {...contentProps} />
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="filter-panel filter-panel-light">
      <h2 className="font-display mb-4 text-lg font-medium text-[#211a20]">
        Filters
      </h2>
      <FilterContent {...contentProps} />
    </div>
  );
}
