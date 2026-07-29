"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { calculateMatches } from "../../lib/matchmaking";

type Answer = string | string[] | number;
type Question = {
  section: string;
  eyebrow: string;
  title: string;
  helper: string;
  type: "choice" | "multi" | "scale";
  options?: { label: string; icon: string; note?: string }[];
  minLabel?: string;
  maxLabel?: string;
};

const questions: Question[] = [
  {section:"Ausgangslage",eyebrow:"DEIN STARTPUNKT",title:"Wo stehst du beruflich gerade?",helper:"Damit wir ein Modell wählen, das realistisch zu deinem Alltag passt.",type:"choice",options:[{label:"Angestellt",icon:"briefcase",note:"Ich baue nebenbei auf"},{label:"Selbstständig",icon:"rocket",note:"Ich will erweitern"},{label:"In Ausbildung",icon:"book",note:"Ich starte früh"},{label:"Neuorientierung",icon:"compass",note:"Ich suche meinen Weg"}]},
  {section:"Ausgangslage",eyebrow:"DEIN SPIELRAUM",title:"Wie viel Startkapital möchtest du einsetzen?",helper:"Nicht wie viel du besitzt – sondern was du bewusst testen möchtest.",type:"choice",options:[{label:"Unter CHF 500",icon:"seed"},{label:"CHF 500–2’000",icon:"coins"},{label:"CHF 2’000–10’000",icon:"chart"},{label:"Über CHF 10’000",icon:"diamond"}]},
  {section:"Ausgangslage",eyebrow:"DEINE ZEIT",title:"Wie viele Stunden kannst du pro Woche verlässlich investieren?",helper:"Konstanz schlägt einzelne Marathon-Sessions.",type:"choice",options:[{label:"Unter 3 Stunden",icon:"clock"},{label:"3–5 Stunden",icon:"timer"},{label:"5–10 Stunden",icon:"calendar"},{label:"10–20 Stunden",icon:"bolt"},{label:"Über 20 Stunden",icon:"flame"}]},
  {section:"Ausgangslage",eyebrow:"DEIN RHYTHMUS",title:"Wann arbeitest du am zuverlässigsten an deinem Projekt?",helper:"Wir richten die spätere Roadmap an deinem echten Leben aus.",type:"choice",options:[{label:"Morgens",icon:"sunrise"},{label:"Tagsüber",icon:"sun"},{label:"Abends",icon:"moon"},{label:"Am Wochenende",icon:"calendar"},{label:"Flexibel",icon:"shuffle"}]},

  {section:"Ziele",eyebrow:"DEIN ERSTES ZIEL",title:"Welches monatliche Zusatzeinkommen möchtest du zuerst erreichen?",helper:"Ein ambitioniertes, aber greifbares Etappenziel.",type:"choice",options:[{label:"CHF 500",icon:"spark"},{label:"CHF 1’000",icon:"target"},{label:"CHF 2’500",icon:"trend"},{label:"CHF 5’000+",icon:"crown"}]},
  {section:"Ziele",eyebrow:"DEIN WARUM",title:"Was soll dir dein Business langfristig ermöglichen?",helper:"Wähle das Ziel, das dich auch an schwierigen Tagen antreibt.",type:"choice",options:[{label:"Finanzielle Sicherheit",icon:"shield"},{label:"Mehr Freiheit",icon:"wings"},{label:"Vollzeit-Selbstständigkeit",icon:"rocket"},{label:"Vermögen aufbauen",icon:"layers"},{label:"Etwas Eigenes schaffen",icon:"fingerprint"}]},
  {section:"Ziele",eyebrow:"WACHSTUMSPOTENZIAL",title:"Wie wichtig ist dir, dass dein Modell stark skalieren kann?",helper:"1 bedeutet: ein solides Zusatzeinkommen reicht. 10 bedeutet: maximaler Wachstumshebel.",type:"scale",minLabel:"Solide",maxLabel:"Maximal skalierbar"},
  {section:"Ziele",eyebrow:"GESCHWINDIGKEIT",title:"Wann möchtest du realistisch erste Einnahmen sehen?",helper:"Schneller Umsatz und langfristige Skalierung verlangen oft unterschiedliche Wege.",type:"choice",options:[{label:"Innerhalb 1 Monat",icon:"bolt"},{label:"In 1–3 Monaten",icon:"timer"},{label:"In 3–6 Monaten",icon:"calendar"},{label:"Ich baue langfristig",icon:"tree"}]},

  {section:"Stärken",eyebrow:"DEIN VERTRIEBSMUSKEL",title:"Wie sicher fühlst du dich im Verkauf?",helper:"Es geht nicht um Perfektion – sondern um deine heutige Ausgangslage.",type:"scale",minLabel:"Noch unsicher",maxLabel:"Sehr stark"},
  {section:"Stärken",eyebrow:"DEINE DIGITALE STÄRKE",title:"Wie wohl fühlst du dich mit Technik und digitalen Tools?",helper:"Viele Modelle lassen sich heute mit KI stark vereinfachen.",type:"scale",minLabel:"Anfänger",maxLabel:"Sehr versiert"},
  {section:"Stärken",eyebrow:"DEIN VORSPRUNG",title:"Welche Erfahrungen bringst du bereits mit?",helper:"Mehrfachauswahl möglich.",type:"multi",options:[{label:"Verkauf",icon:"handshake"},{label:"Marketing",icon:"megaphone"},{label:"Design",icon:"pen"},{label:"Programmierung",icon:"code"},{label:"Beratung",icon:"chat"},{label:"Finanzen",icon:"chart"},{label:"Social Media",icon:"phone"},{label:"Noch keine",icon:"seed"}]},
  {section:"Stärken",eyebrow:"DEIN UMSETZUNGSSTIL",title:"Wie konsequent setzt du einen klaren Plan um?",helper:"Eine ehrliche Antwort hilft uns mehr als eine perfekte.",type:"scale",minLabel:"Ich brauche Führung",maxLabel:"Sehr konsequent"},

  {section:"Präferenzen",eyebrow:"DEINE ENERGIE",title:"Arbeitest du lieber mit Menschen oder mit Systemen?",helper:"Beides kann profitabel sein – aber nicht jedes Modell fühlt sich gleich gut an.",type:"choice",options:[{label:"Vor allem Menschen",icon:"users"},{label:"Eher Menschen",icon:"user"},{label:"Beides",icon:"balance"},{label:"Eher Systeme",icon:"workflow"},{label:"Vor allem Systeme",icon:"cpu"}]},
  {section:"Präferenzen",eyebrow:"DEINE SICHTBARKEIT",title:"Möchtest du selbst als Gesicht der Marke auftreten?",helper:"Auch ohne tägliche Kamera-Präsenz sind starke Marken möglich.",type:"choice",options:[{label:"Ja, sehr gerne",icon:"camera"},{label:"Teilweise",icon:"half"},{label:"Lieber nicht",icon:"mask"},{label:"Noch unsicher",icon:"question"}]},
  {section:"Präferenzen",eyebrow:"DEIN MODELL",title:"Was reizt dich spontan am meisten?",helper:"Keine Sorge: Die Analyse berücksichtigt alle Antworten – nicht nur diese eine.",type:"choice",options:[{label:"Premium-Dienstleistung",icon:"briefcase"},{label:"Digitales Produkt",icon:"download"},{label:"E-Commerce",icon:"bag"},{label:"Content & Community",icon:"broadcast"},{label:"Software & KI",icon:"cpu"},{label:"Noch offen",icon:"compass"}]},
  {section:"Präferenzen",eyebrow:"DEIN ARBEITSORT",title:"Wo soll dein Business hauptsächlich funktionieren?",helper:"Lokal, digital oder als Kombination.",type:"choice",options:[{label:"Komplett online",icon:"globe"},{label:"Überwiegend online",icon:"wifi"},{label:"Hybrid",icon:"shuffle"},{label:"Lokal",icon:"pin"}]},

  {section:"Persönlichkeit",eyebrow:"DEIN RISIKOPROFIL",title:"Wie hoch ist deine Risikobereitschaft?",helper:"Wir gleichen Kapital, Geschwindigkeit und Planbarkeit miteinander ab.",type:"scale",minLabel:"Sehr vorsichtig",maxLabel:"Experimentierfreudig"},
  {section:"Persönlichkeit",eyebrow:"DEIN FOKUS",title:"Was bremst dich aktuell am meisten?",helper:"Das spätere System soll genau an diesem Engpass ansetzen.",type:"choice",options:[{label:"Keine klare Idee",icon:"compass"},{label:"Zu viele Ideen",icon:"layers"},{label:"Zeitmangel",icon:"clock"},{label:"Angst vor Fehlern",icon:"shield"},{label:"Technisches Wissen",icon:"code"},{label:"Konstanz",icon:"repeat"}]},
  {section:"Persönlichkeit",eyebrow:"DEINE MARKE",title:"Welche Wirkung soll dein zukünftiges Business haben?",helper:"Wähle bis zu drei Eigenschaften.",type:"multi",options:[{label:"Premium",icon:"diamond"},{label:"Vertrauenswürdig",icon:"shield"},{label:"Innovativ",icon:"spark"},{label:"Nahbar",icon:"heart"},{label:"Mutig",icon:"flame"},{label:"Minimalistisch",icon:"minus"}]},
  {section:"Persönlichkeit",eyebrow:"DER ENTSCHEIDENDE PUNKT",title:"Was ist dir wichtiger: schneller Umsatz oder maximaler Unternehmenswert?",helper:"Deine Antwort beeinflusst die Gewichtung deiner drei Matches besonders stark.",type:"choice",options:[{label:"Schnell erste Umsätze",icon:"bolt",note:"Validieren und Cashflow"},{label:"Ausgewogene Mischung",icon:"balance",note:"Tempo und Substanz"},{label:"Maximaler Langzeitwert",icon:"crown",note:"Geduldig gross bauen"}]}
];

