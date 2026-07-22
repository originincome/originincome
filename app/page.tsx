"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";

function Logo({size=44}:{size?:number}){
 const id=`g-${size}`;
 return <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true"><defs><linearGradient id={id} x1="20" y1="10" x2="140" y2="150"><stop stopColor="#FFF3B0"/><stop offset=".46" stopColor="#D4AF37"/><stop offset="1" stopColor="#7A4D05"/></linearGradient></defs><path d="M80 10 138 44v68l-58 38-58-38V44L80 10Z" fill="#080808" stroke={`url(#${id})`} strokeWidth="3"/><path d="M43 105 73 49l24 40" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/><path d="m72 107 46-52" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round"/><path d="M101 54h17v17" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function Countdown(){
 const target=useMemo(()=>new Date("2026-08-15T19:00:00+02:00").getTime(),[]);
 const [left,setLeft]=useState(Math.max(0,target-Date.now()));
 useEffect(()=>{const t=setInterval(()=>setLeft(Math.max(0,target-Date.now())),1000);return()=>clearInterval(t)},[target]);
 const vals=[["Tage",Math.floor(left/86400000)],["Std.",Math.floor((left%86400000)/3600000)],["Min.",Math.floor((left%3600000)/60000)],["Sek.",Math.floor((left%60000)/1000)]];
 return <div className="countdown">{vals.map(([l,v])=><div className="countItem" key={l}><strong>{String(v).padStart(2,"0")}</strong><span>{l}</span></div>)}</div>
}
const aiSteps=["Profil analysieren","Geschäftsmöglichkeiten vergleichen","Businessmodell entwickeln","Marke erstellen","Roadmap aufbauen"];
function AIEngine(){
 const [active,setActive]=useState(0);
 useEffect(()=>{const t=setInterval(()=>setActive(x=>(x+1)%aiSteps.length),2500);return()=>clearInterval(t)},[]);
 return <div className="aiEngine">
  <div className="engineHead"><div className="engineTitle"><Logo size={34}/><div><b>Origin AI</b><span><i/> Online · Building with you</span></div></div><small>AI CO-FOUNDER</small></div>
  <div className="engineCurrent"><small>CURRENT PROCESS</small><h3>{aiSteps[active]}</h3><div className="engineBar"><span key={active}/></div></div>
  <div className="engineList">{aiSteps.map((s,i)=><div className={`engineRow ${i<active?"done":""} ${i===active?"active":""}`} key={s}><b>{i<active?"✓":i===active?"•":String(i+1).padStart(2,"0")}</b><div><strong>{s}</strong><span>{i<active?"Completed by Origin AI":i===active?"Origin AI is working…":"Queued"}</span></div></div>)}</div>
  <div className="engineResult"><div><small>AI RECOMMENDATION</small><strong>Premium Service Business</strong></div><div><small>FIT</small><strong>94%</strong></div></div>
 </div>
}
const cards=[
 ["01","AI Discovery","Origin AI lernt deine Ziele, Fähigkeiten, Zeit, Interessen, Erfahrung und finanziellen Möglichkeiten kennen."],
 ["02","Opportunity Intelligence","Die KI bewertet passende Geschäftsmodelle nach Umsetzbarkeit, Nachfrage, Startkapital und persönlichem Fit."],
 ["03","AI Brand Builder","Origin AI entwickelt Positionierung, Angebot, Markenname, Sprache, visuelle Richtung und erste Inhalte."],
 ["04","Execution Co-Pilot","Du erhältst eine persönliche Roadmap. Origin AI schlägt konkrete nächste Schritte und Prioritäten vor."]
];
const outputs=["Business Direction","Target Audience","Offer & Pricing","Brand Identity","Website Blueprint","Marketing Roadmap"];

