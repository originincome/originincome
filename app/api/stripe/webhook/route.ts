import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "../../../../lib/stripe/config";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ received: false, error: "STRIPE_WEBHOOK_SECRET ist noch nicht konfiguriert." }, { status: 500 });
  }

  if (!signature) {
    return NextResponse.json({ received: false, error: "Stripe-Signatur fehlt." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    // V8.8 nimmt den Webhook-Endpunkt bereits vorweg.
    // Die finale, serverseitige Freischaltung in Supabase folgt in V8.9.
    if (event.type === "checkout.session.completed") {
      console.log("Stripe checkout completed", event.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error", error);
    return NextResponse.json({ received: false, error: "Webhook konnte nicht verarbeitet werden." }, { status: 400 });
  }
}