const milestones: Record<number,{icon:string;title:string;text:string;badge:string}> = {
  4:{icon:"target",title:"Ausgangslage erkannt",text:"Zeit, Kapital und dein realistischer Startpunkt sind jetzt eingeordnet.",badge:"Basis analysiert"},
  8:{icon:"trend",title:"Ziele kalibriert",text:"Wir wissen jetzt, wie schnell und wie gross du aufbauen möchtest.",badge:"Ziele erkannt"},
  12:{icon:"spark",title:"Halbzeit – dein Profil nimmt Form an",text:"Deine Stärken und dein Umsetzungstyp grenzen bereits viele unpassende Modelle aus.",badge:"Stärken analysiert"},
  16:{icon:"compass",title:"Deine Richtung wird klar",text:"Arbeitsstil, Sichtbarkeit und Modellpräferenz sind jetzt miteinander verknüpft.",badge:"Präferenzen erkannt"}
};

const iconPaths: Record<string, ReactNode> = {
  briefcase:<><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></>,rocket:<><path d="M14 4c3-3 6-2 6-2s1 3-2 6l-6 6-4-4 6-6Z"/><path d="m8 10-4 1-2 3 6 2M12 14l1 6-3 2-2-6"/></>,book:<><path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z"/><path d="M20 4h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4z"/></>,compass:<><circle cx="12" cy="12" r="9"/><path d="m15 9-2 5-5 2 2-5 5-2Z"/></>,seed:<><path d="M12 21V10"/><path d="M12 13C7 13 4 10 4 5c5 0 8 3 8 8ZM12 10c0-4 3-7 8-7 0 5-3 8-8 8"/></>,coins:<><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v5c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 10v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/></>,chart:<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,diamond:<><path d="m12 21 9-11-4-6H7l-4 6 9 11Z"/><path d="m3 10 18 0M7 4l5 17 5-17"/></>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>,timer:<><circle cx="12" cy="13" r="8"/><path d="M9 2h6M12 5v2M18 7l2-2"/></>,calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,bolt:<><path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/></>,flame:<><path d="M12 22c4 0 7-3 7-7 0-5-4-8-3-13-4 2-5 6-5 9-2-2-3-4-3-6-3 3-4 6-4 10 0 4 4 7 8 7Z"/></>,sunrise:<><path d="M4 18h16M6 14a6 6 0 0 1 12 0M12 2v3M4 6l2 2M20 6l-2 2"/></>,sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,moon:<><path d="M20 15a8 8 0 0 1-11-11 8 8 0 1 0 11 11Z"/></>,shuffle:<><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></>,spark:<><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/></>,target:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,trend:<><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></>,crown:<><path d="m3 7 4 4 5-7 5 7 4-4-2 12H5L3 7Z"/></>,shield:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></>,wings:<><path d="M11 13C7 8 4 7 2 8c1 5 4 8 9 8M13 13c4-5 7-6 9-5-1 5-4 8-9 8M12 11v10"/></>,layers:<><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,fingerprint:<><path d="M8 11a4 4 0 0 1 8 0c0 5-1 8-3 10M5 11a7 7 0 0 1 14 0c0 3-.3 6-1.5 9M11 14c0 3-.5 5-1.5 7M8 15c0 2-.5 3.5-1 5"/></>,tree:<><path d="M12 22V12M7 12h10l-2-4h3l-6-6-6 6h3l-2 4Z"/></>,handshake:<><path d="m8 12 3 3a2 2 0 0 0 3 0l4-4M3 8l5-4 4 3M21 8l-5-4-4 3M3 8v8l4 4M21 8v8l-4 4"/></>,megaphone:<><path d="M3 11v2a2 2 0 0 0 2 2h3l6 4V5L8 9H5a2 2 0 0 0-2 2Z"/><path d="m8 15 1 5h3"/></>,pen:<><path d="m4 20 4-1 11-11-3-3L5 16l-1 4ZM14 7l3 3"/></>,code:<><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,chat:<><path d="M21 12a8 8 0 0 1-8 8H6l-4 2 2-5a8 8 0 1 1 17-5Z"/></>,phone:<><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/></>,users:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,user:<><circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/></>,balance:<><path d="M12 3v18M5 7h14M5 7l-3 6h6L5 7ZM19 7l-3 6h6l-3-6ZM8 21h8"/></>,workflow:<><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6M15 18H9a3 3 0 0 1-3-3V9"/></>,cpu:<><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v5M15 1v5M9 18v5M15 18v5M1 9h5M18 9h5M1 15h5M18 15h5"/></>,camera:<><rect x="3" y="6" width="18" height="14" rx="2"/><path d="m8 6 2-3h4l2 3M12 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></>,half:<><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z"/></>,mask:<><path d="M3 6c6-3 12-3 18 0v7c-2 6-7 8-9 8s-7-2-9-8V6Z"/><path d="M7 11h3M14 11h3"/></>,question:<><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 1 1 4.5 2c-1.2 1-2 1.5-2 3M12 18h.01"/></>,download:<><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></>,bag:<><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V5a3 3 0 0 1 6 0v3"/></>,broadcast:<><circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.5 4.5a10.5 10.5 0 0 0 0 15M19.5 4.5a10.5 10.5 0 0 1 0 15"/></>,globe:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></>,wifi:<><path d="M5 12a10 10 0 0 1 14 0M8 15a6 6 0 0 1 8 0M11 18a2 2 0 0 1 2 0"/></>,pin:<><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></>,repeat:<><path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/></>,heart:<><path d="M20 5c-2-2-5-2-7 0l-1 1-1-1C9 3 6 3 4 5s-2 5 0 7l8 8 8-8c2-2 2-5 0-7Z"/></>,minus:<><path d="M5 12h14"/></>
};

