import { SkeletonCard } from "@/components/home/skeleton-card";

export function HomeCarouselSkeleton() {
  return (
    <section className="home-listing-block" aria-hidden>
      <div className="container">
        <div className="page-loading-skeleton page-loading-skeleton--title home-carousel-skeleton__title" />
        <div className="page-loading-skeleton page-loading-skeleton--subtitle home-carousel-skeleton__subtitle" />
        <div className="home-carousel-skeleton__row">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
