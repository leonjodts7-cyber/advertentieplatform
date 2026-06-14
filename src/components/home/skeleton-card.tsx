export function SkeletonCard() {
  return (
    <div className="discovery-skeleton-card" aria-hidden>
      <div className="discovery-skeleton-card__image" />
      <div className="discovery-skeleton-card__body">
        <div className="discovery-skeleton-card__line discovery-skeleton-card__line--short" />
        <div className="discovery-skeleton-card__line" />
        <div className="discovery-skeleton-card__line discovery-skeleton-card__line--medium" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="discovery-grid mt-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
