export type AssessmentAnswer = string | string[] | number;
export type AssessmentAnswers = Record<number, AssessmentAnswer>;

export type BusinessModelId =
  | "ai-automation-agency"
  | "airbnb-business"
  | "social-media-agency"
  | "ecommerce-brand"
  | "digital-products"
  | "ai-webdesign"
  | "lead-generation-agency";

export type MatchResult = {
  id: BusinessModelId;
  name: string;
  shortName: string;
  score: number;
  category: string;
  icon: string;
  tagline: string;
  why: string[];
  challenge: string;
  startBudget: string;
  weeklyTime: string;
  firstRevenue: string;
  scalability: string;
  difficulty: "Einfach" | "Mittel" | "Anspruchsvoll";
  accent: string;
  modules: string[];
};

type ModelDefinition = Omit<MatchResult, "score" | "why" | "challenge"> & {
  base: number;
  defaultWhy: string[];
  defaultChallenge: string;
};

export const BUSINESS_MODELS: ModelDefinition[] = [
  {
    id: "ai-automation-agency", name: "AI Automation Agency", shortName: "AI Automation", category: "B2B · KI · Service", icon: "✦",
    tagline: "Automatisiere repetitive Prozesse für Unternehmen und verkaufe messbare Effizienz.", base: 34,
    startBudget: "CHF 300–2’000", weeklyTime: "5–12 Std.", firstRevenue: "2–8 Wochen", scalability: "Sehr hoch", difficulty: "Anspruchsvoll", accent: "AUTOMATION",
    defaultWhy: ["Hoher Kundennutzen durch klar messbare Zeit- und Kosteneinsparungen.", "Als Service schnell validierbar und später stark standardisierbar.", "Passt besonders gut zu digitalen, analytischen und lösungsorientierten Profilen."],
    defaultChallenge: "Du musst Kundenprozesse wirklich verstehen und Automationen zuverlässig umsetzen.",
    modules: ["Nische & Automationsproblem", "AI-Toolstack aufsetzen", "Angebot & Pricing", "Demo-Automationen bauen", "B2B-Kunden gewinnen", "Delivery & Qualität", "Produktisieren & skalieren"]
  },
  {
    id: "airbnb-business", name: "Airbnb Business", shortName: "Airbnb", category: "Hospitality · Lokal · Assets", icon: "⌂",
    tagline: "Baue ein profitables Kurzzeitvermietungsmodell mit klarer Positionierung und starken Abläufen.", base: 26,
    startBudget: "CHF 2’000–10’000+", weeklyTime: "5–15 Std.", firstRevenue: "1–4 Monate", scalability: "Hoch", difficulty: "Anspruchsvoll", accent: "HOSPITALITY",
    defaultWhy: ["Verbindet operative Umsetzung mit einem greifbaren, realen Kundenerlebnis.", "Kann über Co-Hosting oder Management auch ohne eigene Immobilie gestartet werden.", "Geeignet für strukturierte Menschen mit Service- und Organisationsstärke."],
    defaultChallenge: "Standort, Regulierung, Auslastung und operative Qualität entscheiden stark über den Erfolg.",
    modules: ["Modell & Standort wählen", "Objekte & Partner finden", "Positionierung & Listing", "Pricing & Auslastung", "Gäste-Kommunikation", "Reinigung & Prozesse", "Portfolio skalieren"]
  },
  {
    id: "social-media-agency", name: "Social Media Agency", shortName: "Social Media", category: "Marketing · Content · Service", icon: "◎",
    tagline: "Hilf Unternehmen, sichtbar zu werden, Content zu produzieren und Kunden über Social Media zu gewinnen.", base: 32,
    startBudget: "Unter CHF 500", weeklyTime: "5–12 Std.", firstRevenue: "2–6 Wochen", scalability: "Hoch", difficulty: "Mittel", accent: "CONTENT",
    defaultWhy: ["Niedrige Einstiegskosten und schnelle Validierung über direkte Kundenakquise.", "Stark für kommunikative, kreative und marketingaffine Profile.", "Lässt sich mit Vorlagen, KI und Freelancern zunehmend systematisieren."],
    defaultChallenge: "Du brauchst konstant gute Resultate und musst dich klar von austauschbaren Agenturen abheben.",
    modules: ["Nische & Positionierung", "Content-System entwickeln", "Angebot & Pakete", "Referenzen aufbauen", "Kundenakquise", "Reporting & Retention", "Team & Skalierung"]
  },
  {
    id: "ecommerce-brand", name: "E-Commerce Brand", shortName: "E-Commerce", category: "Produkte · Marke · Commerce", icon: "◇",
    tagline: "Entwickle eine fokussierte Marke rund um ein Produkt mit echter Nachfrage und Wiederkaufswert.", base: 27,
    startBudget: "CHF 2’000–10’000+", weeklyTime: "8–20 Std.", firstRevenue: "2–6 Monate", scalability: "Sehr hoch", difficulty: "Anspruchsvoll", accent: "COMMERCE",
    defaultWhy: ["Bietet langfristig hohen Marken- und Unternehmenswert.", "Passt zu ambitionierten Profilen mit Kapital, Geduld und Markeninteresse.", "Kann über Produkte, Bundles und Wiederkäufe stark wachsen."],
    defaultChallenge: "Produktwahl, Marge, Logistik und bezahlte Reichweite müssen gemeinsam funktionieren.",
    modules: ["Markt & Produktchance", "Brand & Positionierung", "Lieferanten & Kalkulation", "Shop & Conversion", "Content & Launch", "Ads & Optimierung", "Sortiment & Skalierung"]
  },
  {
    id: "digital-products", name: "Digital Products", shortName: "Digital Products", category: "Wissen · Assets · Skalierung", icon: "▱",
    tagline: "Verwandle Know-how, Vorlagen oder Systeme in digitale Produkte mit hoher Marge.", base: 31,
    startBudget: "Unter CHF 500", weeklyTime: "3–10 Std.", firstRevenue: "1–3 Monate", scalability: "Sehr hoch", difficulty: "Mittel", accent: "DIGITAL",
    defaultWhy: ["Sehr niedrige laufende Kosten und hohe Margen.", "Ideal für strukturierte Profile, die Wissen in klare Systeme übersetzen können.", "Kann auch ohne tägliche persönliche Kamera-Präsenz aufgebaut werden."],
    defaultChallenge: "Das Produkt braucht ein konkretes Problem und einen verlässlichen Kanal für Reichweite oder Vertrieb.",
    modules: ["Problem & Zielgruppe", "Produktidee validieren", "Produkt erstellen", "Brand & Verkaufsseite", "Launch-System", "Evergreen Marketing", "Portfolio skalieren"]
  },
  {
    id: "ai-webdesign", name: "Webdesign mit KI", shortName: "AI Webdesign", category: "Design · KI · Service", icon: "⌘",
    tagline: "Erstelle hochwertige Websites schneller mit KI und verkaufe ein klares Premium-Ergebnis.", base: 35,
    startBudget: "Unter CHF 500", weeklyTime: "5–10 Std.", firstRevenue: "2–6 Wochen", scalability: "Hoch", difficulty: "Mittel", accent: "WEB",
    defaultWhy: ["Schneller Weg zu einem sichtbaren Ergebnis und einem klaren Kundennutzen.", "Niedriger Kapitalbedarf bei attraktiven Projektmargen.", "KI reduziert technische Hürden und beschleunigt Delivery und Content."],
    defaultChallenge: "Du brauchst überzeugende Demos und einen konstanten Prozess für Kundengewinnung.",
    modules: ["Nische & Angebot", "KI-Webstack", "Demo-Projekte", "Pricing & Pakete", "Kunden gewinnen", "Projekte liefern", "Retainer & Skalierung"]
  },
  {
    id: "lead-generation-agency", name: "Lead Generation Agency", shortName: "Lead Generation", category: "B2B · Vertrieb · Performance", icon: "↗",
    tagline: "Liefere Unternehmen qualifizierte Anfragen und werde direkt am messbaren Wachstum bezahlt.", base: 34,
    startBudget: "CHF 300–2’000", weeklyTime: "5–12 Std.", firstRevenue: "2–6 Wochen", scalability: "Sehr hoch", difficulty: "Mittel", accent: "GROWTH",
    defaultWhy: ["Sehr klarer, messbarer Kundennutzen: mehr qualifizierte Gespräche und Umsatzchancen.", "Stark für vertriebsorientierte und konsequente Profile.", "Kann mit Outreach, Daten und Automationen standardisiert werden."],
    defaultChallenge: "Lead-Qualität und Kundenerwartungen müssen von Beginn an sauber definiert werden.",
    modules: ["Nische & Offer", "Lead-System wählen", "Daten & Infrastruktur", "Outreach-Kampagnen", "Sales & Onboarding", "Qualität & Reporting", "Team & Skalierung"]
  }
];

