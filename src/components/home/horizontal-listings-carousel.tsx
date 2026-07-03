"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarouselListingCard } from "@/components/home/carousel-listing-card";
import { CarouselPlaceholderCard } from "@/components/home/carousel-placeholder-card";
import { getCarouselPlaceholders } from "@/lib/home-carousel-placeholders";
import type { Advertentie } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ListingCarouselVariant = "spotlight" | "premium" | "nearby" | "latest" | "popular";

export interface HorizontalListingsCarouselProps {
  title: string;
  subtitle?: string;
  items: Advertentie[];
  fotos: Map<string, string | undefined>;
  variant?: ListingCarouselVariant;
  hrefBase?: string;
  viewAllHref?: string;
  ariaLabel?: string;
  className?: string;
  toolbar?: React.ReactNode;
  /** Compact section for search page fallbacks */
  embedded?: boolean;
  fotoCounts?: Map<string, number>;
}

const GAP_PX = 8;

const SECTION_CLASS: Record<ListingCarouselVariant, string> = {
  spotlight: "home-spotlight",
  premium: "home-listing-block home-listing-block--premium",
  nearby: "home-nearby-compact home-listing-block home-listing-block--nearby",
  latest: "home-listing-block home-listing-block--compact home-listing-block--latest",
  popular: "home-listing-block home-listing-block--popular",
};

const INTRINSIC_SIZE: Record<ListingCarouselVariant, string> = {
  spotlight: "390px 360px",
  premium: "235px 320px",
  nearby: "220px 300px",
  latest: "195px 280px",
  popular: "235px 320px",
};

export function HorizontalListingsCarousel({
  title,
  subtitle,
  items,
  fotos,
  variant = "latest",
  hrefBase = "/advertentie/",
  viewAllHref,
  ariaLabel,
  className,
  toolbar,
  embedded = false,
  fotoCounts,
}: HorizontalListingsCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  const usePlaceholders = items.length === 0;
  const placeholders = useMemo(
    () => (usePlaceholders ? getCarouselPlaceholders(variant) : []),
    [usePlaceholders, variant]
  );
  const slideCount = usePlaceholders ? placeholders.length : items.length;

  const updateArrows = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const hasScroll = maxScroll > 8;
    setScrollable(hasScroll);
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const runUpdate = () => requestAnimationFrame(updateArrows);
    runUpdate();
    const t = window.setTimeout(runUpdate, 150);
    const t2 = window.setTimeout(runUpdate, 400);

    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(runUpdate);
    ro.observe(el);

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [slideCount, updateArrows]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth + 8) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: "auto" });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function scrollByGroup(direction: -1 | 1) {
    const el = viewportRef.current;
    if (!el) return;

    const slide = el.querySelector<HTMLElement>("[data-carousel-slide]");
    if (!slide) return;

    const step = slide.offsetWidth + GAP_PX;
    const visible = Math.max(1, Math.floor(el.clientWidth / step));
    el.scrollBy({ left: direction * visible * step, behavior: "smooth" });
  }

  const label = ariaLabel ?? title;

  return (
    <section
      className={cn(
        embedded ? "search-carousel-section" : SECTION_CLASS[variant],
        className
      )}
      data-home-carousel={variant}
      data-carousel-count={slideCount}
      data-carousel-demo={usePlaceholders ? "true" : "false"}
    >
      <div className="container">
        <div className="home-listing-block__header">
          <div>
            <h2 className="home-listing-block__title">{title}</h2>
            {subtitle && (
              <p className="home-listing-block__subtitle">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="home-listing-block__link">
              Alles bekijken
            </Link>
          )}
        </div>

        {toolbar}

        <div
          className={cn(
            "listings-carousel",
            `listings-carousel--${variant}`,
            scrollable && "listings-carousel--scrollable"
          )}
        >
          <div
            className="listings-carousel__fade listings-carousel__fade--left"
            aria-hidden
          />

          <button
            type="button"
            className="listings-carousel__arrow listings-carousel__arrow--prev"
            aria-label="Vorige advertenties"
            disabled={!canPrev}
            onClick={() => scrollByGroup(-1)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>

          <div
            ref={viewportRef}
            className="listings-carousel__viewport scrollbar-hide overflow-x-auto scroll-smooth snap-x snap-mandatory"
            aria-label={label}
            role="region"
            tabIndex={0}
          >
            <div className="listings-carousel__track">
              {usePlaceholders
                ? placeholders.map((placeholder, index) => (
                    <div
                      key={placeholder.id}
                      data-carousel-slide
                      className="listings-carousel__slide snap-start"
                    >
                      <CarouselPlaceholderCard
                        item={placeholder}
                        carouselTier={variant}
                      />
                    </div>
                  ))
                : items.map((advertentie, index) => (
                    <div
                      key={advertentie.id}
                      data-carousel-slide
                      className="listings-carousel__slide snap-start"
                      style={
                        index > 7
                          ? {
                              contentVisibility: "auto",
                              containIntrinsicSize: INTRINSIC_SIZE[variant],
                            }
                          : undefined
                      }
                    >
                      <CarouselListingCard
                        advertentie={advertentie}
                        afbeeldingUrl={fotos.get(advertentie.id)}
                        href={`${hrefBase}${advertentie.id}`}
                        carouselTier={variant}
                        fotoCount={fotoCounts?.get(advertentie.id) ?? 0}
                        variant={
                          variant === "spotlight"
                            ? "spotlight"
                            : variant === "premium"
                              ? "premium"
                              : variant === "popular"
                                ? "premium"
                                : variant === "latest"
                                  ? "latest"
                                  : "default"
                        }
                        priority={index < 6}
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
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>

          <div
            className="listings-carousel__fade listings-carousel__fade--right"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
