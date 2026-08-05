import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getAppUrl, getStripe, getStripePlan, type PlanId } from "../../../../lib/stripe/config";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Bitte zuerst einloggen." }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const plan = getStripePlan(body?.plan as PlanId);
    if (!plan) return NextResponse.json({ error: "Ungültiges Paket." }, { status: 400 });

    const selectedModel = user.user_metadata?.selected_business_model || "not-selected";
    const stripe = getStripe();
    const appUrl = getAppUrl(request.headers.get("origin"));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      customer_email: user.email || undefined,
      customer_creation: "always",
      client_reference_id: user.id,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        user_id: user.id,
        plan: plan.id,
        plan_name: plan.name,
        selected_business_model: String(selectedModel)
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel?plan=${plan.id}`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json({ error: "Checkout konnte nicht gestartet werden." }, { status: 500 });
  }
}
