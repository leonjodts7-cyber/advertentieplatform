import { HorizontalListingsCarousel } from "@/components/home/horizontal-listings-carousel";
import type { Advertentie } from "@/lib/types";

interface HomeListingSectionProps {
  title: string;
  subtitle?: string;
  advertenties: Advertentie[];
  fotos: Map<string, string | undefined>;
  viewAllHref: string;
  hideWhenEmpty?: boolean;
  variant?: "latest" | "premium";
}

export function HomeListingSection({
  title,
  subtitle,
  advertenties,
  fotos,
  viewAllHref,
  hideWhenEmpty = false,
  variant = "latest",
}: HomeListingSectionProps) {
  if (advertenties.length === 0 && hideWhenEmpty) return null;

  return (
    <HorizontalListingsCarousel
      title={title}
      subtitle={subtitle}
      items={advertenties}
      fotos={fotos}
      variant={variant}
      viewAllHref={viewAllHref}
    />
  );
}
