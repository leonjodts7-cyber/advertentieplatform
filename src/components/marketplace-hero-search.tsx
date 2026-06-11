"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_STEDEN, MARKETPLACE_TYPES } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MarketplaceHeroSearchProps {
  inputId?: string;
}

export function MarketplaceHeroSearch({
  inputId = "hero-stad",
}: MarketplaceHeroSearchProps) {
  const router = useRouter();
  const [stad, setStad] = useState("");
  const [type, setType] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (stad.trim()) params.set("stad", stad.trim());
    if (type) params.set("categorie", type);
    router.push(`/zoeken${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={inputId} className="form-label">
          Stad of regio
        </label>
        <Input
          id={inputId}
          placeholder="Bijv. Antwerpen"
          value={stad}
          onChange={(e) => setStad(e.target.value)}
        />
      </div>

      <div>
        <p className="form-label mb-2">Type dienst</p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {MARKETPLACE_TYPES.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setType(type === t.slug ? null : t.slug)}
              className={cn(
                "type-chip",
                type === t.slug && "type-chip-active"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        Zoeken
      </Button>

      <div>
        <p className="text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
          Populaire steden
        </p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {MARKETPLACE_STEDEN.map((s) => (
            <Link
              key={s}
              href={`/zoeken?stad=${encodeURIComponent(s)}`}
              className="city-pill !min-h-[36px] px-3 py-1.5 text-xs"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    </form>
  );
}
