"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { JourneyDefinition } from "../../../lib/journeys";

export default function JourneyClient({ firstName, plan, journey }: { firstName: string; plan: string; journey: JourneyDefinition }) {
  const phases = journey.phases;
  const key = journey.storageKey;
  const [active, setActive] = useState(1);
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const x = JSON.parse(localStorage.getItem(key) || "{}");
      setDone(x.done || {});
      setActive(x.active || 1);
    } catch {}
  }, [key]);

  const completed = Object.values(done).filter(Boolean).length;
  const total = phases.reduce((a, p) => a + p.tasks.length, 0);
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const phase = phases[active - 1];
  const phaseDone = phase.tasks.every((_, i) => done[`${active}-${i}`]);
  const openCount = phase.tasks.length - phase.tasks.filter((_, i) => done[`${active}-${i}`]).length;

  function persist(nextDone: Record<string, boolean>, nextActive: number) {
    localStorage.setItem(key, JSON.stringify({ done: nextDone, active: nextActive }));
  }

  function toggle(i: number) {
    const next = { ...done, [`${active}-${i}`]: !done[`${active}-${i}`] };
    setDone(next);
    persist(next, active);
  }

  function open(n: number) {
    setActive(n);
    persist(done, n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="journeyShell">
      <aside className="journeySide">
        <Link href="/dashboard" className="journeyLogo"><span>O</span> ORIGIN <b>INCOME</b></Link>
        <div className="journeySideLabel">BUSINESS JOURNEY</div>
        <h2>{journey.shortTitle.split("\n").map((line, i) => <span key={line}>{line}{i === 0 && <br/>}</span>)}</h2>
        <div className="journeyProgress"><div><span>Gesamtfortschritt</span><b>{pct}%</b></div><i><em style={{width:`${pct}%`}}/></i><small>{completed} von {total} Aufgaben abgeschlossen</small></div>
        <nav>{phases.map(p => { const count = p.tasks.filter((_, i) => done[`${p.n}-${i}`]).length; return <button key={p.n} className={active === p.n ? "active" : ""} onClick={() => open(p.n)}><span>{String(p.n).padStart(2,"0")}</span><div><small>{p.eyebrow}</small><b>{p.title}</b></div><em>{count}/{p.tasks.length}</em></button>; })}</nav>
        <Link href="/dashboard" className="journeyBack">← Zurück zum Dashboard</Link>
      </aside>

      <section className="journeyMain">
        <header><div><span className="journeyLive"/> JOURNEY ACTIVE · {plan.toUpperCase()}</div><span>{firstName} · Phase {active} / 7</span></header>
        <div className="journeyContent">
          <div className="journeyHero"><div><small>PHASE {String(active).padStart(2,"0")} · {phase.eyebrow}</small><h1>{phase.title}</h1><p>{phase.promise}</p></div><div className="journeyScore"><strong>{phase.tasks.filter((_,i)=>done[`${active}-${i}`]).length}/{phase.tasks.length}</strong><span>AUFGABEN</span></div></div>

          <div className="journeyGrid">
            <article className="journeyCard"><div className="journeyCardHead"><span>01</span><div><small>WISSEN</small><h3>Was du in dieser Phase lernst</h3></div></div><div className="lessonList">{phase.lessons.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><p>{x}</p><b>→</b></div>)}</div></article>
            <article className="journeyCard taskCard"><div className="journeyCardHead"><span>02</span><div><small>EXECUTION</small><h3>Deine Aufgaben</h3></div></div><p className="taskIntro">Nicht nur lesen. Umsetzen. Hake jede Aufgabe erst ab, wenn sie wirklich erledigt ist.</p><div className="journeyTasks">{phase.tasks.map((x,i)=><button key={x} className={done[`${active}-${i}`]?"done":""} onClick={()=>toggle(i)}><i>{done[`${active}-${i}`]?"✓":""}</i><span><small>AUFGABE {i+1}</small>{x}</span></button>)}</div></article>
          </div>

          <div className="journeyBottom"><article><small>DEIN ERGEBNIS</small><h3>{phase.deliverable}</h3><p>Am Ende dieser Phase besitzt du ein konkretes Asset für den nächsten Schritt – nicht nur Theorie.</p></article><article><small>EMPFOHLENER STACK</small><div className="toolPills">{phase.tools.map(t=><span key={t}>{t}</span>)}</div><p>Origin AI wird später direkt in dieser Journey neben deinen Aufgaben verfügbar sein.</p></article></div>

          <div className="journeyNext"><div>{phaseDone?<><span>✓ PHASE BEREIT</span><b>Alle Aufgaben dieser Phase sind erledigt.</b></>:<><span>DEIN NÄCHSTER SCHRITT</span><b>Schliesse die {openCount} offenen Aufgaben ab.</b></>}</div>{active<7?<button disabled={!phaseDone} onClick={()=>open(active+1)}>Phase {active+1} starten →</button>:<button disabled={!phaseDone}>Journey abschliessen ✓</button>}</div>
        </div>
      </section>
    </main>
  );
}
