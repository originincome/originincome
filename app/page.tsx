"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";

function Logo({size=44}:{size?:number}) {
  const id=`gold-${size}`;
  return <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={id} x1="20" y1="10" x2="140" y2="150">
        <stop stopColor="#FFF2A8"/><stop offset=".45" stopColor="#D4AF37"/><stop offset="1" stopColor="#7F5208"/>
      </linearGradient>
      <filter id={`shadow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="13" stdDeviation="10" floodColor="#D4AF37" floodOpacity=".28"/>
      </filter>
    </defs>
    <g filter={`url(#shadow-${size})`}>
      <path d="M80 10 138 44v68l-58 38-58-38V44L80 10Z" fill="#090909" stroke={`url(#${id})`} strokeWidth="3"/>
      <path d="M43 105 73 49l24 40" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m72 107 46-52" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round"/>
      <path d="M101 54h17v17" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
}

function Countdown(){
  const target=useMemo(()=>new Date("2026-08-15T19:00:00+02:00").getTime(),[]);
  const [left,setLeft]=useState(Math.max(0,target-Date.now()));
  useEffect(()=>{const t=setInterval(()=>setLeft(Math.max(0,target-Date.now())),1000);return()=>clearInterval(t)},[target]);
  const vals=[["Tage",Math.floor(left/86400000)],["Std.",Math.floor((left%86400000)/3600000)],["Min.",Math.floor((left%3600000)/60000)],["Sek.",Math.floor((left%60000)/1000)]];
  return <div className="countdown">{vals.map(([l,v])=><div className="countItem" key={l}><strong>{String(v).padStart(2,"0")}</strong><span>{l}</span></div>)}</div>
}

const features=[
  ["01","Profil verstehen","30 präzise Fragen erfassen Ziele, Zeit, Budget, Interessen, Fähigkeiten und Risikoprofil."],
  ["02","Opportunity Engine","Das System filtert passende Geschäftsmodelle und priorisiert sie nach Machbarkeit und Potenzial."],
  ["03","Brand Builder","Name, Positionierung, visuelle Identität, Angebot und Markenstimme entstehen aus einem System."],
  ["04","Execution Roadmap","Aus der Idee wird ein geführter Plan mit konkreten Aufgaben, Meilensteinen und Fortschritt."]
];

export default function Home(){
  const [intro,setIntro]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setIntro(false),3900);return()=>clearTimeout(t)},[]);
  return <>
    <div className={`intro ${intro?"":"gone"}`}>
      <div className="introLogo"><Logo size={150}/></div>
      <div className="introLine introOne">Jeder Erfolg hat einen Ursprung.</div>
      <div className="introLine introTwo">Willkommen bei Origin Income.</div>
    </div>
    <div className="noise"/><div className="aurora a1"/><div className="aurora a2"/>
    <header className="nav shell">
      <Link href="/" className="brand"><Logo/><span>ORIGIN <b>INCOME</b></span></Link>
      <nav><a href="#system">System</a><a href="#identity">Identität</a><Link className="navBtn" href="/onboarding">AI-Onboarding starten</Link></nav>
    </header>
    <main>
      <section className="hero shell">
        <div className="heroCopy">
          <div className="eyebrow"><span/> Origin Intelligence System</div>
          <h1>Dein zweites Einkommen.<br/><em>Mit System gebaut.</em></h1>
          <p className="lead">Origin Income verbindet KI, Strategie und klare Umsetzung zu einem persönlichen Weg vom ersten Gedanken bis zum funktionierenden Business.</p>
          <div className="heroActions">
            <Link className="primary" href="/onboarding">30-Fragen-Analyse starten <i>↗</i></Link>
            <a className="secondary" href="#system">System entdecken</a>
          </div>
          <div className="proof"><span><b>30</b> Profilfragen</span><span><b>1</b> persönliche Roadmap</span><span><b>0</b> leere Versprechen</span></div>
        </div>
        <div className="scene">
          <div className="beam"/><div className="ring r1"/><div className="ring r2"/><div className="ring r3"/>
          <div className="core">
            <div className="coreTop"><span>ORIGIN / INTELLIGENCE</span><span>V2.0</span></div>
            <div className="coreLogo"><Logo size={150}/></div>
            <div className="coreName">ORIGIN <b>INCOME</b></div>
            <div className="coreText">PERSONAL BUSINESS OPERATING SYSTEM</div>
            <div className="signal"><span/><span/><span/><span/><span/></div>
            <div className="launch"><span>Public Launch</span><b>15. August 2026</b></div>
            <Countdown/>
          </div>
          <div className="dataCard dc1"><small>Profil Match</small><strong>94%</strong><span>Business-Fit</span></div>
          <div className="dataCard dc2"><small>Nächster Schritt</small><strong>01</strong><span>Positionierung</span></div>
          <div className="dataCard dc3"><small>System Status</small><strong>LIVE</strong><span>Roadmap aktiv</span></div>
        </div>
      </section>
      <section className="ticker"><div><span>KLARHEIT</span><i>◆</i><span>STRATEGIE</span><i>◆</i><span>IDENTITÄT</span><i>◆</i><span>UMSETZUNG</span><i>◆</i><span>WACHSTUM</span></div></section>
      <section className="section shell" id="system">
        <div className="sectionHead">
          <div><p className="kicker">Das Origin System</p><h2>Aus Möglichkeiten wird<br/>eine klare Richtung.</h2></div>
          <p>Kein generischer Chatbot und keine Sammlung zufälliger Tipps. Origin Income führt durch einen strukturierten Prozess, der Entscheidungen vorbereitet und Umsetzung sichtbar macht.</p>
        </div>
        <div className="featureGrid">{features.map(([n,t,c])=><article className="feature" key={n}><div className="featureNo">{n}</div><div className="featureIcon"><span/><span/></div><h3>{t}</h3><p>{c}</p></article>)}</div>
      </section>
      <section className="identity" id="identity">
        <div className="shell identityGrid">
          <div className="brandBoard">
            <div className="boardTop"><span>ORIGIN / BRAND SYSTEM</span><span>01—06</span></div>
            <div className="bigLogo"><Logo size={190}/></div>
            <div className="palette"><i/><i/><i/><i/></div>
            <div className="typeSpec"><strong>Aa</strong><div><b>Manrope</b><span>Precision / Confidence / Clarity</span></div></div>
            <div className="gridLines"/>
          </div>
          <div className="identityCopy">
            <p className="kicker">Komplette Markenidentität</p>
            <h2>Luxus ohne Show.<br/>Technologie ohne Kälte.</h2>
            <p>Die Marke verbindet schwarze Präzision mit warmem Gold. Ruhig, souverän und glaubwürdig – für Menschen, die nicht träumen wollen, sondern bauen.</p>
            <ul><li><span>01</span>Dreidimensionales Signet mit Aufwärtsbewegung</li><li><span>02</span>Modulares Designsystem für Website und Plattform</li><li><span>03</span>Typografie für Premium, Vertrauen und Lesbarkeit</li><li><span>04</span>Illustrationssystem aus Licht, Daten und Struktur</li></ul>
          </div>
        </div>
      </section>
      <section className="onboardCta shell">
        <div className="ctaGlow"/>
        <p className="kicker">Origin Profile Engine</p>
        <h2>30 Fragen.<br/>Ein klarer Ausgangspunkt.</h2>
        <p>Starte die erste Analyse und erhalte sofort ein strukturiertes Profil mit geeigneter Business-Richtung, Fokus und nächsten Schritten.</p>
        <Link href="/onboarding">AI-Onboarding starten <span>↗</span></Link>
      </section>
    </main>
    <footer className="footer shell"><div className="footerBrand"><Logo size={34}/><span>ORIGIN <b>INCOME</b></span></div><div>© 2026 Origin Income · Schweiz</div><div><a href="mailto:hello@originincome.com">hello@originincome.com</a><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div></footer>
  </>
}
