"use client";

import { useEffect, useState } from "react";
import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import { HomeCarouselSkeleton } from "@/components/home/home-carousel-skeleton";
import { useTranslation } from "@/contexts/locale-context";
import { getTopInterestCategory, getTopInterestCity } from "@/lib/interest-signals";
import type { Advertentie } from "@/lib/types";

export function HomeForYouSection() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<Advertentie[]>([]);
  const [fotos, setFotos] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const city = getTopInterestCity();
    const category = getTopInterestCategory();
    if (!city && !category) return;

    setVisible(true);
    setLoading(true);

    const params = new URLSearchParams();
    if (category) params.set("categorie", category);
    if (city) params.set("stad", city);
    params.set("limit", "12");

    void fetch(`/api/advertenties/for-you?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.items) return;
        setItems(data.items);
        setFotos(new Map(Object.entries(data.fotos ?? {})));
      })
      .finally(() => setLoading(false));
  }, []);

  if (!visible) return null;
  if (loading) return <HomeCarouselSkeleton />;

  const interestCity = getTopInterestCity();
  const interestCategory = getTopInterestCategory();
  const viewAllHref = interestCategory
    ? `/zoeken?categorie=${interestCategory}${interestCity ? `&stad=${encodeURIComponent(interestCity)}` : ""}`
    : interestCity
      ? `/zoeken?stad=${encodeURIComponent(interestCity)}`
      : "/zoeken";

  return (
    <HorizontalListingsCarousel
      title={t("discovery.forYouTitle")}
      subtitle={t("discovery.forYouSubtitle")}
      items={items}
      fotos={fotos}
      variant="popular"
      viewAllHref={viewAllHref}
    />
  );
}