function has(value: AssessmentAnswer | undefined, term: string) {
  if (Array.isArray(value)) return value.some(v => v.includes(term));
  return String(value ?? "").includes(term);
}
function num(value: AssessmentAnswer | undefined, fallback = 5) { return typeof value === "number" ? value : fallback; }

export function calculateMatches(a: AssessmentAnswers): MatchResult[] {
  const scores = Object.fromEntries(BUSINESS_MODELS.map(m => [m.id, m.base])) as Record<BusinessModelId, number>;
  const reasons = Object.fromEntries(BUSINESS_MODELS.map(m => [m.id, [] as string[]])) as Record<BusinessModelId, string[]>;
  const add = (ids: BusinessModelId[], points: number, reason?: string) => ids.forEach(id => { scores[id] += points; if (reason && !reasons[id].includes(reason)) reasons[id].push(reason); });

  // Kapital
  if (has(a[1], "Unter CHF 500")) add(["ai-webdesign","digital-products","social-media-agency","lead-generation-agency"], 11, "Dein gewünschter niedriger Kapitaleinsatz passt sehr gut zu diesem Modell.");
  if (has(a[1], "500–2’000")) add(["ai-automation-agency","lead-generation-agency","ai-webdesign","social-media-agency"], 10, "Dein Startbudget reicht für einen professionellen, schlanken Markteintritt.");
  if (has(a[1], "2’000–10’000")) add(["ecommerce-brand","airbnb-business","ai-automation-agency"], 11, "Dein Budget eröffnet dir einen substanzielleren und skalierbaren Aufbau.");
  if (has(a[1], "Über CHF 10’000")) add(["ecommerce-brand","airbnb-business"], 14, "Dein Kapital erlaubt dir, ein asset- und markenorientiertes Modell seriös aufzubauen.");

  // Zeit
  if (has(a[2], "Unter 3")) add(["digital-products"], 10, "Das Modell lässt sich besonders gut in kleinen, fokussierten Zeitfenstern aufbauen.");
  if (has(a[2], "3–5")) add(["digital-products","ai-webdesign","lead-generation-agency"], 8, "Das Modell ist mit deinem wöchentlichen Zeitfenster realistisch umsetzbar.");
  if (has(a[2], "5–10")) add(["ai-webdesign","lead-generation-agency","social-media-agency","ai-automation-agency"], 10, "Deine verfügbare Zeit reicht für Akquise und professionelle Umsetzung.");
  if (has(a[2], "10–20") || has(a[2], "Über 20")) add(["ecommerce-brand","airbnb-business","ai-automation-agency","social-media-agency"], 12, "Dein hoher Zeiteinsatz gibt dir einen echten Umsetzungsvorteil.");

  // Skalierung und Geschwindigkeit
  const scaling = num(a[6]);
  if (scaling >= 8) add(["ecommerce-brand","digital-products","ai-automation-agency","lead-generation-agency"], 8, "Dein hoher Skalierungsanspruch passt zur langfristigen Hebelwirkung dieses Modells.");
  if (has(a[7], "Innerhalb 1 Monat")) add(["ai-webdesign","lead-generation-agency","social-media-agency"], 13, "Dein Wunsch nach schnellem Umsatz spricht für ein direkt verkaufbares B2B-Angebot.");
  if (has(a[7], "1–3 Monate")) add(["ai-webdesign","lead-generation-agency","social-media-agency","digital-products","ai-automation-agency"], 9, "Dieses Modell kann in deinem gewünschten Zeitfenster realistisch validiert werden.");
  if (has(a[7], "3–6 Monate") || has(a[7], "langfristig")) add(["ecommerce-brand","airbnb-business","digital-products"], 9, "Deine Geduld unterstützt einen nachhaltigen Aufbau mit höherem Langzeitwert.");

  // Stärken
  const sales = num(a[8]);
  if (sales >= 7) add(["lead-generation-agency","social-media-agency","ai-webdesign","ai-automation-agency"], 10, "Deine Vertriebsstärke ist ein klarer Wettbewerbsvorteil in diesem Modell.");
  const tech = num(a[9]);
  if (tech >= 7) add(["ai-automation-agency","ai-webdesign","digital-products"], 11, "Deine digitale Stärke verkürzt die Lernkurve und erhöht deine Umsetzungsgeschwindigkeit.");
  if (tech <= 4) add(["social-media-agency","lead-generation-agency","airbnb-business"], 5, "Das Modell kann mit überschaubarem technischem Einstieg gestartet werden.");
  if (has(a[10], "Verkauf") || has(a[10], "Beratung")) add(["lead-generation-agency","ai-webdesign","ai-automation-agency","social-media-agency"], 9, "Deine vorhandene Verkaufs- oder Beratungserfahrung passt direkt zum Kundengeschäft.");
  if (has(a[10], "Marketing") || has(a[10], "Social Media")) add(["social-media-agency","lead-generation-agency","ecommerce-brand","digital-products"], 9, "Deine Marketing-Erfahrung ist für Nachfrage, Content und Kundengewinnung besonders wertvoll.");
  if (has(a[10], "Design")) add(["ai-webdesign","ecommerce-brand","social-media-agency"], 9, "Dein Designverständnis stärkt Angebot, Marke und visuelle Qualität.");
  if (has(a[10], "Programmierung")) add(["ai-automation-agency","ai-webdesign"], 10, "Dein technischer Hintergrund schafft einen deutlichen Vorsprung bei Umsetzung und Qualität.");
  if (has(a[10], "Finanzen")) add(["airbnb-business","ecommerce-brand","lead-generation-agency"], 5, "Dein Zahlenverständnis hilft dir bei Kalkulation, Performance und Wachstum.");

  // Präferenzen
  if (has(a[12], "Menschen")) add(["social-media-agency","lead-generation-agency","airbnb-business","ai-webdesign"], 7, "Du arbeitest gerne mit Menschen – das passt zum direkten Kundenkontakt dieses Modells.");
  if (has(a[12], "Systeme")) add(["ai-automation-agency","digital-products","ecommerce-brand"], 8, "Deine Vorliebe für Systeme passt zu einem prozess- und assetorientierten Aufbau.");
  if (has(a[13], "Ja, sehr gerne") || has(a[13], "Teilweise")) add(["social-media-agency","digital-products","ecommerce-brand"], 6, "Deine Bereitschaft zur Sichtbarkeit kann Vertrauen und Reichweite schneller aufbauen.");
  if (has(a[13], "Lieber nicht")) add(["ai-automation-agency","ai-webdesign","lead-generation-agency","digital-products"], 7, "Dieses Modell lässt sich stark aufbauen, ohne dass du permanent selbst vor der Kamera stehen musst.");
  if (has(a[14], "Premium-Dienstleistung")) add(["ai-webdesign","ai-automation-agency","lead-generation-agency","social-media-agency"], 13, "Deine spontane Präferenz für eine Premium-Dienstleistung bestätigt die Passung.");
  if (has(a[14], "Digitales Produkt")) add(["digital-products"], 16, "Deine klare Präferenz für digitale Produkte ist ein starkes Match-Signal.");
  if (has(a[14], "E-Commerce")) add(["ecommerce-brand"], 18, "Deine klare Präferenz für E-Commerce ist ein starkes Match-Signal.");
  if (has(a[14], "Content")) add(["social-media-agency","digital-products","ecommerce-brand"], 12, "Dein Interesse an Content und Community passt direkt zu diesem Wachstumsmodell.");
  if (has(a[14], "Software") || has(a[14], "KI")) add(["ai-automation-agency","ai-webdesign"], 15, "Dein Interesse an Software und KI ist ein besonders starkes Signal für dieses Modell.");
  if (has(a[15], "Komplett online") || has(a[15], "Überwiegend online")) add(["ai-automation-agency","social-media-agency","ecommerce-brand","digital-products","ai-webdesign","lead-generation-agency"], 6, "Das Modell erfüllt deinen Wunsch nach einem überwiegend digitalen Business.");
  if (has(a[15], "Lokal") || has(a[15], "Hybrid")) add(["airbnb-business","social-media-agency","ai-webdesign"], 7, "Das Modell lässt sich gut mit lokalen Beziehungen und digitaler Umsetzung verbinden.");

  // Persönlichkeit und Hauptziel
  const risk = num(a[16]);
  if (risk >= 7) add(["ecommerce-brand","airbnb-business","ai-automation-agency"], 7, "Deine Risikobereitschaft passt zu einem Modell mit höherem Aufbau- und Wachstumspotenzial.");
  if (risk <= 4) add(["digital-products","ai-webdesign","lead-generation-agency"], 7, "Das Modell lässt sich kontrolliert und mit kleinen Tests validieren.");
  if (has(a[17], "Technisches Wissen")) add(["ai-webdesign","social-media-agency","lead-generation-agency"], 3, "Die Roadmap kann deine technische Hürde mit klaren Tools und Vorlagen reduzieren.");
  if (has(a[19], "Schnell erste Umsätze")) add(["ai-webdesign","lead-generation-agency","social-media-agency","ai-automation-agency"], 12, "Dein Fokus auf schnellen Cashflow spricht für ein direkt verkaufbares Service-Modell.");
  if (has(a[19], "Ausgewogene")) add(["ai-automation-agency","digital-products","ai-webdesign","lead-generation-agency"], 8, "Dieses Modell verbindet frühe Validierung mit langfristiger Skalierbarkeit.");
  if (has(a[19], "Langzeitwert")) add(["ecommerce-brand","digital-products","airbnb-business","ai-automation-agency"], 12, "Dein Fokus auf Unternehmenswert passt zu einem Modell, das echte Assets und Systeme aufbaut.");

  const ranked = BUSINESS_MODELS.map(model => ({ model, raw: scores[model.id] })).sort((x,y)=>y.raw-x.raw);
  const max = ranked[0]?.raw || 100;
  return ranked.slice(0,3).map(({model,raw}, index) => {
    const normalized = Math.max(72, Math.min(97, Math.round(84 + ((raw / max) * 13) - index * 3)));
    const why = [...reasons[model.id], ...model.defaultWhy].filter((v,i,arr)=>arr.indexOf(v)===i).slice(0,3);
    return { ...model, score: normalized, why, challenge: model.defaultChallenge };
  });
}

export function getBusinessModel(id: string | null | undefined) {
  return BUSINESS_MODELS.find(model => model.id === id);
}
