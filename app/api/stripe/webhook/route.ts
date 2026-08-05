import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getStripe } from "../../../../lib/stripe/config";
import { createAdminClient } from "../../../../lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ received: false, error: "STRIPE_WEBHOOK_SECRET fehlt." }, { status: 500 });
  }
  if (!signature) {
    return NextResponse.json({ received: false, error: "Stripe-Signatur fehlt." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe signature verification failed", error);
    return NextResponse.json({ received: false, error: "Ungültige Stripe-Signatur." }, { status: 400 });
  }

  try {
    const admin = createAdminClient();

    // Idempotency: Stripe may retry the same event. The primary key prevents duplicates.
    const { error: eventInsertError } = await admin.from("stripe_events").insert({
      event_id: event.id,
      event_type: event.type,
    });

    if (eventInsertError) {
      if (eventInsertError.code === "23505") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      throw eventInsertError;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id || session.client_reference_id;
      const plan = session.metadata?.plan;

      if (!userId || !plan) throw new Error("Checkout metadata ist unvollständig.");
      if (session.payment_status !== "paid") {
        await admin.from("stripe_events").update({ processing_note: `Payment status: ${session.payment_status}` }).eq("event_id", event.id);
        return NextResponse.json({ received: true, paid: false });
      }

      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
      const selectedModel = session.metadata?.selected_business_model || null;
      const paidAt = new Date((session.created || Math.floor(Date.now() / 1000)) * 1000).toISOString();

      const { error: profileError } = await admin.from("profiles").upsert({
        user_id: userId,
        chosen_plan: plan,
        payment_status: "paid",
        access_status: "active",
        stripe_customer_id: customerId,
        stripe_session_id: session.id,
        selected_business_model: selectedModel,
        purchase_date: paidAt,
        last_payment: paidAt,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      if (profileError) throw profileError;

      const { error: paymentError } = await admin.from("payments").upsert({
        stripe_session_id: session.id,
        user_id: userId,
        stripe_customer_id: customerId,
        plan,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        selected_business_model: selectedModel,
        purchased_at: paidAt,
      }, { onConflict: "stripe_session_id" });
      if (paymentError) throw paymentError;

      const { error: authError } = await admin.auth.admin.updateUserById(userId, {
        user_metadata: {
          origin_plan: plan,
          payment_status: "paid",
          access_status: "active",
          access_unlocked: true,
          stripe_customer_id: customerId,
          stripe_checkout_session_id: session.id,
          selected_business_model: selectedModel,
          paid_at: paidAt,
        },
      });
      if (authError) throw authError;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error", error);
    return NextResponse.json({ received: false, error: "Webhook-Verarbeitung fehlgeschlagen." }, { status: 500 });
  }
}
