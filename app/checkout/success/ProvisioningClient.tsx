"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const steps = [
  "Zahlung wird kryptografisch bestätigt",
  "Business Journey wird vorbereitet",
  "Roadmap wird personalisiert",
  "Module werden freigeschaltet",
  "Origin AI wird konfiguriert",
];

export default function ProvisioningClient({ sessionId, firstName }: { sessionId: string; firstName: string }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const progress = useMemo(() => ready ? 100 : Math.min(92, 12 + activeStep * 18 + attempts * 2), [ready, activeStep, attempts]);

  useEffect(() => {
    const animation = window.setInterval(() => setActiveStep(v => Math.min(steps.length - 1, v + 1)), 1150);
    return () => window.clearInterval(animation);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const response = await fetch(`/api/stripe/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Status request failed");
        const data = await response.json();
        if (cancelled) return;
        if (data.ready) {
          setReady(true);
          setActiveStep(steps.length - 1);
          return;
        }
        setAttempts(v => v + 1);
      } catch {
        if (!cancelled) setAttempts(v => v + 1);
      }
    }
    poll();
    const timer = window.setInterval(poll, 1500);
    const timeout = window.setTimeout(() => { if (!ready) setFailed(true); }, 30000);
    return () => { cancelled = true; window.clearInterval(timer); window.clearTimeout(timeout); };
  }, [sessionId, ready]);

  return <main className="provisionPage"><div className="provisionGlow"/><section className="provisionCard provisionV89">
    <div className="provisionLogo">↗</div>
    <small>{ready ? "ACCESS ACTIVATED" : "SECURE PROVISIONING"}</small>
    <h1>{ready ? `Willkommen, ${firstName}.` : "Deine Journey wird eingerichtet."}</h1>
    <p>{ready ? "Deine Zahlung wurde bestätigt und dein Zugang ist aktiv. Deine persönliche Business Journey wartet auf dich." : "Stripe und Origin Income synchronisieren deinen Kauf sicher im Hintergrund. Bitte schliesse dieses Fenster noch nicht."}</p>
    <div className="provisionSteps">{steps.map((step, index) => <span key={step} className={ready || index <= activeStep ? "done" : ""}><i/>{step}</span>)}</div>
    <div className="provisionBar"><b style={{ width: `${progress}%` }}/></div>
    <div className="provisionPercent">{progress}%</div>
    {ready ? <Link className="provisionButton" href="/dashboard">Business starten →</Link> : failed ? <div className="provisionPending"><b>Die Bestätigung dauert länger als erwartet.</b><span>Deine Zahlung ist nicht verloren. Öffne dein Dashboard in einigen Sekunden erneut.</span><Link href="/dashboard">Zum Dashboard →</Link></div> : <span className="provisionWait">Sichere Zahlungsbestätigung läuft…</span>}
  </section></main>;
}
