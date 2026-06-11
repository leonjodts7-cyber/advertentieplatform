import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { voegCreditsToe } from "@/lib/credits";
import { createServiceRoleSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.text();
  const headerStore = await headers();
  const signature = headerStore.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Geen signature." }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret niet geconfigureerd." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Ongeldige signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits ?? "0", 10);

    if (userId && credits > 0 && session.id) {
      const admin = createServiceRoleSupabaseClient();
      const { data: bestaand } = await admin
        .from("credit_transacties")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (!bestaand) {
        await voegCreditsToe(
          userId,
          credits,
          `Credit aankoop — ${credits} credits`,
          session.id,
          { pakketId: session.metadata?.pakketId, pakketSlug: session.metadata?.pakketSlug }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
