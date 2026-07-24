"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { useTranslation } from "@/contexts/locale-context";
import type { Advertentie } from "@/lib/types";

interface HomeNearbyCarouselSectionProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  fotoCounts?: Map<string, number>;
}

export function HomeNearbyCarouselSection({
  advertenties,
  fotos,
  fotoCounts,
}: HomeNearbyCarouselSectionProps) {
  const { t } = useTranslation();

  if (advertenties.length === 0) return null;

  return (
    <HorizontalListingsCarousel
      title={t("home.nearbyTitle")}
      subtitle={t("home.nearbySubtitle")}
      items={advertenties}
      fotos={fotos}
      variant="nearby"
      viewAllHref="/zoeken"
      ariaLabel={t("home.nearbyTitle")}
      fotoCounts={fotoCounts}
      toolbar={
        <div className="home-nearby-compact__actions">
          <Link href="/zoeken" className="home-nearby-compact__link">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {t("home.searchByCity")}
          </Link>
        </div>
      }
    />
  );
}
