"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/contexts/locale-context";
import type { AdvertentieReview, ReviewSummary } from "@/lib/reviews/types";
import { cn } from "@/lib/utils";

interface AdvertentieReviewsSectionProps {
  advertentieId: string;
  initialSummary: ReviewSummary;
  initialReviews: AdvertentieReview[];
}

export function AdvertentieReviewsSection({
  advertentieId,
  initialSummary,
  initialReviews,
}: AdvertentieReviewsSectionProps) {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(initialSummary);
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLaden(true);
    setFout(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advertentieId, rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFout(data.error ?? "Error");
        return;
      }
      const refresh = await fetch(`/api/reviews?advertentieId=${advertentieId}`);
      if (refresh.ok) {
        const payload = await refresh.json();
        setSummary(payload.summary);
        setReviews(payload.reviews);
      }
      setTitle("");
      setBody("");
    } finally {
      setLaden(false);
    }
  }

  return (
    <div className="light-card p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="profile-detail-section-title">{t("detail.reviews")}</h2>
        {summary.count > 0 && (
          <p className="text-sm text-[#756760]">
            {t("reviews.stars", { rating: summary.average })} ·{" "}
            {t("reviews.count", { count: summary.count })}
          </p>
        )}
      </div>

      {reviews.length > 0 ? (
        <ul className="review-list mt-4 space-y-3">
          {reviews.map((review) => (
            <li key={review.id} className="review-card">
              <div className="review-card__stars" aria-label={t("reviews.stars", { rating: review.rating })}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-3.5 w-3.5", i < review.rating ? "text-[#d6b36b]" : "text-[#e5d8cf]")}
                    fill={i < review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              {review.title && <p className="review-card__title">{review.title}</p>}
              {review.body && <p className="review-card__body">{review.body}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[#756760]">{t("detail.noReviews")}</p>
      )}

      <form onSubmit={handleSubmit} className="review-form mt-5 space-y-3 border-t border-[#e5d8cf] pt-5">
        <p className="text-sm font-medium text-[#211a20]">{t("detail.writeReview")}</p>
        <div className="review-form__stars">
          <span className="text-sm text-[#756760]">{t("detail.rating")}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className="review-star-btn"
                onClick={() => setRating(n)}
                aria-label={`${n}`}
              >
                <Star
                  className={cn("h-5 w-5", n <= rating ? "text-[#d6b36b]" : "text-[#e5d8cf]")}
                  fill={n <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </div>
        <Input
          variant="light"
          placeholder={t("detail.reviewTitle")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          variant="light"
          placeholder={t("detail.reviewBody")}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-[80px]"
        />
        {fout && <p className="text-sm text-red-400">{fout}</p>}
        <Button type="submit" disabled={laden} size="md">
          {laden ? t("common.loading") : t("detail.submitReview")}
        </Button>
      </form>
    </div>
  );
}
