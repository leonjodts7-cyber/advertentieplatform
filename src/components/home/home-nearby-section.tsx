"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import { AdvertentieCard } from "@/components/advertentie-card";
import { Button } from "@/components/ui/button";
import { BUURT_STEDEN } from "@/lib/marketplace";
import type { Advertentie } from "@/lib/types";

const LOC_STORAGE_KEY = "veloura_user_location";

interface HomeNearbySectionProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  selectedStad?: string;
}

export function HomeNearbySection({
  advertenties,
  fotos,
  selectedStad,
}: HomeNearbySectionProps) {
  const [locatieActief, setLocatieActief] = useState(false);
  const [locatieLaden, setLocatieLaden] = useState(false);
  const [locatieFout, setLocatieFout] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOC_STORAGE_KEY);
      if (raw) setLocatieActief(true);
    } catch {
      /* ignore */
    }
  }, []);

  function vraagLocatie() {
    setLocatieFout(null);
    if (!navigator.geolocation) {
      setLocatieFout("Locatie wordt niet ondersteund door je browser.");
      return;
    }
    setLocatieLaden(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          localStorage.setItem(
            LOC_STORAGE_KEY,
            JSON.stringify({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              at: Date.now(),
            })
          );
        } catch {
          /* ignore */
        }
        setLocatieActief(true);
        setLocatieLaden(false);
      },
      () => {
        setLocatieFout("Locatie niet beschikbaar. Kies handmatig een stad.");
        setLocatieLaden(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  const hasStad = Boolean(selectedStad?.trim());

  return (
    <section className="home-listing-block">
      <div className="container">
        <div className="home-listing-block__header">
          <div>
            <h2 className="home-listing-block__title">Advertenties in jouw buurt</h2>
            <p className="home-listing-block__subtitle">
              {locatieActief
                ? "Locatie actief — kies jouw stad voor relevante profielen."
                : "Gebruik je locatie of kies een stad in jouw regio."}
            </p>
          </div>
          {hasStad && advertenties.length > 0 && (
            <Link
              href={`/zoeken?stad=${encodeURIComponent(selectedStad!)}`}
              className="home-listing-block__link"
            >
              Meer in {selectedStad} →
            </Link>
          )}
        </div>

        <div className="nearby-toolbar">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="gap-1.5"
            disabled={locatieLaden}
            onClick={vraagLocatie}
          >
            <Navigation className="h-3.5 w-3.5" />
            {locatieLaden ? "Locatie ophalen…" : "Gebruik mijn locatie"}
          </Button>
          {locatieActief && (
            <span className="nearby-toolbar__active">
              <MapPin className="h-3.5 w-3.5" />
              Locatie actief
            </span>
          )}
        </div>

        {locatieFout && (
          <p className="nearby-toolbar__error" role="alert">
            {locatieFout}
          </p>
        )}

        {hasStad && advertenties.length > 0 ? (
          <div className="listing-grid listing-grid--home">
            {advertenties.map((advertentie) => (
              <AdvertentieCard
                key={advertentie.id}
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
                theme="light"
                premium
                showPremium={advertentie.premium === true}
                showOnline={advertentie.beschikbaar}
              />
            ))}
          </div>
        ) : hasStad ? (
          <p className="home-listing-empty__text mt-3">
            Geen profielen gevonden in {selectedStad}. Probeer een andere stad.
          </p>
        ) : null}

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-dark)]">
            Kies jouw stad
          </p>
          <div className="city-links-grid city-links-grid--buurt mt-2">
            {BUURT_STEDEN.map((s) => (
              <Link
                key={s}
                href={`/zoeken?stad=${encodeURIComponent(s)}`}
                className="city-link-card"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
