export type PlanId = "starter" | "pro" | "elite";

export const STRIPE_PLANS: Record<PlanId, {
  id: PlanId;
  name: string;
  stripePriceId: string;
  price: number;
  currency: string;
  tagline: string;
  description: string;
  badge?: string;
  features: string[];
  limitations: string[];
}> = {
  starter: {
    id: "starter",
    name: "Origin Starter",
    stripePriceId: "price_1TyY9tJztu4qPBI0hYWvFy1n",
    price: 89,
    currency: "CHF",
    tagline: "Perfekt für deinen ersten Business-Aufbau.",
    description: "Dein persönliches Assessment, KI-Matchmaking und eine fokussierte Business Journey.",
    features: ["Persönliches Assessment", "KI-Matchmaking", "1 Business Journey", "7 Premium-Module", "Lifetime Updates"],
    limitations: ["Origin AI nicht enthalten", "Nur eine Journey"]
  },
  pro: {
    id: "pro",
    name: "Origin Pro",
    stripePriceId: "price_1TyYAzJztu4qPBI02qZus58F",
    price: 109,
    currency: "CHF",
    tagline: "Die beste Wahl für die meisten Mitglieder.",
    description: "Alles aus Starter plus Origin AI, Vorlagen, Prompts und Business-Tools.",
    badge: "Am beliebtesten",
    features: ["Alles aus Starter", "Origin AI", "Premium-Vorlagen", "KI-Prompts", "Sales- und Marketing-Skripte", "Business-Tools"],
    limitations: ["1 aktive Journey"]
  },
  elite: {
    id: "elite",
    name: "Origin Elite",
    stripePriceId: "price_1TyYCsJztu4qPBI0GAIQ8hmv",
    price: 129,
    currency: "CHF",
    tagline: "Für alle, die ohne Einschränkungen wachsen möchten.",
    description: "Vollzugriff auf alle Journeys, Origin AI und zukünftige Premium-Inhalte.",
    features: ["Alles aus Pro", "Alle Business Journeys", "Premium-Inhalte", "Zukünftige Erweiterungen", "Mehr Flexibilität", "Elite Roadmap"],
    limitations: []
  }
};

export function getStripePlan(plan: string | null | undefined) {
  if (!plan) return null;
  return STRIPE_PLANS[plan as PlanId] ?? null;
}
