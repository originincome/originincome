"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { JourneyDefinition } from "../../../lib/journeys";
import { loadBusinessDNA, saveBusinessDNA, upsertVaultAsset } from "../../../lib/vault";

type VaultItem = { id:string; title:string; type:string; status:"ready"|"planned"; phase:number };
type MissionDraft = {
  niche:string;
  customNiche:string;
  demand:number;
  budget:number;
  reachability:number;
  companies:string;
  problems:string;
  targetGroup:string;
  coreProblem:string;
  outcome:string;
  differentiator:string;
};

const missionMeta: Record<string, Array<{duration:string;difficulty:string;milestone:string;incomeFocus:string;vault:string[]}>> = {
  "ai-automation-agency": [
    {duration:"45–60 Min.",difficulty:"Fokus",milestone:"Positionierung steht",incomeFocus:"Ein Angebot definieren, das ein reales Kosten- oder Umsatzproblem löst.",vault:["Positionierungs-Canvas","Kernangebot-Briefing"]},
    {duration:"50–70 Min.",difficulty:"Mittel",milestone:"Angebot verkaufsbereit",incomeFocus:"Ein Paket bauen, dessen Nutzen sich in Geld, Zeit oder Risiko übersetzen lässt.",vault:["ICP-Profil","Angebots-Blueprint","Preislogik"]},
    {duration:"60–90 Min.",difficulty:"Hands-on",milestone:"Erste Automation live",incomeFocus:"Eine Demo bauen, die später als Proof im Verkauf eingesetzt werden kann.",vault:["Automation-Spezifikation","Demo-Workflow"]},
    {duration:"45–75 Min.",difficulty:"Kreativ",milestone:"Proof vorhanden",incomeFocus:"Interessenten zeigen, was du konkret verbesserst – statt KI nur zu erklären.",vault:["Case-Study-Struktur","Demo-Skript"]},
    {duration:"60 Min.",difficulty:"Execution",milestone:"Pipeline gestartet",incomeFocus:"Erste relevante Gespräche erzeugen und dein Angebot am Markt validieren.",vault:["Lead-Kriterien","Outreach-Sequenz","Follow-up-Plan"]},
    {duration:"60–90 Min.",difficulty:"Sales",milestone:"Verkaufsprozess steht",incomeFocus:"Aus Interesse einen bezahlten Pilot oder ein Projekt machen.",vault:["Discovery-Guide","Angebotsstruktur","Delivery-Checkliste"]},
    {duration:"45–60 Min.",difficulty:"Strategisch",milestone:"Skalierung vorbereitet",incomeFocus:"Einmalige Projekte in planbarere wiederkehrende Einnahmen überführen.",vault:["Retainer-Blueprint","SOP-Liste","90-Tage-Plan"]},
  ],
  "lead-generation-agency": [
    {duration:"45–60 Min.",difficulty:"Fokus",milestone:"Nische definiert",incomeFocus:"Einen Markt wählen, in dem neue Kunden einen klaren wirtschaftlichen Wert haben.",vault:["Nischen-Scorecard","Positionierungs-Canvas"]},
    {duration:"45–70 Min.",difficulty:"Mittel",milestone:"Angebot steht",incomeFocus:"Ein Angebot formulieren, das Termine und qualifizierte Chancen verkauft – nicht Datensätze.",vault:["Lead-Definition","Angebots-Blueprint","Preislogik"]},
    {duration:"60–90 Min.",difficulty:"Hands-on",milestone:"Lead-System aufgebaut",incomeFocus:"Eine belastbare Datenbasis schaffen, mit der Outreach überhaupt profitabel getestet werden kann.",vault:["ICP-Filter","Lead-Qualitätscheck","Datenquellen-Plan"]},
    {duration:"60–90 Min.",difficulty:"Execution",milestone:"Kampagne live",incomeFocus:"Aus Daten echte Gespräche erzeugen – personalisiert, messbar und wiederholbar.",vault:["E-Mail-Sequenz","LinkedIn-Sequenz","Follow-up-Plan"]},
    {duration:"45–60 Min.",difficulty:"Sales",milestone:"Terminsystem steht",incomeFocus:"Positive Antworten konsequent in qualifizierte Calls umwandeln.",vault:["Qualifizierungsleitfaden","Antwortbibliothek","No-Show-Flow"]},
    {duration:"60 Min.",difficulty:"Delivery",milestone:"Kundenprozess steht",incomeFocus:"Resultate nachvollziehbar liefern, damit Kunden bleiben und verlängern.",vault:["Onboarding-Checkliste","KPI-Report","Handover-Prozess"]},
    {duration:"45–60 Min.",difficulty:"Strategisch",milestone:"Retainer vorbereitet",incomeFocus:"Aus Kampagnen einen planbaren Agenturumsatz mit klaren SOPs entwickeln.",vault:["Retainer-Blueprint","QA-Checkliste","90-Tage-Plan"]},
  ]
};