function Icon({name}:{name:string}){
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name] || iconPaths.spark}</svg>;
}

export default function Onboarding(){
  const [stage,setStage]=useState<"intro"|"questions"|"milestone"|"analysis"|"results">("intro");
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState<Record<number,Answer>>({});
  const [analysisProgress,setAnalysisProgress]=useState(0);
  const [analysisLine,setAnalysisLine]=useState(0);
  const q=questions[step];
  const value=answers[step];
  const matches=useMemo(()=>calculateMatches(answers),[answers]);
  const progress=Math.round(((step+(stage==="results"?1:0))/questions.length)*100);
  const remaining=Math.max(1,Math.ceil((questions.length-step)*7/60));
  const currentMilestone=milestones[step];
  const earned=Object.keys(milestones).filter(n=>Number(n)<=step).length;
  const analysisLines=["Deine Antworten werden strukturiert…","Ziele und Ressourcen werden gewichtet…","Unpassende Modelle werden ausgeschlossen…","Deine stärksten Business-Signale werden verbunden…","Drei persönliche Matches werden vorbereitet…"];

  useEffect(()=>{
    if(stage!=="analysis") return;
    setAnalysisProgress(0); setAnalysisLine(0);
    const total=7800;
    const start=Date.now();
    const id=window.setInterval(()=>{
      const elapsed=Date.now()-start;
      const raw=Math.min(100,Math.round((elapsed/total)*100));
      const eased=Math.min(99,Math.round(100*(1-Math.pow(1-raw/100,1.65))));
      setAnalysisProgress(raw>=100?100:eased);
      setAnalysisLine(Math.min(analysisLines.length-1,Math.floor((elapsed/total)*analysisLines.length)));
      if(elapsed>=total){window.clearInterval(id);window.setTimeout(()=>setStage("results"),450)}
    },80);
    return()=>window.clearInterval(id);
  },[stage]);

  function setAnswer(v:Answer){setAnswers(x=>({...x,[step]:v}))}
  function toggle(opt:string){const arr=Array.isArray(value)?value:[]; const limit=step===18?3:99; if(arr.includes(opt))setAnswer(arr.filter(x=>x!==opt)); else if(arr.length<limit)setAnswer([...arr,opt])}
  const valid=q.type==="scale"?true:Array.isArray(value)?value.length>0:value!==undefined&&String(value).trim()!=="";
  function next(){
    if(!valid)return;
    if(step===questions.length-1){setStage("analysis");return}
    const nextStep=step+1;
    setStep(nextStep);
    if(milestones[nextStep]) setStage("milestone");
  }
  function back(){if(step===0)setStage("intro");else setStep(x=>x-1)}

  return <main className="paPage">
    <div className="paAmbient paAmbientOne"/><div className="paAmbient paAmbientTwo"/><div className="paGridNoise"/>
    <header className="paHeader">
      <Link href="/" className="paLogo"><span className="paLogoMark">OI</span><span>ORIGIN <b>INCOME</b></span></Link>
      {stage!=="intro"&&stage!=="analysis"&&<div className="paHeaderCenter"><span>{q?.section||"Analyse"}</span><i/><small>Noch ca. {remaining} Min.</small></div>}
      <div className="paSecure"><Icon name="shield"/><span>Deine Angaben bleiben geschützt</span></div>
    </header>

    {stage==="intro"&&<section className="paIntro">
      <div className="paIntroHalo"><span/><span/><span/><div><Icon name="spark"/></div></div>
      <p className="paKicker">ORIGIN PROFILE ENGINE</p>
      <h1>Finde das Business-Modell,<br/><em>das wirklich zu dir passt.</em></h1>
      <p className="paIntroText">20 präzise Fragen verbinden deine Ziele, Stärken, Zeit und Ressourcen zu drei persönlichen Business Matches.</p>
      <button onClick={()=>setStage("questions")} className="paPrimary">Assessment starten <span>→</span></button>
      <div className="paIntroFacts"><span><Icon name="clock"/> ca. 3 Minuten</span><span><Icon name="fingerprint"/> individuell ausgewertet</span><span><Icon name="shield"/> kostenlos starten</span></div>
    </section>}

    {stage==="questions"&&<>
      <div className="paProgressShell"><div className="paProgressMeta"><span>Dein Origin Profil</span><strong>{progress}%</strong></div><div className="paProgress"><i style={{width:`${progress}%`}}/><b style={{left:`calc(${progress}% - 8px)`}}/></div><div className="paBadges">{["Basis","Ziele","Stärken","Präferenzen","Profil"].map((b,i)=><span className={i<earned?"done":i===earned?"active":""} key={b}>{i<earned?"✓":i+1}<small>{b}</small></span>)}</div></div>
      <section className="paQuestion" key={step}>
        <div className="paQuestionIndex"><span>{String(step+1).padStart(2,"0")}</span><i>/</i><small>{questions.length}</small></div>
        <p className="paKicker">{q.eyebrow}</p>
        <h1>{q.title}</h1>
        <p className="paHelper">{q.helper}</p>

        {q.type==="choice"&&<div className={`paOptions ${q.options!.length===5?"five":""}`}>
          {q.options!.map(opt=><button key={opt.label} className={value===opt.label?"selected":""} onClick={()=>setAnswer(opt.label)}>
            <span className="paOptionIcon"><Icon name={opt.icon}/></span><span className="paOptionCopy"><b>{opt.label}</b>{opt.note&&<small>{opt.note}</small>}</span><i className="paOptionCheck">{value===opt.label?"✓":""}</i>
          </button>)}
        </div>}
        {q.type==="multi"&&<div className="paOptions paMulti">
          {q.options!.map(opt=>{const yes=Array.isArray(value)&&value.includes(opt.label);return <button key={opt.label} className={yes?"selected":""} onClick={()=>toggle(opt.label)}>
            <span className="paOptionIcon"><Icon name={opt.icon}/></span><span className="paOptionCopy"><b>{opt.label}</b></span><i className="paOptionCheck">{yes?"✓":"+"}</i>
          </button>})}
        </div>}
        {q.type==="scale"&&<div className="paScaleCard">
          <div className="paScaleValue"><span>{Number(value||5)}</span><small>/ 10</small></div>
          <input aria-label={q.title} type="range" min="1" max="10" value={Number(value||5)} onChange={e=>setAnswer(Number(e.target.value))}/>
          <div className="paScaleLabels"><span>{q.minLabel}</span><span>{q.maxLabel}</span></div>
          <div className="paScaleTicks">{Array.from({length:10},(_,i)=><button aria-label={`${i+1} von 10`} onClick={()=>setAnswer(i+1)} className={Number(value||5)>=i+1?"on":""} key={i}/>)}</div>
        </div>}
        <div className="paActions"><button className="paBack" onClick={back}>← Zurück</button><button className="paPrimary" disabled={!valid} onClick={next}>{step===questions.length-1?"Analyse starten":"Weiter"}<span>→</span></button></div>
        <p className="paKeyHint">ENTER drücken, um fortzufahren</p>
      </section>
    </>}

    {stage==="milestone"&&currentMilestone&&<section className="paMilestone">
      <div className="paMilestoneIcon"><Icon name={currentMilestone.icon}/><span/><span/></div>
      <p className="paKicker">ETAPPE ABGESCHLOSSEN</p>
      <h1>{currentMilestone.title}</h1>
      <p>{currentMilestone.text}</p>
      <div className="paEarned"><span><Icon name="spark"/></span><div><small>NEUES PROFIL-SIGNAL</small><b>{currentMilestone.badge}</b></div><i>✓</i></div>
      <button className="paPrimary" onClick={()=>setStage("questions")}>Weiter zur nächsten Etappe <span>→</span></button>
    </section>}

    {stage==="analysis"&&<section className="paAnalysis">
      <div className="paScanner">
        <span className="paOrbit paOrbit1"/><span className="paOrbit paOrbit2"/><span className="paOrbit paOrbit3"/>
        <div className="paScanCore"><Icon name="fingerprint"/><i/></div>
        {Array.from({length:12},(_,i)=><b key={i} style={{transform:`rotate(${i*30}deg) translateY(-108px)`}}/>)}
      </div>
      <p className="paKicker">ORIGIN INTELLIGENCE</p>
      <h1>Dein Profil wird analysiert.</h1>
      <p className="paAnalysisLine" key={analysisLine}>{analysisLines[analysisLine]}</p>
      <div className="paAnalysisBar"><i style={{width:`${analysisProgress}%`}}/></div>
      <strong className="paAnalysisPercent">{analysisProgress}%</strong>
      <div className="paAnalysisSignals"><span className={analysisProgress>18?"done":""}>Ziele</span><span className={analysisProgress>38?"done":""}>Ressourcen</span><span className={analysisProgress>58?"done":""}>Stärken</span><span className={analysisProgress>78?"done":""}>Arbeitsstil</span><span className={analysisProgress>94?"done":""}>Matches</span></div>
    </section>}

    {stage==="results"&&<section className="paResults">
      <div className="paResultsTop"><div className="paResultSeal"><Icon name="spark"/></div><p className="paKicker">DEINE ANALYSE IST BEREIT</p><h1>Drei Modelle passen besonders<br/><em>stark zu deinem Profil.</em></h1><p>Deine Antworten wurden nach Potenzial, Geschwindigkeit, Ressourcen und persönlicher Passung gewichtet.</p></div>
      <div className="paMatchStack">
        {matches.map((m,i)=><article key={m.name} className={i===0?"winner":""}>
          <div className="paRank"><span>0{i+1}</span>{i===0&&<small>BEST MATCH</small>}</div>
          <div className="paMatchBody"><div className="paBlur"><h2>{m.name}</h2><p>{m.why[0]}</p></div><div className="paScore"><strong>{m.score}%</strong><span><i style={{width:`${m.score}%`}}/></span></div></div>
          <div className="paLock"><Icon name="shield"/></div>
        </article>)}
      </div>
      <div className="paUnlock">
        <div className="paUnlockIcon"><Icon name="fingerprint"/></div>
        <div><small>DEIN VOLLSTÄNDIGES PROFIL WARTET</small><h2>Schalte deine persönlichen Matches frei.</h2><p>Erstelle deinen kostenlosen Origin Account und sichere deine Analyse für dein Dashboard.</p></div>
        <Link href="/registrieren" onClick={()=>{localStorage.setItem("origin_assessment_complete","true");localStorage.setItem("origin_assessment_answers",JSON.stringify(answers));localStorage.setItem("origin_assessment_matches",JSON.stringify(matches));}}>Ergebnisse freischalten <span>→</span></Link>
      </div>
      <button className="paEdit" onClick={()=>{setStage("questions");setStep(0)}}>Antworten bearbeiten</button>
      <p className="paPrivacy"><Icon name="shield"/> Deine Antworten werden bis zur Account-Erstellung sicher in diesem Browser gespeichert.</p>
    </section>}
  </main>
}
