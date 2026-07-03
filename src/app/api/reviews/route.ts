import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchAdvertentieReviews, fetchReviewSummary } from "@/lib/reviews/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const advertentieId = searchParams.get("advertentieId");
  if (!advertentieId) {
    return NextResponse.json({ error: "Missing advertentieId" }, { status: 400 });
  }

  const supabase = await createClient();
  const [summary, reviews] = await Promise.all([
    fetchReviewSummary(supabase, advertentieId),
    fetchAdvertentieReviews(supabase, advertentieId),
  ]);

  return NextResponse.json({ summary, reviews });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { advertentieId?: string; rating?: number; title?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { advertentieId, rating, title, body: reviewBody } = body;
  if (!advertentieId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
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
    return NextResponse.json({ error: "Cannot review own listing" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("advertentie_reviews")
    .upsert(
      {
        advertentie_id: advertentieId,
        aanbieder_id: ad.aanbieder_id,
        reviewer_id: user.id,
        rating,
        title: title?.trim() || null,
        body: reviewBody?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "advertentie_id,reviewer_id" }
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review: data });
}
