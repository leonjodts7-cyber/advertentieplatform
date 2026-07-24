import { HomeNearbyCarouselSection } from "@/components/home/home-nearby-carousel-section";
import { getHomepageSection } from "@/lib/cache/homepage-bundle";
import { getCachedListingPhotos } from "@/lib/cache/listing-photos";

export async function HomeNearbySection() {
  const items = await getHomepageSection("nearby");
  const ids = items.map((a) => a.id);
  const { urls, counts } = await getCachedListingPhotos(ids);

  return (
    <HomeNearbyCarouselSection
      advertenties={items}
      fotos={urls}
      fotoCounts={counts}
    />
  );
}
