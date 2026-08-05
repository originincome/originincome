export type JourneyPhase = {
  n: number;
  eyebrow: string;
  title: string;
  promise: string;
  lessons: string[];
  tasks: string[];
  deliverable: string;
  tools: string[];
};

export type JourneyDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  storageKey: string;
  phases: JourneyPhase[];
};

const aiAutomation: JourneyDefinition = {
  slug: "ai-automation-agency",
  title: "AI Automation Agency",
  shortTitle: "AI Automation\nAgency",
  storageKey: "origin_ai_automation_progress",
  phases: [
    {n:1,eyebrow:"FOUNDATION",title:"Fundament & Positionierung",promise:"Definiere eine klare Nische, ein konkretes Problem und ein Angebot, das Unternehmen sofort verstehen.",lessons:["Was eine AI Automation Agency wirklich verkauft","Die richtige Nische statt ‘KI für alle’","Probleme mit messbarem Business-Impact finden","Dein erstes klar formuliertes Automation-Angebot"],tasks:["Wähle 1 Zielbranche","Notiere 5 wiederkehrende Prozesse dieser Branche","Bewerte jeden Prozess nach Zeitersparnis, Umsatzhebel und Umsetzbarkeit","Formuliere dein erstes Angebot in einem Satz"],deliverable:"Deine Positionierung + erstes Kernangebot",tools:["ChatGPT","Notion","Google Sheets"]},
    {n:2,eyebrow:"OFFER",title:"Angebot & Zielkunde",promise:"Baue aus deiner Positionierung ein kaufbares Paket mit klarem Ergebnis, Preislogik und idealem Kundenprofil.",lessons:["Ideal Customer Profile","Outcome statt Technik verkaufen","Pilot, Setup Fee und Retainer","Risiko für den ersten Kunden reduzieren"],tasks:["Erstelle dein ICP","Definiere 3 messbare Outcomes","Baue Starter-Angebot und Premium-Angebot","Lege Pilotpreis und Zielpreis fest"],deliverable:"Verkaufsfähiges Angebot + ICP",tools:["Origin Templates","ChatGPT","Canva"]},
    {n:3,eyebrow:"SYSTEM",title:"Automation Stack & KI-Tools",promise:"Baue einen schlanken Tech-Stack und deine erste funktionierende Automation ohne unnötige Tool-Kosten.",lessons:["Trigger, Logik, Aktion – das Grundprinzip","Make vs. Zapier vs. n8n","LLMs sinnvoll integrieren","Datenschutz und menschliche Kontrolle"],tasks:["Wähle deinen Automation-Stack","Baue einen Test-Workflow","Füge Fehlerbehandlung hinzu","Dokumentiere Input, Output und Nutzen"],deliverable:"1 funktionierende Demo-Automation",tools:["Make","n8n","OpenAI API","Airtable"]},
    {n:4,eyebrow:"PROOF",title:"Demo-System & Portfolio",promise:"Verwandle Technik in sichtbaren Business-Nutzen, den ein Interessent in wenigen Minuten versteht.",lessons:["Demo statt leere Versprechen","Vorher/Nachher visualisieren","Loom-Demo strukturieren","Case Study ohne Fake-Resultate"],tasks:["Erstelle eine Branchen-Demo","Nimm ein 2–4 Min. Demo-Video auf","Erstelle eine One-Page Case Study","Baue deinen Demo-Link"],deliverable:"Portfolio-Demo + Case Study",tools:["Loom","Canva","Notion","Vercel"]},
    {n:5,eyebrow:"ACQUISITION",title:"Leads & Kundengewinnung",promise:"Starte ein tägliches Akquise-System, das relevante Unternehmen erreicht statt wahllos Nachrichten zu senden.",lessons:["Leadlisten mit Kaufwahrscheinlichkeit","Personalisierte Cold Outreach","LinkedIn, E-Mail und Telefon kombinieren","Follow-up als System"],tasks:["Baue eine Liste mit 50 Zielkunden","Erstelle 2 Outreach-Skripte","Kontaktiere die ersten 10 Leads","Plane 3 Follow-ups pro Lead"],deliverable:"Aktive Pipeline mit ersten Gesprächen",tools:["LinkedIn","Google Maps","Apollo optional","Gmail"]},
    {n:6,eyebrow:"SALES & DELIVERY",title:"Verkauf, Preise & Delivery",promise:"Führe Discovery Calls, schliesse sauber ab und liefere dein Projekt mit professionellem Scope.",lessons:["Discovery statt Pitch-Marathon","ROI und Preis argumentieren","Scope und Change Requests","Onboarding, Test und Übergabe"],tasks:["Erstelle Discovery-Fragen","Baue dein Angebotstemplate","Definiere Delivery-Meilensteine","Erstelle Kunden-Onboarding"],deliverable:"Kompletter Sales- & Delivery-Prozess",tools:["Google Meet","Stripe","Notion","DocuSign optional"]},
    {n:7,eyebrow:"SCALE",title:"Retainer, Prozesse & Skalierung",promise:"Mache aus Einzelprojekten wiederkehrende Umsätze und aus deiner Arbeit ein reproduzierbares System.",lessons:["Maintenance Retainer","Monitoring und Support","SOPs und Delegation","Von Service zu produktisiertem Angebot"],tasks:["Definiere 2 Retainer-Pakete","Erstelle Monitoring-Checkliste","Dokumentiere deine SOPs","Setze dein 90-Tage-Wachstumsziel"],deliverable:"Skalierbares Agency-Betriebssystem",tools:["Notion","Slack","Make/n8n","Stripe"]}
  ]
};