function metaFor(journey:JourneyDefinition, phase:number){
  return missionMeta[journey.slug]?.[phase-1] || {duration:"45–60 Min.",difficulty:"Fokus",milestone:"Business-Baustein fertig",incomeFocus:"Diese Mission bringt dich einen konkreten Schritt näher an ein marktfähiges Angebot.",vault:["Mission-Briefing","Ergebnis-Canvas"]};
}

const defaultDraft: MissionDraft = {niche:"",customNiche:"",demand:0,budget:0,reachability:0,companies:"",problems:"",targetGroup:"",coreProblem:"",outcome:"",differentiator:""};
const nicheOptions = ["Physiotherapie","Zahnarztpraxen","Immobilienmakler","Autogaragen","Treuhand / Steuerberatung","Fitnessstudios","Solar / Energie","B2B SaaS"];

export default function JourneyClient({ firstName, plan, journey }: { firstName: string; plan: string; journey: JourneyDefinition }) {
  const phases = journey.phases;
  const key = journey.storageKey;
  const [active, setActive] = useState(1);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [vaultOpen,setVaultOpen]=useState(false);
  const [celebrate,setCelebrate]=useState<number|null>(null);
  const [draft,setDraft]=useState<MissionDraft>(defaultDraft);

  useEffect(() => {
    try {
      const x = JSON.parse(localStorage.getItem(key) || "{}");
      setDone(x.done || {});
      setActive(x.active || 1);
      setDraft(JSON.parse(localStorage.getItem(`${key}_mission1_draft`) || "null") || defaultDraft);
    } catch {}
  }, [key]);

  const completed = Object.values(done).filter(Boolean).length;
  const total = phases.reduce((a, p) => a + p.tasks.length, 0);
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const businessScore = Math.min(100, Math.round(pct * .82 + ((active-1)/6)*18));
  const phase = phases[active - 1];
  const meta = metaFor(journey,active);
  const phaseDone = phase.tasks.every((_, i) => done[`${active}-${i}`]);
  const openCount = phase.tasks.length - phase.tasks.filter((_, i) => done[`${active}-${i}`]).length;

  const vaultItems = useMemo<VaultItem[]>(()=>phases.flatMap(p=>{
    const m=metaFor(journey,p.n);
    const ready=p.tasks.every((_,i)=>done[`${p.n}-${i}`]);
    return m.vault.map((title,i)=>({id:`${p.n}-${i}`,title,type:i===0?"Canvas":"Blueprint",status:ready?"ready":"planned",phase:p.n}));
  }),[done,journey,phases]);
  const readyVault=vaultItems.filter(x=>x.status==="ready").length;

  function persist(nextDone: Record<string, boolean>, nextActive: number) {
    localStorage.setItem(key, JSON.stringify({ done: nextDone, active: nextActive }));
  }
  function updateDraft(patch:Partial<MissionDraft>){
    const next={...draft,...patch};
    setDraft(next);
    localStorage.setItem(`${key}_mission1_draft`,JSON.stringify(next));
  }
  function prepareVaultForPhase(phaseNumber:number){
    const m=metaFor(journey,phaseNumber);
    const now=new Date().toISOString();
    m.vault.forEach((title,index)=>upsertVaultAsset({
      id:`${journey.slug}-m${phaseNumber}-asset${index}`,title,
      category:index===0?"Business":phaseNumber>=5?"Sales":"Dokumente",
      type:index===0?"Canvas":"Blueprint",status:"prepared",journey:journey.slug,mission:phaseNumber,createdAt:now,updatedAt:now,source:"mission"
    }));
    if(journey.slug==="lead-generation-agency"&&phaseNumber===1){
      const dna=loadBusinessDNA();
      const chosen=draft.customNiche.trim()||draft.niche;
      const positioning=draft.targetGroup&&draft.coreProblem&&draft.outcome?`Ich helfe ${draft.targetGroup}, die ${draft.coreProblem}, dabei ${draft.outcome}${draft.differentiator?`, ${draft.differentiator}`:""}.`:dna.positioning;
      saveBusinessDNA({...dna,journey:journey.slug,niche:chosen||dna.niche,targetGroup:draft.targetGroup||dna.targetGroup,coreProblem:draft.coreProblem||dna.coreProblem,outcome:draft.outcome||dna.outcome,positioning});
    }
  }
  function toggle(i: number) {
    const id=`${active}-${i}`;
    const next = { ...done, [id]: !done[id] };
    setDone(next); persist(next, active);
    const willDone=phase.tasks.every((_,idx)=>next[`${active}-${idx}`]);
    if(willDone && !phaseDone){prepareVaultForPhase(active);setCelebrate(active);window.setTimeout(()=>setCelebrate(null),2800)}
  }
  function markTask(i:number,value=true){
    const id=`${active}-${i}`;
    const next={...done,[id]:value};
    setDone(next);persist(next,active);
    const willDone=phase.tasks.every((_,idx)=>next[`${active}-${idx}`]);
    if(willDone && !phaseDone){prepareVaultForPhase(active);setCelebrate(active);window.setTimeout(()=>setCelebrate(null),2800)}
  }
  function open(n: number) { setActive(n); persist(done,n); window.scrollTo({top:0,behavior:"smooth"}); }

  const useGoldStandard = journey.slug === "lead-generation-agency" && active === 1;

  return <main className="journeyShell premiumJourney">
    <aside className="journeySide">
      <Link href="/dashboard" className="journeyLogo"><span>O</span> ORIGIN <b>INCOME</b></Link>
      <div className="journeySideLabel">BUSINESS OPERATING SYSTEM</div>
      <h2>{journey.shortTitle.split("\n").map((line,i)=><span key={line}>{line}{i===0&&<br/>}</span>)}</h2>
      <div className="businessScoreCard"><div><small>BUSINESS SCORE</small><strong>{businessScore}</strong><span>/100</span></div><i><em style={{width:`${businessScore}%`}}/></i><p>{businessScore<35?"Fundament entsteht":businessScore<70?"Business nimmt Form an":"Go-to-market wird konkret"}</p></div>
      <div className="journeyProgress"><div><span>Mission Progress</span><b>{pct}%</b></div><i><em style={{width:`${pct}%`}}/></i><small>{completed} von {total} Aufgaben umgesetzt</small></div>
      <button className="vaultNav" onClick={()=>setVaultOpen(true)}><span>⌁</span><div><small>BUSINESS VAULT</small><b>Deine Business Assets</b></div><em>{readyVault}/{vaultItems.length}</em></button>
      <nav>{phases.map(p=>{const count=p.tasks.filter((_,i)=>done[`${p.n}-${i}`]).length;const complete=count===p.tasks.length;return <button key={p.n} className={active===p.n?"active":complete?"complete":""} onClick={()=>open(p.n)}><span>{complete?"✓":String(p.n).padStart(2,"0")}</span><div><small>MISSION {p.n}</small><b>{p.title}</b></div><em>{count}/{p.tasks.length}</em></button>})}</nav>
      <Link href="/dashboard" className="journeyBack">← Zurück zum Dashboard</Link>
    </aside>

    <section className="journeyMain">
      <header><div><span className="journeyLive"/> BUSINESS BUILD ACTIVE · {plan.toUpperCase()}</div><span>{firstName} · Mission {active} / 7</span></header>
      <div className="journeyContent">
        <section className="businessTimeline"><small>DEIN WEG ZUM ERSTEN FUNKTIONIERENDEN BUSINESS</small><div><span className="done">Start</span><i/><span className={active>=3?"done":"active"}>Angebot</span><i/><span className={active>=5?"done":""}>Markt</span><i/><span className={active>=6?"done":""}>Erster Kunde</span><i/><span className={active>=7?"done":""}>Skalierung</span></div><p>📍 Du bist hier: <b>Mission {active} · {phase.title}</b></p></section>

        <div className="journeyHero missionHero"><div><small>MISSION {String(active).padStart(2,"0")} · {phase.eyebrow}</small><h1>{phase.title}</h1><p>{phase.promise}</p><div className="missionMeta"><span>◷ {meta.duration}</span><span>◇ {meta.difficulty}</span><span>↗ Business Impact: Hoch</span><span>🏆 {meta.milestone}</span></div></div><div className="journeyScore"><strong>{phase.tasks.filter((_,i)=>done[`${active}-${i}`]).length}/{phase.tasks.length}</strong><span>MISSION TASKS</span></div></div>

        <article className="incomeFocus"><div><small>BUSINESS OUTCOME</small><h3>Was diese Mission für dein Einkommenspotenzial verändert</h3><p>{meta.incomeFocus}</p></div><span>CHF</span></article>

        {useGoldStandard ? <GoldStandardMission draft={draft} updateDraft={updateDraft} done={done} markTask={markTask}/> : <StandardMission phase={phase} active={active} done={done} toggle={toggle}/>} 

        <div className="journeyBottom premiumBottom">
          <article><small>MISSION DELIVERABLE</small><h3>{phase.deliverable}</h3><p>Am Ende besitzt du einen echten Business-Baustein. Kein theoretisches Zertifikat, sondern etwas, das du für deinen Markt einsetzen kannst.</p><div className="deliverableReward">🏆 <span><small>BELOHNUNG</small><b>{meta.milestone}</b></span></div></article>
          <article><small>BUSINESS VAULT</small><h3>Diese Assets werden vorbereitet.</h3><div className="vaultPreview">{meta.vault.map(x=><span key={x}><i>{phaseDone?"✓":"⌁"}</i><b>{x}</b><small>{phaseDone?"bereit":"mit Origin AI erstellbar"}</small></span>)}</div><div className="vaultButtonRow"><button className="vaultButton" onClick={()=>setVaultOpen(true)}>Schnellansicht</button><Link className="vaultButton" href="/vault">Business Vault öffnen →</Link></div></article>
          <article className="originAiPrep"><small>ORIGIN AI · CO-FOUNDER</small><h3>Deine KI arbeitet später direkt mit dieser Mission.</h3><p>Origin AI kennt dann dein Assessment, deine Journey und deinen Fortschritt. Statt statischer Vorlagen erzeugst du genau das Dokument oder die Nachricht, die du gerade brauchst.</p><div className="aiActionList"><span>„Analysiere meine Nische“</span><span>„Schärfe meine Positionierung“</span><span>„Erstelle meine Value Proposition“</span></div><Link className="originAiPrepButton" href="/vault">Origin AI Workflow öffnen →</Link></article>
        </div>

        <section className="readyCheck"><div><small>MISSION READY CHECK</small><h3>Bist du bereit für Mission {active+1}?</h3><p>Origin Income lässt dich erst weiter, wenn die entscheidenden Business-Bausteine stehen.</p></div><div className="readyChecklist">{phase.tasks.map((task,i)=><span key={task} className={done[`${active}-${i}`]?"ready":""}><i>{done[`${active}-${i}`]?"✓":"○"}</i>{task}</span>)}</div></section>

        <div className="journeyNext"><div>{phaseDone?<><span>MISSION COMPLETE</span><b>{meta.milestone}. Dein nächster Business-Baustein ist bereit.</b></>:<><span>DEIN NÄCHSTER SCHRITT</span><b>Schliesse die {openCount} offenen Aufgaben ab.</b></>}</div>{active<7?<button disabled={!phaseDone} onClick={()=>open(active+1)}>Mission {active+1} starten →</button>:<button disabled={!phaseDone}>Journey abschliessen ✓</button>}</div>
      </div>
    </section>

    {vaultOpen&&<div className="vaultBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setVaultOpen(false)}}><section className="vaultModal"><button className="vaultClose" onClick={()=>setVaultOpen(false)}>×</button><small>ORIGIN BUSINESS VAULT</small><h2>Dein Unternehmen entsteht hier.</h2><p>Der Vault sammelt die Business Assets, die du während deiner Journey entwickelst. Origin AI wird diese später individuell aus deinen Daten generieren – statt dir generische Vorlagen vorzusetzen.</p><div className="vaultStats"><span><b>{readyVault}</b><small>bereit</small></span><span><b>{vaultItems.length-readyVault}</b><small>vorbereitet</small></span><span><b>7</b><small>Missionen</small></span></div><div className="vaultList">{vaultItems.map(x=><article key={x.id} className={x.status}><i>{x.status==="ready"?"✓":"⌁"}</i><div><small>MISSION {x.phase} · {x.type.toUpperCase()}</small><b>{x.title}</b></div><span>{x.status==="ready"?"Bereit":"Später mit Origin AI erstellen"}</span></article>)}</div><Link className="vaultFullLink" href="/vault">Vollständigen Business Vault öffnen →</Link></section></div>}
    {celebrate&&<div className="missionCelebration"><span>✓</span><small>MISSION {celebrate} ABGESCHLOSSEN</small><h2>{metaFor(journey,celebrate).milestone}</h2><p>Dein Business ist einen echten Schritt weiter.</p></div>}
  </main>;
}

function StandardMission({phase,active,done,toggle}:{phase:JourneyDefinition["phases"][number];active:number;done:Record<string,boolean>;toggle:(i:number)=>void}){
  return <div className="journeyGrid">
    <article className="journeyCard"><div className="journeyCardHead"><span>01</span><div><small>STRATEGY</small><h3>Was du dafür verstehen musst</h3></div></div><div className="lessonList">{phase.lessons.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><p>{x}</p><b>→</b></div>)}</div></article>
    <article className="journeyCard taskCard"><div className="journeyCardHead"><span>02</span><div><small>EXECUTION</small><h3>Deine Mission</h3></div></div><p className="taskIntro">Nicht konsumieren. Umsetzen. Jede erledigte Aufgabe baut einen konkreten Bestandteil deines Business.</p><div className="journeyTasks">{phase.tasks.map((x,i)=><button key={x} className={done[`${active}-${i}`]?"done":""} onClick={()=>toggle(i)}><i>{done[`${active}-${i}`]?"✓":""}</i><span><small>MISSION TASK {i+1}</small>{x}</span></button>)}</div></article>
  </div>
}

