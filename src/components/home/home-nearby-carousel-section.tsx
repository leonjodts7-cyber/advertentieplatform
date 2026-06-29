"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import type { Advertentie } from "@/lib/types";

const LOC_STORAGE_KEY = "veloura_user_location";

interface HomeNearbyCarouselSectionProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
}

export function HomeNearbyCarouselSection({
  advertenties,
  fotos,
}: HomeNearbyCarouselSectionProps) {
  const [locatieActief, setLocatieActief] = useState(false);
  const [locatieLaden, setLocatieLaden] = useState(false);
  const [locatieFout, setLocatieFout] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(LOC_STORAGE_KEY)) setLocatieActief(true);
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
        setLocatieFout("Locatie niet beschikbaar.");
        setLocatieLaden(false);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  if (advertenties.length === 0) {
    return null;
  }

  return (
    <HorizontalListingsCarousel
      title="Advertenties in jouw buurt"
      subtitle="Ontdek profielen dichtbij jou. Sta locatie toe voor relevantere resultaten."
      items={advertenties}
      fotos={fotos}
      variant="nearby"
      viewAllHref="/zoeken"
      ariaLabel="Advertenties in jouw buurt"
      toolbar={
        <div className="mb-4">
          <div className="home-nearby-compact__actions">
            <button
              type="button"
              className="home-locatie-btn"
              disabled={locatieLaden}
              onClick={vraagLocatie}
            >
              <Navigation className="h-3.5 w-3.5" aria-hidden />
              {locatieLaden ? "Locatie ophalen…" : "Gebruik mijn locatie"}
            </button>
            {locatieActief && (
              <span className="home-locatie-active">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Locatie actief
              </span>
            )}
            <Link href="/zoeken" className="home-nearby-compact__link">
              Of zoek per stad
            </Link>
          </div>
          {locatieFout && (
            <p className="home-nearby-compact__error mt-2" role="alert">
              {locatieFout}
            </p>
          )}
        </div>
      }
    />
  );
}
