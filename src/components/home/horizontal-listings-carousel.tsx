"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CarouselListingCard,
  type CarouselCardVariant,
} from "@/components/home/carousel-listing-card";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";

const GAP_PX = 14;

interface HorizontalListingsCarouselProps {
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  variant?: CarouselCardVariant;
  ariaLabel?: string;
  className?: string;
}

export function HorizontalListingsCarousel({
  advertenties,
  fotos,
  variant = "default",
  ariaLabel = "Advertenties carrousel",
  className,
}: HorizontalListingsCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    updateArrows();

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateArrows());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [advertenties.length, updateArrows]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function scrollByGroup(direction: -1 | 1) {
    const el = viewportRef.current;
    if (!el) return;

    const slide = el.querySelector<HTMLElement>(".listings-carousel__slide");
    if (!slide) return;

    const slideWidth = slide.offsetWidth;
    const step = slideWidth + GAP_PX;
    const visible = Math.max(1, Math.round(el.clientWidth / step));
    const amount = visible * step;

    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  if (advertenties.length === 0) return null;

  return (
    <div className={cn("listings-carousel", className)}>
      <div className="listings-carousel__fade listings-carousel__fade--left" aria-hidden />

      <button
        type="button"
        className="listings-carousel__arrow listings-carousel__arrow--prev"
        aria-label="Vorige advertenties"
        disabled={!canPrev}
        onClick={() => scrollByGroup(-1)}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>

      <div
        ref={viewportRef}
        className="listings-carousel__viewport"
        aria-label={ariaLabel}
        role="region"
        tabIndex={0}
      >
        <div className="listings-carousel__track">
          {advertenties.map((advertentie, index) => (
            <div
              key={advertentie.id}
              className="listings-carousel__slide"
              style={{ contentVisibility: index > 7 ? "auto" : undefined }}
            >
              <CarouselListingCard
                advertentie={advertentie}
                afbeeldingUrl={fotos.get(advertentie.id)}
                variant={variant}
                priority={index < 5}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="listings-carousel__arrow listings-carousel__arrow--next"
        aria-label="Volgende advertenties"
        disabled={!canNext}
        onClick={() => scrollByGroup(1)}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <div className="listings-carousel__fade listings-carousel__fade--right" aria-hidden />
    </div>
  )
}
