export interface AdvertentieReview {
  id: string;
  advertentie_id: string;
  aanbieder_id: string;
  reviewer_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
}
