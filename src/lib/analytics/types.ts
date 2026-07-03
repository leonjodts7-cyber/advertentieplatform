export const ANALYTICS_EVENT_TYPES = [
  "profile_view",
  "phone_click",
  "whatsapp_click",
  "website_click",
  "favorite_add",
  "favorite_remove",
  "chat_start",
  "video_view",
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export interface AnalyticsEvent {
  id: string;
  event_type: AnalyticsEventType;
  advertentie_id: string;
  aanbieder_id: string;
  viewer_id: string | null;
  session_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ProviderAnalyticsSummary {
  profileViews: number;
  phoneClicks: number;
  whatsappClicks: number;
  websiteClicks: number;
  favoriteAdds: number;
  favoriteRemoves: number;
  chatStarts: number;
  videoViews: number;
  viewsChangePercent: number | null;
  popularDay: string | null;
  popularHour: number | null;
  contactRatio: number | null;
  saveRatio: number | null;
  topAdvertentieId: string | null;
  topAdvertentieTitle: string | null;
  avgPrice: number | null;
  newVisitors: number;
  returningVisitors: number;
  dailyViews: { date: string; count: number }[];
}
