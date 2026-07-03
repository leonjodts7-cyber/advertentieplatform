"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProfilePhotoPlaceholder } from "@/components/profile-photo-placeholder";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  alt?: string;
}

interface ProfileGalleryProps {
  items: GalleryItem[];
  title: string;
}

export function ProfileGallery({ items, title }: ProfileGalleryProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateIndex = useCallback(() => {
    const el = viewportRef.current;
    if (!el || items.length === 0) return;
    const slide = el.querySelector<HTMLElement>("[data-gallery-slide]");
    if (!slide) return;
    const step = slide.offsetWidth;
    if (step <= 0) return;
    const index = Math.round(el.scrollLeft / step);
    setActiveIndex(Math.min(Math.max(index, 0), items.length - 1));
  }, [items.length]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateIndex);
  }, [updateIndex]);

  function scrollTo(index: number) {
    const el = viewportRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-gallery-slide]");
    if (!slide) return;
    el.scrollTo({ left: slide.offsetWidth * index, behavior: "smooth" });
  }

  if (items.length === 0) {
    return (
      <div className="profile-gallery profile-gallery--empty">
        <ProfilePhotoPlaceholder variant="warm-wine" className="!aspect-[16/10] h-full w-full" />
      </div>
    );
  }

  return (
    <div className="profile-gallery">
      <div
        ref={viewportRef}
        className="profile-gallery__viewport scrollbar-hide"
        aria-label={`Foto's van ${title}`}
      >
        <div className="profile-gallery__track">
          {items.map((item) => (
            <div
              key={item.id}
              data-gallery-slide
              className="profile-gallery__slide snap-start"
            >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  className="profile-gallery__media"
                  preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.alt ?? title}
                  className="profile-gallery__media"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className="profile-gallery__arrow profile-gallery__arrow--prev"
            aria-label="Vorige afbeelding"
            onClick={() => scrollTo(Math.max(activeIndex - 1, 0))}
            disabled={activeIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="profile-gallery__arrow profile-gallery__arrow--next"
            aria-label="Volgende afbeelding"
            onClick={() => scrollTo(Math.min(activeIndex + 1, items.length - 1))}
            disabled={activeIndex >= items.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="profile-gallery__dots" role="tablist" aria-label="Galerij positie">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Afbeelding ${index + 1}`}
                className={cn(
                  "profile-gallery__dot",
                  index === activeIndex && "profile-gallery__dot--active"
                )}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