export default function Home(){
 const [intro,setIntro]=useState(true);
 useEffect(()=>{const t=setTimeout(()=>setIntro(false),3900);return()=>clearTimeout(t)},[]);
 return <>
  <div className={`intro ${intro?"":"gone"}`}><div className="introLogo"><Logo size={150}/></div><div className="introLine introOne">Jeder Erfolg hat einen Ursprung.</div><div className="introLine introTwo">Meet your AI Co-Founder.</div></div>
  <div className="noise"/><div className="aurora a1"/><div className="aurora a2"/>
  <header className="nav shell"><Link href="/" className="brand"><Logo/><span>ORIGIN <b>INCOME</b></span></Link><nav><a href="#origin-ai">Origin AI</a><a href="#system">System</a><a href="#outputs">Was entsteht</a><Link className="navBtn" href="/onboarding">AI Discovery starten</Link></nav></header>
  <main>
   <section className="hero shell">
    <div className="heroCopy"><div className="eyebrow"><span/> AI-powered Business Operating System</div><h1>Build your future.<br/><em>With your AI Co-Founder.</em></h1><p className="lead">Origin AI analysiert deine Fähigkeiten, findet passende Geschäftsmöglichkeiten, entwickelt dein Angebot, baut deine Marke und führt dich Schritt für Schritt Richtung erstem Umsatz.</p><div className="heroActions"><Link className="primary" href="/onboarding">Origin AI starten <i>↗</i></Link><a className="secondary" href="#origin-ai">So arbeitet deine KI</a></div><div className="proof"><span><b>30</b> persönliche Fragen</span><span><b>AI</b> Business-Auswertung</span><span><b>1</b> klare Roadmap</span></div><div className="heroTrust"><span>Keine generischen Prompts.</span><span>Keine leeren Erfolgsversprechen.</span><span>Ein System, das mit dir baut.</span></div></div>
    <div className="scene"><div className="beam"/><div className="ring r1"/><div className="ring r2"/><div className="ring r3"/><AIEngine/></div>
   </section>
   <section className="launchStrip"><div className="shell launchGrid"><div><p>Origin Income Public Launch</p><strong>15. August 2026</strong></div><Countdown/><div className="launchText">Origin AI wird zur persönlichen Plattform für Idee, Marke, Umsetzung und Wachstum.</div></div></section>
   <section className="ticker"><div><span>AI DISCOVERY</span><i>◆</i><span>OPPORTUNITY INTELLIGENCE</span><i>◆</i><span>BRAND BUILDER</span><i>◆</i><span>EXECUTION CO-PILOT</span></div></section>
   <section className="originAi shell" id="origin-ai"><div className="sectionLabel">Meet Origin AI</div><div className="originAiGrid"><div className="originAiCopy"><h2>Deine KI antwortet nicht nur.<br/><em>Sie baut mit dir.</em></h2><p>Origin AI ist dein diskreter digitaler Mitgründer. Sie verbindet deine persönlichen Voraussetzungen mit strukturierten Geschäftsprozessen und macht daraus konkrete Entscheidungen, Inhalte und nächste Schritte.</p><div className="aiPromise"><span>Origin AI</span><strong>Always building with you.</strong></div></div><div className="activityPanel"><div className="activityHeader"><div><i/> Origin AI Activity</div><span>LIVE SYSTEM PREVIEW</span></div><div className="activityList"><div className="activity done"><b>✓</b><span><strong>Skills analysed</strong><small>Sales, communication and industry knowledge detected</small></span></div><div className="activity done"><b>✓</b><span><strong>Opportunity identified</strong><small>High-margin service model selected</small></span></div><div className="activity working"><b>•</b><span><strong>Creating your offer</strong><small>Outcome, positioning and pricing are being generated</small></span></div><div className="activity"><b>04</b><span><strong>Designing brand identity</strong><small>Queued after offer validation</small></span></div></div></div></div></section>
   <section className="section shell" id="system"><div className="sectionHead"><div><p className="kicker">The Origin Intelligence System</p><h2>Von deiner Ausgangslage<br/>zum umsetzbaren Business.</h2></div><p>Die KI ist keine Dekoration. Jeder Schritt dient besseren Entscheidungen, weniger Überforderung und schnellerer Umsetzung.</p></div><div className="featureGrid">{cards.map(([n,t,c])=><article className="feature" key={n}><div className="featureNo">{n}</div><div className="featureIcon"><span/><span/></div><h3>{t}</h3><p>{c}</p></article>)}</div></section>
   <section className="outputs" id="outputs"><div className="shell"><div className="outputsHead"><div><p className="kicker">What Origin AI creates</p><h2>Aus deinen Antworten entsteht<br/>mehr als nur ein Report.</h2></div><p>Origin AI verwandelt dein Profil in ein zusammenhängendes Business-System, das später laufend erweitert und optimiert wird.</p></div><div className="outputGrid">{outputs.map((o,i)=><article className="outputCard" key={o}><div className="outputTop"><span>{String(i+1).padStart(2,"0")}</span><b>AI GENERATED</b></div><h3>{o}</h3><p>{["Ein passendes Modell statt hundert zufälliger Ideen.","Eine Zielgruppe mit konkretem Problem und Kaufmotivation.","Ein Angebot mit Nutzen, Struktur und Preisrahmen.","Positionierung, Name, Sprache und visuelle Richtung.","Hero, Inhalte, Seitenstruktur und Conversion-Logik.","Kanäle, Inhalte und erste Schritte zur Kundengewinnung."][i]}</p><div className="outputLine"><i/></div></article>)}</div></div></section>
   <section className="onboardCta shell"><div className="ctaGlow"/><p className="kicker">Origin AI Discovery</p><h2>30 Fragen.<br/>Dein Business beginnt.</h2><p>In weniger als zehn Minuten lernt Origin AI deine Ziele, Fähigkeiten, Möglichkeiten und Grenzen kennen. Daraus entsteht dein erster persönlicher Business-Report.</p><Link href="/onboarding">Meine AI Discovery starten <span>↗</span></Link></section>
  </main>
  <footer className="footer shell"><div className="footerBrand"><Logo size={34}/><span>ORIGIN <b>INCOME</b></span></div><div>© 2026 Origin Income · Built with Origin Intelligence</div><div><a href="mailto:hello@originincome.com">hello@originincome.com</a><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div></footer>
 </>;
}