function GoldStandardMission({draft,updateDraft,done,markTask}:{draft:MissionDraft;updateDraft:(p:Partial<MissionDraft>)=>void;done:Record<string,boolean>;markTask:(i:number,v?:boolean)=>void}){
  const chosen=draft.customNiche.trim() || draft.niche;
  const marketScore=draft.demand+draft.budget+draft.reachability;
  const positioning=[draft.targetGroup,draft.coreProblem,draft.outcome].every(x=>x.trim().length>2);
  const canValidate=Boolean(chosen) && marketScore>=9;
  const [quiz,setQuiz]=useState<string>("");
  const [challenge,setChallenge]=useState(false);
  const missionSteps=[
    {label:"Nische gewählt",ready:Boolean(chosen)},
    {label:"Money Check ≥ 9/15",ready:marketScore>=9},
    {label:"10 Unternehmen geprüft",ready:draft.companies.trim().length>=30},
    {label:"5 echte Probleme notiert",ready:draft.problems.trim().length>=35},
    {label:"Positionierung formuliert",ready:positioning},
  ];
  const missionReady=missionSteps.every(x=>x.ready);
  const minutesLeft=Math.max(5,55-Math.round(missionSteps.filter(x=>x.ready).length*9.5));

  return <section className="missionFramework premiumContentEngine">
    <div className="coachRibbon"><div><span>OI</span><div><small>ORIGIN BUSINESS COACH</small><b>{missionReady?"Stark. Dein Fundament ist bereit für Mission 2.":chosen?`Fokus für heute: ${chosen} mit echten Marktdaten prüfen.`:"Fokus für heute: Entscheide dich für eine einzige Kernnische."}</b></div></div><em>Noch ca. {minutesLeft} Min.</em></div>

    <div className="quickWinBar"><div><small>DEIN QUICK WIN</small><h3>Nach dieser Mission kannst du in einem Satz erklären, <b>wem</b> du hilfst, <b>welches wirtschaftliche Problem</b> du löst und <b>warum ein Kunde dafür bezahlen sollte</b>.</h3></div><span>MISSION 01 · FUNDAMENT</span></div>

    <article className="missionOutcomeBoard">
      <div><small>WAS DU HEUTE AUFBAUST</small><h2>Kein Kurskapitel. Dein erstes verkaufsfähiges Business-Fundament.</h2><p>Du triffst fünf Entscheidungen, die später dein Angebot, deine Akquise und deine ersten Verkaufsgespräche steuern.</p></div>
      <div className="outcomeChecks"><span>01 <b>Kernnische</b></span><span>02 <b>Markt-Score</b></span><span>03 <b>Kundenprobleme</b></span><span>04 <b>Positionierung</b></span><span>05 <b>Ready Check</b></span></div>
    </article>

    <article className="premiumInsight"><span>01</span><div><small>VERSTEHEN · 6 MINUTEN</small><h2>Was eine profitable Nische wirklich ist</h2><p>Eine Nische ist nicht einfach eine Branche. Für eine Lead Generation Agency brauchst du einen Markt, in dem <b>ein neuer Kunde wirtschaftlich wertvoll</b> ist, Unternehmen laufend neue Aufträge brauchen und du Entscheider zuverlässig erreichen kannst.</p><div className="conceptGrid"><div><b>Hoher Kundenwert</b><p>Wenn ein gewonnener Kunde mehrere hundert oder tausend Franken wert ist, kann dein Lead-Service wirtschaftlich Sinn ergeben.</p><em>Frage: Was ist ein neuer Kunde ungefähr wert?</em></div><div><b>Messbarer Bedarf</b><p>Gute Märkte haben einen wiederkehrenden Bedarf: Termine, Offerten, Besichtigungen, Beratungen oder Verkäufe.</p><em>Frage: Was passiert, wenn die Pipeline leer ist?</em></div><div><b>Erreichbare Entscheider</b><p>Du brauchst einen realistischen Weg zu Inhabern, Geschäftsführern oder Vertriebsverantwortlichen.</p><em>Frage: Findest du 50 davon in 30 Minuten?</em></div></div><aside><strong>WAS STARKE AGENTUREN ANDERS MACHEN</strong><p>Sie starten eng. Eine klare Zielgruppe macht Angebot, Ansprache, Proof und Akquise deutlich einfacher. Breiter werden kannst du später – nachdem du weisst, was funktioniert.</p></aside></div></article>

    <article className="caseStudyCard"><div><small>PRAXISBEISPIEL</small><h3>„Lead Generation für KMU“ vs. eine kaufbare Positionierung</h3></div><div className="caseCompare"><div className="bad"><small>ZU BREIT</small><p>„Wir generieren Leads für Unternehmen mit modernem Outreach.“</p><span>Kein klarer Käufer · kein klarer Schmerz · austauschbar</span></div><div className="good"><small>KLARER</small><p>„Wir helfen Physiotherapiepraxen mit freien Terminslots, planbar qualifizierte Erstgespräche zu gewinnen.“</p><span>Käufer sichtbar · Problem sichtbar · Ergebnis sichtbar</span></div></div></article>

    <article className="missionStep"><header><span>02</span><div><small>ENTSCHEIDEN · 5 MINUTEN</small><h2>Wähle deine erste Kernnische</h2></div></header><p>Wähle für den Start <b>eine</b> Nische. Du bindest dich nicht für immer – du schaffst einen klaren Ausgangspunkt, damit du in den nächsten Missionen nicht zehn verschiedene Businesses gleichzeitig baust.</p><div className="nicheGrid">{nicheOptions.map(x=><button key={x} className={draft.niche===x?"selected":""} onClick={()=>{updateDraft({niche:x,customNiche:""});markTask(0,true)}}>{x}<span>{draft.niche===x?"✓":"→"}</span></button>)}</div><label className="missionField"><span>ODER EIGENE NISCHE</span><input value={draft.customNiche} onChange={e=>{updateDraft({customNiche:e.target.value,niche:""});if(e.target.value.trim().length>2)markTask(0,true)}} placeholder="z. B. Schweizer Architekturbüros"/></label><div className="microResult"><small>DEINE AKTUELLE WAHL</small><b>{chosen || "Noch keine Nische gewählt"}</b></div><div className="quickRule"><strong>Quick Rule</strong><p>Wenn du zwischen zwei Nischen schwankst, nimm für den ersten Test diejenige mit höherem Kundenwert und besser erreichbaren Entscheidern. Du validierst sie gleich mit echten Unternehmen.</p></div></article>

    <article className="missionStep"><header><span>03</span><div><small>PRÜFEN · 8 MINUTEN</small><h2>Der 15-Punkte Money Check</h2></div></header><p>Bewerte deine Nische nicht nach Bauchgefühl. Gib jedem Faktor 1–5 Punkte. Ab <b>9/15</b> ist sie stark genug, um weiter zu validieren. Der Score ist Orientierung – keine Umsatzgarantie.</p><div className="scoreQuestions"><ScoreQuestion label="Bedarf" hint="Brauchen diese Unternehmen regelmässig neue Kunden, Termine oder Verkaufschancen?" value={draft.demand} onChange={v=>updateDraft({demand:v})}/><ScoreQuestion label="Budget" hint="Ist ein neuer Kunde genug wert, damit Marketing oder Lead Gen bezahlt werden kann?" value={draft.budget} onChange={v=>updateDraft({budget:v})}/><ScoreQuestion label="Erreichbarkeit" hint="Kannst du Entscheider über E-Mail, LinkedIn, Telefon oder lokale Recherche finden?" value={draft.reachability} onChange={v=>updateDraft({reachability:v})}/></div><div className={`marketVerdict ${marketScore>=9?"good":marketScore?"warn":""}`}><div><small>NICHE SCORE</small><strong>{marketScore}<span>/15</span></strong></div><p>{marketScore>=12?"Sehr starke Ausgangslage. Jetzt mit realen Unternehmen validieren.":marketScore>=9?"Solide Ausgangslage. Der echte Marktcheck entscheidet.":marketScore?"Noch schwach. Prüfe eine andere Nische oder hinterfrage deine Bewertung.":"Bewerte zuerst alle drei Faktoren."}</p></div><div className="moneyLens"><small>BUSINESS LENS</small><div><span><b>{draft.budget || "–"}/5</b> Kaufkraft</span><span><b>{draft.demand || "–"}/5</b> Nachfrage</span><span><b>{draft.reachability || "–"}/5</b> Akquise-Fit</span></div></div></article>

    <article className="miniQuiz"><div><small>60-SEKUNDEN CHECK</small><h3>Welches Signal ist für deine erste Nische am stärksten?</h3><p>Es gibt keine perfekte Branche. Suche nach einem Markt, in dem dein Service einen wirtschaftlichen Hebel hat.</p></div><div>{["Viele Follower in der Branche","Ein gewonnener Kunde hat hohen Wert und neue Kunden werden laufend gebraucht","Die Branche klingt spannend","Es gibt kaum Konkurrenz"].map((x,i)=><button key={x} className={quiz===x?(i===1?"correct":"wrong"):""} onClick={()=>setQuiz(x)}>{x}<span>{quiz===x?(i===1?"✓":"×"):""}</span></button>)}</div>{quiz&&<p className={quiz.includes("hohen Wert")?"quizFeedback good":"quizFeedback"}>{quiz.includes("hohen Wert")?"Richtig. Kundenwert + wiederkehrender Bedarf sind stärkere Signale als Hype oder geringe Konkurrenz.":"Nicht ganz. Für dein Geschäftsmodell zählt vor allem, ob neue Kunden wirtschaftlich wertvoll sind und laufend gebraucht werden."}</p>}</article>

    <article className="missionStep"><header><span>04</span><div><small>MARKT VALIDIEREN · 12 MINUTEN</small><h2>Prüfe 10 echte Unternehmen</h2></div></header><p>Jetzt verlässt du die Theorie. Öffne Google Maps, LinkedIn oder Branchenverzeichnisse. Suche zehn reale Unternehmen und prüfe, ob du einen Entscheider findest und ob Hinweise auf aktiven Kundenbedarf vorhanden sind.</p><div className="toolStrip"><span>Google Maps</span><span>LinkedIn</span><span>Firmenwebsite</span><span>Branchenverzeichnis</span></div><div className="validationRecipe"><small>MACH ES GENAU SO</small><ol><li>Suche <b>„{chosen || "deine Nische"} + deine Region“</b>.</li><li>Öffne 10 Unternehmen in neuen Tabs.</li><li>Notiere Entscheider, Standort, Angebot und sichtbare Akquise-Signale.</li><li>Frage dich: Würde ein zusätzlicher Kunde hier wirtschaftlich etwas bewegen?</li><li>Stoppe nach 10 Firmen. Du brauchst jetzt Richtung, keine Dissertation.</li></ol></div><label className="missionField"><span>DEINE 10 UNTERNEHMEN / KURZE NOTIZEN</span><textarea value={draft.companies} onChange={e=>updateDraft({companies:e.target.value})} placeholder={"1. Muster Physio AG – 2 Standorte, Kontakt Inhaber gefunden\n2. ..."}/></label><button className="stepConfirm" disabled={!canValidate || draft.companies.trim().length<30} onClick={()=>{markTask(1,true);setChallenge(true)}}>Marktanalyse als erledigt markieren ✓</button>{challenge&&<div className="challengeDone"><b>Challenge geschafft.</b><span>Du hast deine Idee erstmals gegen einen echten Markt geprüft – nicht nur gegen dein Bauchgefühl.</span></div>}<div className="warningBox"><strong>⚠ HÄUFIGER FEHLER</strong><p>Nicht monatelang recherchieren. Ziel ist keine perfekte Marktstudie, sondern genug Evidenz, um mit echten Gesprächen weiterzulernen.</p></div></article>

    <article className="missionStep"><header><span>05</span><div><small>PROBLEM FINDEN · 8 MINUTEN</small><h2>Formuliere 5 Probleme, die wirtschaftlich weh tun</h2></div></header><p>Denke aus Sicht des Kunden. Nicht „zu wenig Leads“, sondern konkrete Folgen: leere Kalender, schwankende Auslastung, starke Empfehlungsabhängigkeit, fehlende Pipeline oder Vertrieb ohne System.</p><div className="exampleStrip"><span>„Zu viele freie Termine im Kalender“</span><span>„Abhängigkeit von Empfehlungen“</span><span>„Vertrieb hat keine konstante Pipeline“</span></div><div className="problemFormula"><small>PROBLEM-FORMEL</small><p><b>Symptom</b> → wirtschaftliche Folge → gewünschtes Ergebnis</p><span>„Freie Termine“ → Umsatz bleibt liegen → planbar neue Erstgespräche</span></div><label className="missionField"><span>DEINE FÜNF PROBLEME</span><textarea value={draft.problems} onChange={e=>updateDraft({problems:e.target.value})} placeholder={"1. ...\n2. ...\n3. ...\n4. ...\n5. ..."}/></label><button className="stepConfirm" disabled={draft.problems.trim().length<35} onClick={()=>markTask(2,true)}>Probleme gespeichert ✓</button></article>

    <article className="missionStep positioningBuilder"><header><span>06</span><div><small>POSITIONIEREN · 10 MINUTEN</small><h2>Baue deine Positionierung live</h2></div></header><p>Eine gute Positionierung sagt nicht, was dein Tool macht. Sie sagt <b>für wen</b> du <b>welches wertvolle Ergebnis</b> erzeugst. Halte sie klar genug, dass ein Fremder sie in zehn Sekunden versteht.</p><div className="builderGrid"><label><span>ICH HELFE …</span><input value={draft.targetGroup} onChange={e=>updateDraft({targetGroup:e.target.value})} placeholder={chosen || "z. B. Physiotherapiepraxen"}/></label><label><span>DIE AKTUELL …</span><input value={draft.coreProblem} onChange={e=>updateDraft({coreProblem:e.target.value})} placeholder="z. B. zu viele freie Termine haben"/></label><label><span>DABEI …</span><input value={draft.outcome} onChange={e=>updateDraft({outcome:e.target.value})} placeholder="z. B. planbar qualifizierte Erstgespräche zu gewinnen"/></label><label><span>ANDERS ALS …</span><input value={draft.differentiator} onChange={e=>updateDraft({differentiator:e.target.value})} placeholder="optional: dein Differenzierungsmerkmal"/></label></div><div className="positioningPreview"><small>LIVE PREVIEW</small><p>„Ich helfe <b>{draft.targetGroup || "[Zielgruppe]"}</b>, die <b>{draft.coreProblem || "[Problem]"}</b>, dabei <b>{draft.outcome || "[Ergebnis]"}</b>{draft.differentiator?`, ${draft.differentiator}`:""}.“</p></div><div className="positioningTests"><span className={draft.targetGroup.trim().length>2?"pass":""}>✓ Zielgruppe konkret</span><span className={draft.coreProblem.trim().length>2?"pass":""}>✓ Problem sichtbar</span><span className={draft.outcome.trim().length>2?"pass":""}>✓ Ergebnis verständlich</span></div><button className="stepConfirm gold" disabled={!positioning} onClick={()=>markTask(3,true)}>Positionierung finalisieren →</button></article>

    <article className="missionStep actionPlan"><header><span>07</span><div><small>UMSETZEN · 5 MINUTEN</small><h2>Dein 24-Stunden-Action-Plan</h2></div></header><p>Mission 1 ist erst wertvoll, wenn du die Entscheidungen ausserhalb von Origin Income benutzt. Dein nächster Schritt ist bewusst klein: Validierung durch echte Marktreaktion.</p><div className="actionCards"><div><small>HEUTE</small><b>Speichere deine Positionierung</b><p>Nutze genau einen Satz als Arbeitsversion. Nicht mehr perfektionieren.</p></div><div><small>INNERHALB 24H</small><b>Sprich mit 3 echten Unternehmen</b><p>Keine Verkaufsshow. Frage nach aktuellem Kundengewinnungsprozess und Engpässen.</p></div><div><small>DANACH</small><b>Notiere Muster</b><p>Welche Probleme wiederholen sich? Genau daraus entsteht Mission 2: dein Angebot.</p></div></div></article>

    <article className="originAiWorkflow"><div><small>ORIGIN AI · WORKFLOW READY</small><h2>Dein Co-Founder übernimmt diesen Kontext in den Business Vault.</h2><p>Deine Nische, Zielgruppe, Probleme und Positionierung werden als Business DNA vorbereitet. Im Vault kannst du daraus bereits AI-Workflows für Positionierung, Angebot, Preisliste, Landingpage oder Outreach anlegen.</p></div><div><Link href="/vault">◎ Nische analysieren</Link><Link href="/vault">✦ Positionierung schärfen</Link><Link href="/vault">↗ Value Proposition erstellen</Link></div></article>

    <article className="missionReadyPremium"><div><small>MISSION READY CHECK</small><h2>{missionReady?"Fundament steht. Mission 2 kann kommen.":"Bevor du weitergehst, schliesse diese fünf Punkte ab."}</h2><p>{missionReady?"Du hast jetzt eine fokussierte Nische, reale Marktevidenz und eine klare Arbeitspositionierung. In Mission 2 verwandeln wir das in ein konkretes Angebot.":"Kein künstliches Gatekeeping: Der Check stellt nur sicher, dass du die Entscheidungen getroffen hast, auf denen die nächste Mission aufbaut."}</p></div><div className="premiumReadyList">{missionSteps.map((x,i)=><span key={x.label} className={x.ready?"ready":""}><i>{x.ready?"✓":String(i+1).padStart(2,"0")}</i><b>{x.label}</b></span>)}</div></article>

    <article className="missionReality"><small>REALITY CHECK</small><h3>Eine gute Positionierung ist ein Startpunkt – kein Einkommensversprechen.</h3><p>Diese Mission reduziert unnötiges Raten und macht deine nächsten Schritte konkreter. Ob daraus Umsatz entsteht, hängt davon ab, wie gut du dein Angebot entwickelst, echte Kunden ansprichst, Feedback verarbeitest und konsequent umsetzt.</p></article>
  </section>
}

function ScoreQuestion({label,hint,value,onChange}:{label:string;hint:string;value:number;onChange:(n:number)=>void}){
  return <div className="scoreQuestion"><div><b>{label}</b><p>{hint}</p></div><div>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>onChange(n)} className={value===n?"active":""}>{n}</button>)}</div></div>
}
