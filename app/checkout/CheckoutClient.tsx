"use client";

import Link from "next/link";
import { useState } from "react";
import { STRIPE_PLANS, type PlanId } from "../../lib/stripe/plans";

const Icon = ({name}:{name:"check"|"star"|"diamond"|"spark"|"lock"|"arrow"|"shield"}) => {
  const paths={
    check:<path d="m5 12 4 4L19 6"/>,
    star:<path d="m12 3 2.4 5.7 6.1.5-4.6 4 1.4 6-5.3-3.1-5.3 3.1 1.4-6-4.6-4 6.1-.5L12 3Z"/>,
    diamond:<path d="M6 3h12l4 6-10 12L2 9l4-6Z"/>,
    spark:<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/>,
    lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    arrow:<path d="M5 12h14M13 6l6 6-6 6"/>,
    shield:<><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="m9 12 2 2 4-5"/></>
  } as const;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const comparisonRows = [
  ["Persönliches Assessment", true, true, true],
  ["KI-Matchmaking", true, true, true],
  ["1 Business Journey", true, true, false],
  ["Alle Business Journeys", false, false, true],
  ["7 Premium-Module", true, true, true],
  ["Origin AI", false, true, true],
  ["Premium-Vorlagen & Skripte", false, true, true],
  ["Lifetime Updates", true, true, true],
  ["Zukünftige Premium-Inhalte", false, false, true]
] as const;

export default function CheckoutClient({firstName,selectedModelName,selectedModelTagline}:{firstName:string;selectedModelName:string;selectedModelTagline:string}){
  const [loading,setLoading]=useState<PlanId|null>(null);
  const [error,setError]=useState("");
  const plans=Object.values(STRIPE_PLANS);

  async function startCheckout(plan:PlanId){
    setError(""); setLoading(plan);
    try{
      const res=await fetch("/api/stripe/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plan})});
      const data=await res.json();
      if(!res.ok||!data.url) throw new Error(data.error||"Checkout konnte nicht gestartet werden.");
      window.location.href=data.url;
    }catch(e){setError(e instanceof Error?e.message:"Checkout konnte nicht gestartet werden.");setLoading(null);}
  }

  return <main className="checkoutPage">
    <div className="checkoutGlow"/>
    <section className="checkoutHero">
      <Link href="/dashboard" className="checkoutBack">← Zurück zum Dashboard</Link>
      <div className="checkoutBadge"><Icon name="spark"/> ORIGIN ACCESS</div>
      <h1>{firstName}, deine Journey ist bereit.<br/><em>Schalte sie jetzt frei.</em></h1>
      <p>Dein gewähltes Modell <b>{selectedModelName}</b> wurde vorbereitet. Wähle jetzt dein Paket und starte mit deiner persönlichen Business Roadmap.</p>
      <div className="checkoutJourneyCard"><span>GEWÄHLTE JOURNEY</span><h2>{selectedModelName}</h2><p>{selectedModelTagline}</p></div>
    </section>

    <section className="pricingGrid" aria-label="Origin Income Pakete">
      {plans.map(plan=><article key={plan.id} className={`priceCard ${plan.id==="pro"?"featured":""}`}>
        {plan.badge&&<div className="popularBadge"><Icon name="star"/>{plan.badge}</div>}
        <div className="priceIcon">{plan.id==="starter"?"↗":plan.id==="pro"?"✦":"◆"}</div>
        <small>{plan.id.toUpperCase()}</small>
        <h2>{plan.name}</h2>
        <p>{plan.tagline}</p>
        <div className="price"><span>CHF</span><strong>{plan.price}</strong><small>einmalig</small></div>
        <ul>{plan.features.map(feature=><li key={feature}><Icon name="check"/>{feature}</li>)}</ul>
        {!!plan.limitations.length&&<div className="limitations">{plan.limitations.map(item=><span key={item}>{item}</span>)}</div>}
        <button onClick={()=>startCheckout(plan.id)} disabled={!!loading}>{loading===plan.id?"Stripe wird vorbereitet…":"Jetzt freischalten"}<Icon name="arrow"/></button>
      </article>)}
    </section>

    {error&&<div className="checkoutError">{error}</div>}

    <section className="comparisonSection">
      <div className="comparisonIntro"><small>PAKETVERGLEICH</small><h2>Klare Unterschiede. Keine versteckten Umwege.</h2><p>Origin Pro ist für die meisten Mitglieder die beste Wahl, weil es die Business Journey mit Origin AI und den wichtigsten Vorlagen verbindet.</p></div>
      <div className="comparisonTable"><div className="comparisonHeader"><span>Feature</span><b>Starter</b><b className="gold">Pro</b><b>Elite</b></div>{comparisonRows.map(row=><div className="comparisonRow" key={row[0]}><span>{row[0]}</span><i>{row[1]?"✓":"—"}</i><i className="gold">{row[2]?"✓":"—"}</i><i>{row[3]?"✓":"—"}</i></div>)}</div>
    </section>

    <section className="checkoutTrust">
      <article><Icon name="shield"/><h3>Sicherer Checkout</h3><p>Die Zahlung läuft über Stripe. Deine Zahlungsdaten werden nicht auf Origin Income gespeichert.</p></article>
      <article><Icon name="lock"/><h3>Zugang nach Zahlung</h3><p>Nach erfolgreicher Zahlung wird deine Journey vorbereitet und der Zugriff schrittweise freigeschaltet.</p></article>
      <article><Icon name="spark"/><h3>Premium-Erlebnis</h3><p>Nach dem Checkout erscheint deine persönliche Einrichtungssequenz für Journey, Module und Origin AI.</p></article>
    </section>

    <section className="checkoutFaq">
      <small>FAQ</small><h2>Bevor du startest.</h2>
      <details open><summary>Was bekomme ich direkt nach dem Kauf?</summary><p>Du erhältst Zugriff auf deine gewählte Business Journey. Die vollständigen Modul-Inhalte und Origin AI werden in den nächsten Produktversionen erweitert und freigeschaltet.</p></details>
      <details><summary>Warum gibt es drei Pakete?</summary><p>Starter ist fokussiert, Pro enthält zusätzlich Origin AI und Vorlagen, Elite bietet Zugriff auf alle Journeys und zukünftige Premium-Inhalte.</p></details>
      <details><summary>Kann ich später upgraden?</summary><p>Ja. Die technische Upgrade-Logik wird nach dem ersten Launch ergänzt. Für den Testmodus prüfen wir zuerst den vollständigen Zahlungsfluss.</p></details>
    </section>
  </main>;
}
