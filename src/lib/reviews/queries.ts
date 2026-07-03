import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdvertentieReview, ReviewSummary } from "@/lib/reviews/types";

export async function fetchReviewSummary(
  supabase: SupabaseClient,
  advertentieId: string
): Promise<ReviewSummary> {
  const { data } = await supabase
    .from("advertentie_reviews")
    .select("rating")
    .eq("advertentie_id", advertentieId);

  const ratings = (data ?? []).map((r) => r.rating as number);
  if (ratings.length === 0) return { average: 0, count: 0 };

  const average =
    Math.round((ratings.reduce((s, r) => s + r, 0) / ratings.length) * 10) / 10;
  return { average, count: ratings.length };
}

export async function fetchAdvertentieReviews(
  supabase: SupabaseClient,
  advertentieId: string,
  limit = 12
): Promise<AdvertentieReview[]> {
  const { data } = await supabase
    .from("advertentie_reviews")
    .select("*")
    .eq("advertentie_id", advertentieId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as AdvertentieReview[];
}
