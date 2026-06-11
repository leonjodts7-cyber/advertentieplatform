"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CreditPakket } from "@/lib/ai-types";

function formatPrijs(cent: number) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(cent / 100);
}

interface CreditsKopenProps {
  pakketten: CreditPakket[];
}

export function CreditsKopen({ pakketten }: CreditsKopenProps) {
  const [laden, setLaden] = useState<string | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  async function koopPakket(pakket: CreditPakket) {
    setLaden(pakket.id);
    setFout(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pakketId: pakket.id, pakketSlug: pakket.slug }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        setFout(data.error ?? "Checkout mislukt.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setFout("Verbinding mislukt. Probeer opnieuw.");
    } finally {
      setLaden(null);
    }
  }

  return (
    <div>
      <h2 className="section-title text-lg">Credit pakketten</h2>
      <p className="section-subtitle mt-1">
        Veilig betalen via Stripe. Credits worden direct toegevoegd.
      </p>

      {fout && (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {fout}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {pakketten.map((pakket, i) => (
          <div
            key={pakket.id}
            className={`luxury-card flex flex-col p-5 ${
              i === 1 ? "border-champagne/30 soft-glow" : ""
            }`}
          >
            {i === 1 && (
              <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-champagne">
                Populair
              </span>
            )}
            <p className="font-display text-xl text-foreground">{pakket.naam}</p>
            <p className="mt-1 font-display text-3xl text-champagne-light">
              {pakket.credits}
            </p>
            <p className="text-sm text-muted-foreground">credits</p>
            <p className="mt-3 text-lg font-semibold text-foreground">
              {formatPrijs(pakket.prijs_cent)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ≈ {(pakket.prijs_cent / 100 / pakket.credits).toFixed(2)} € per
              credit
            </p>
            <Button
              className="mt-5 w-full"
              disabled={laden === pakket.id}
              onClick={() => koopPakket(pakket)}
            >
              {laden === pakket.id ? "Laden..." : "Kopen"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
