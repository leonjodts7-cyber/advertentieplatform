import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recordAnalyticsEvent } from "@/lib/analytics/queries";
import type { AnalyticsEventType } from "@/lib/analytics/types";
import { ANALYTICS_EVENT_TYPES } from "@/lib/analytics/types";

export async function POST(request: Request) {
  let body: {
    eventType?: string;
    advertentieId?: string;
    sessionId?: string;
    metadata?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { eventType, advertentieId, sessionId, metadata } = body;
  if (!eventType || !advertentieId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!ANALYTICS_EVENT_TYPES.includes(eventType as AnalyticsEventType)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ad } = await supabase
    .from("advertenties")
    .select("id, aanbieder_id")
    .eq("id", advertentieId)
    .maybeSingle();

  if (!ad) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const result = await recordAnalyticsEvent(supabase, {
    eventType: eventType as AnalyticsEventType,
    advertentieId,
    aanbiederId: ad.aanbieder_id as string,
    viewerId: user?.id ?? null,
    sessionId: sessionId ?? null,
    metadata,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
