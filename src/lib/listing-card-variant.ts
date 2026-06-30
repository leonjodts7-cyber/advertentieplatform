import {
  isPlaatsingActief,
  isPremiumListing,
  plaatsingType,
} from "@/lib/advertentie-boost";
import type { CarouselCardVariant } from "@/components/home/carousel-listing-card";
import type { Advertentie } from "@/lib/types";

export function getListingCardVariant(advertentie: Advertentie): CarouselCardVariant {
  if (
    isPlaatsingActief(advertentie) &&
    plaatsingType(advertentie) === "homepage"
  ) {
    return "spotlight";
  }
  if (isPremiumListing(advertentie) || advertentie.premium === true) {
    return "premium";
  }
  return "default";
}