const leadGeneration: JourneyDefinition = {
  slug: "lead-generation-agency",
  title: "Lead Generation Agency",
  shortTitle: "Lead Generation\nAgency",
  storageKey: "origin_lead_generation_progress",
  phases: [
    {n:1,eyebrow:"POSITIONING",title:"Nische & Marktposition",promise:"Wähle einen Markt mit echtem Lead-Bedarf und positioniere dich als Ergebnisanbieter statt als Listenverkäufer.",lessons:["Was Unternehmen bei Lead Generation wirklich kaufen","Nischen mit hoher Abschlusswahrscheinlichkeit erkennen","Lead-Qualität vs. Lead-Menge","Eine klare Positionierung formulieren"],tasks:["Wähle 1 Kernnische","Analysiere 10 Unternehmen in dieser Nische","Notiere 5 typische Vertriebsprobleme","Formuliere deine Positionierung in einem Satz"],deliverable:"Klare Nische + scharfes Positionierungsstatement",tools:["Google Maps","LinkedIn","ChatGPT","Notion"]},
    {n:2,eyebrow:"OFFER",title:"Angebot & Preislogik",promise:"Entwickle ein Angebot, das qualifizierte Gespräche verkauft – mit transparentem Scope, Garantie-Logik und Preisstruktur.",lessons:["Pay-per-lead, Retainer oder Hybrid","Qualifizierte Leads sauber definieren","Risiko reduzieren ohne falsche Versprechen","Pilotangebot und Upsell-Struktur"],tasks:["Definiere einen qualifizierten Lead","Baue Starter-, Pro- und Performance-Angebot","Lege Pilotpreis und Zielpreis fest","Erstelle eine klare Leistungsbeschreibung"],deliverable:"Verkaufsfähiges Lead-Gen-Angebot",tools:["Origin Templates","Google Docs","Stripe","ChatGPT"]},
    {n:3,eyebrow:"DATA",title:"Lead-System & Datenqualität",promise:"Baue ein belastbares System für relevante Kontakte, saubere Daten und rechtssichere Recherche.",lessons:["ICP-Kriterien und Buying Signals","Datenquellen sinnvoll kombinieren","Datenqualität, Verifizierung und Dubletten","Datenschutz und verantwortungsvolle Nutzung"],tasks:["Definiere 8 ICP-Filter","Baue eine Testliste mit 50 Leads","Verifiziere E-Mails und Firmendaten","Dokumentiere deine Datenquellen"],deliverable:"Qualifizierte, verifizierte Test-Leadliste",tools:["Apollo optional","LinkedIn Sales Navigator","Hunter optional","Google Sheets"]},
    {n:4,eyebrow:"OUTREACH",title:"Outreach & Kampagnen",promise:"Erstelle personalisierte Kampagnen, die Gespräche auslösen statt Spam zu produzieren.",lessons:["Hooks, Relevanz und klare CTAs","Cold E-Mail, LinkedIn und Telefon kombinieren","Sequenzen und Follow-ups","Deliverability-Grundlagen"],tasks:["Schreibe 2 E-Mail-Sequenzen","Erstelle 2 LinkedIn-Nachrichten","Definiere 3 Follow-ups","Starte eine Kampagne mit 20 Leads"],deliverable:"Live-Kampagne mit messbarer Response",tools:["Gmail","Instantly optional","LinkedIn","Google Sheets"]},
    {n:5,eyebrow:"SALES",title:"Antworten, Qualifizierung & Termine",promise:"Verwandle Antworten systematisch in qualifizierte Termine und schütze deine Zeit vor unpassenden Leads.",lessons:["Positive Antworten schnell erkennen","Qualifizierungsfragen","Terminbuchung ohne Reibung","No-Shows reduzieren"],tasks:["Erstelle 6 Qualifizierungsfragen","Baue deinen Terminlink","Erstelle Antwortvorlagen","Definiere No-Show-Follow-up"],deliverable:"Qualifizierungs- und Terminprozess",tools:["Calendly optional","Google Calendar","Gmail","Notion"]},
    {n:6,eyebrow:"DELIVERY",title:"Kunden-Delivery & Reporting",promise:"Liefere transparent, messbar und professionell – damit Kunden Resultate verstehen und bleiben.",lessons:["Client Onboarding","Lead-Handover und CRM-Prozess","KPIs: Reply, Booking, Show und Close Rate","Reporting ohne Vanity Metrics"],tasks:["Erstelle Onboarding-Formular","Baue Lead-Handover-Prozess","Erstelle Wochenreport","Definiere Optimierungsrhythmus"],deliverable:"Professioneller Delivery- und Reporting-Prozess",tools:["Notion","HubSpot optional","Google Sheets","Loom"]},
    {n:7,eyebrow:"SCALE",title:"Retainer & Skalierung",promise:"Mache aus einzelnen Kampagnen ein wiederkehrendes Agenturmodell mit klaren SOPs und planbarem Wachstum.",lessons:["Retainer-Verlängerung","Performance-Boni sinnvoll nutzen","SOPs, QA und Delegation","Neue Nischen oder Upsells"],tasks:["Definiere 2 Retainer-Stufen","Erstelle QA-Checkliste","Dokumentiere deine Kern-SOPs","Plane dein 90-Tage-Akquise- und Delivery-Ziel"],deliverable:"Skalierbares Lead-Gen-Betriebssystem",tools:["Notion","Slack","Stripe","Make optional"]}
  ]
};

export const JOURNEYS: Record<string, JourneyDefinition> = {
  [aiAutomation.slug]: aiAutomation,
  [leadGeneration.slug]: leadGeneration,
};

export function getJourney(slug: string) {
  return JOURNEYS[slug] ?? null;
}
