"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_CATEGORIEEN, MARKETPLACE_STEDEN } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

export function ZoekFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [stad, setStad] = useState(searchParams.get("stad") ?? "");
  const actieveCategorie = searchParams.get("categorie");
  const filterBeschikbaar = searchParams.get("beschikbaar") === "1";
  const filterGeverifieerd = searchParams.get("geverifieerd") === "1";

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
  }

  function toggleChip(key: string, active: boolean) {
    pushParams({ [key]: active ? null : "1" });
  }

  return (
    <div className="space-y-3">
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

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {MARKETPLACE_CATEGORIEEN.slice(0, 4).map((cat) => (
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
          className={cn("type-chip", filterGeverifieerd && "type-chip-active")}
        >
          Geverifieerd
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {MARKETPLACE_STEDEN.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setStad(s);
              pushParams({ stad: s });
            }}
            className={cn(
              "city-pill !min-h-[36px] px-3 py-1 text-xs",
              searchParams.get("stad") === s && "border-champagne/40 bg-champagne/10 text-champagne"
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
