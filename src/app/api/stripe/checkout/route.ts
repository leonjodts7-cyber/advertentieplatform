import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { haalCreditPakketten } from "@/lib/credits";

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  let body: { pakketId?: string; pakketSlug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }

  const pakketten = await haalCreditPakketten();
  const pakket = pakketten.find(
    (p) => p.id === body.pakketId || p.slug === body.pakketSlug
  );

  if (!pakket) {
    return NextResponse.json({ error: "Pakket niet gevonden." }, { status: 404 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: pakket.prijs_cent,
            product_data: {
              name: `Veloura Credits — ${pakket.naam}`,
              description: `${pakket.credits} credits voor AI Lounge`,
            },
          },
        },
      ],
      metadata: {
        userId: user.id,
        pakketId: pakket.id,
        credits: String(pakket.credits),
        pakketSlug: pakket.slug,
      },
      success_url: `${siteUrl()}/credits?success=1`,
      cancel_url: `${siteUrl()}/credits?cancelled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Checkout mislukt.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
