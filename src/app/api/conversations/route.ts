import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Chat foundation — list conversations for authenticated user */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("id, advertentie_id, aanbieder_id, visitor_id, last_message_at, created_at")
    .or(`visitor_id.eq.${user.id},aanbieder_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) {
    return NextResponse.json({ conversations: [], warning: error.message });
  }

  return NextResponse.json({ conversations: data ?? [] });
}

/** Start or resume a conversation (tracks chat_start analytics hook point) */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { advertentieId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const advertentieId = body.advertentieId?.trim();
  if (!advertentieId) {
    return NextResponse.json({ error: "advertentieId required" }, { status: 400 });
  }

  const { data: ad } = await supabase
    .from("advertenties")
    .select("id, aanbieder_id")
    .eq("id", advertentieId)
    .eq("status", "actief")
    .maybeSingle();

  if (!ad) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (ad.aanbieder_id === user.id) {
    return NextResponse.json({ error: "Cannot chat with own listing" }, { status: 403 });
  }

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("advertentie_id", advertentieId)
    .eq("visitor_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ conversationId: existing.id, created: false });
  }

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({
      advertentie_id: advertentieId,
      aanbieder_id: ad.aanbieder_id,
      visitor_id: user.id,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  void supabase.from("analytics_events").insert({
    event_type: "chat_start",
    advertentie_id: advertentieId,
    aanbieder_id: ad.aanbieder_id,
    viewer_id: user.id,
  });

  return NextResponse.json({ conversationId: created.id, created: true });
}
