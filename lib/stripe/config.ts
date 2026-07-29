import Stripe from "stripe";
export { STRIPE_PLANS, getStripePlan, type PlanId } from "./plans";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY fehlt in den Environment Variables.");
  return new Stripe(key);
}

export function getAppUrl(origin?: string | null) {
  return process.env.NEXT_PUBLIC_SITE_URL || origin || "https://originincome.com";
}
