import { NextResponse } from "next/server";
import { haalFavorietIds } from "@/lib/favorieten-queries";
import { recordAnalyticsEvent } from "@/lib/analytics/queries";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const advertentieId = searchParams.get("advertentie_id");

  if (advertentieId) {
    const { data, error } = await supabase
      .from("favorieten")
      .select("id")
      .eq("user_id", user.id)
      .eq("advertentie_id", advertentieId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ favorited: Boolean(data) });
  }

  const ids = await haalFavorietIds(supabase, user.id);
  return NextResponse.json({ ids });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { advertentie_id?: string };
  try {
    body = (await request.json()) as { advertentie_id?: string };
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const advertentieId = body.advertentie_id?.trim();
  if (!advertentieId) {
    return NextResponse.json({ error: "advertentie_id required" }, { status: 400 });
  }

  const { data: advertentie } = await supabase
    .from("advertenties")
    .select("id, aanbieder_id")
    .eq("id", advertentieId)
    .eq("status", "actief")
    .maybeSingle();

  if (!advertentie) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const { error } = await supabase.from("favorieten").insert({
    user_id: user.id,
    advertentie_id: advertentieId,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, favorited: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  void recordAnalyticsEvent(supabase, {
    eventType: "favorite_add",
    advertentieId,
    aanbiederId: advertentie.aanbieder_id as string,
    viewerId: user.id,
  });

  return NextResponse.json({ ok: true, favorited: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const advertentieId = searchParams.get("advertentie_id")?.trim();

  if (!advertentieId) {
    return NextResponse.json({ error: "advertentie_id required" }, { status: 400 });
  }

  const { data: advertentie } = await supabase
    .from("advertenties")
    .select("id, aanbieder_id")
    .eq("id", advertentieId)
    .maybeSingle();

  const { error } = await supabase
    .from("favorieten")
    .delete()
    .eq("user_id", user.id)
    .eq("advertentie_id", advertentieId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (advertentie) {
    void recordAnalyticsEvent(supabase, {
      eventType: "favorite_remove",
      advertentieId,
      aanbiederId: advertentie.aanbieder_id as string,
      viewerId: user.id,
    });
  }

  return NextResponse.json({ ok: true, favorited: false });
}
