import type { SupabaseClient } from "@supabase/supabase-js";
import type { AnalyticsEventType, ProviderAnalyticsSummary } from "@/lib/analytics/types";

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function countByType(
  rows: { event_type: string }[],
  type: AnalyticsEventType
): number {
  return rows.filter((r) => r.event_type === type).length;
}

export async function fetchProviderAnalytics(
  supabase: SupabaseClient,
  aanbiederId: string,
  rangeDays: 7 | 30 | 90 = 7
): Promise<ProviderAnalyticsSummary> {
  const since = daysAgoIso(rangeDays);
  const prevSince = daysAgoIso(rangeDays * 2);

  const [{ data: current }, { data: previous }, { data: ads }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("event_type, advertentie_id, viewer_id, session_id, created_at")
      .eq("aanbieder_id", aanbiederId)
      .gte("created_at", since),
    supabase
      .from("analytics_events")
      .select("event_type, created_at")
      .eq("aanbieder_id", aanbiederId)
      .gte("created_at", prevSince)
      .lt("created_at", since),
    supabase
      .from("advertenties")
      .select("id, titel, prijs_vanaf")
      .eq("aanbieder_id", aanbiederId),
  ]);

  const rows = current ?? [];
  const prevRows = previous ?? [];
  const profileViews = countByType(rows, "profile_view");
  const prevViews = countByType(prevRows, "profile_view");
  const viewsChangePercent =
    prevViews > 0 ? Math.round(((profileViews - prevViews) / prevViews) * 100) : null;

  const phoneClicks = countByType(rows, "phone_click");
  const whatsappClicks = countByType(rows, "whatsapp_click");
  const websiteClicks = countByType(rows, "website_click");
  const favoriteAdds = countByType(rows, "favorite_add");
  const favoriteRemoves = countByType(rows, "favorite_remove");
  const chatStarts = countByType(rows, "chat_start");
  const videoViews = countByType(rows, "video_view");

  const contacts = phoneClicks + whatsappClicks + websiteClicks + chatStarts;
  const contactRatio = profileViews > 0 ? Math.round((contacts / profileViews) * 1000) / 10 : null;
  const saveRatio = profileViews > 0 ? Math.round((favoriteAdds / profileViews) * 1000) / 10 : null;

  const viewRows = rows.filter((r) => r.event_type === "profile_view");
  const dayCounts = new Map<number, number>();
  const hourCounts = new Map<number, number>();
  const adViewCounts = new Map<string, number>();
  const sessionFirstSeen = new Map<string, string>();

  for (const row of viewRows) {
    const d = new Date(row.created_at as string);
    const day = d.getDay();
    const hour = d.getHours();
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
    const adId = row.advertentie_id as string;
    adViewCounts.set(adId, (adViewCounts.get(adId) ?? 0) + 1);
    const sid = row.session_id as string | null;
    if (sid && !sessionFirstSeen.has(sid)) {
      sessionFirstSeen.set(sid, row.created_at as string);
    }
  }

  let popularDay: string | null = null;
  let maxDay = 0;
  for (const [day, count] of dayCounts) {
    if (count > maxDay) {
      maxDay = count;
      popularDay = DAY_NAMES[day] ?? null;
    }
  }

  let popularHour: number | null = null;
  let maxHour = 0;
  for (const [hour, count] of hourCounts) {
    if (count > maxHour) {
      maxHour = count;
      popularHour = hour;
    }
  }

  let topAdvertentieId: string | null = null;
  let topCount = 0;
  for (const [id, count] of adViewCounts) {
    if (count > topCount) {
      topCount = count;
      topAdvertentieId = id;
    }
  }

  const adList = ads ?? [];
  const topAd = adList.find((a) => a.id === topAdvertentieId);
  const prices = adList
    .map((a) => a.prijs_vanaf as number)
    .filter((p) => typeof p === "number" && p > 0);
  const avgPrice =
    prices.length > 0
      ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length)
      : null;

  const dailyMap = new Map<string, number>();
  for (const row of viewRows) {
    const key = (row.created_at as string).slice(0, 10);
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
  }
  const dailyViews = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const viewerSessions = new Set(
    viewRows.map((r) => (r.viewer_id as string | null) ?? (r.session_id as string | null)).filter(Boolean)
  );

  return {
    profileViews,
    phoneClicks,
    whatsappClicks,
    websiteClicks,
    favoriteAdds,
    favoriteRemoves,
    chatStarts,
    videoViews,
    viewsChangePercent,
    popularDay,
    popularHour,
    contactRatio,
    saveRatio,
    topAdvertentieId,
    topAdvertentieTitle: (topAd?.titel as string) ?? null,
    avgPrice,
    newVisitors: viewerSessions.size,
    returningVisitors: 0,
    dailyViews,
  };
}

export async function recordAnalyticsEvent(
  supabase: SupabaseClient,
  input: {
    eventType: AnalyticsEventType;
    advertentieId: string;
    aanbiederId: string;
    viewerId?: string | null;
    sessionId?: string | null;
    metadata?: Record<string, unknown>;
  }
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from("analytics_events").insert({
    event_type: input.eventType,
    advertentie_id: input.advertentieId,
    aanbieder_id: input.aanbiederId,
    viewer_id: input.viewerId ?? null,
    session_id: input.sessionId ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
