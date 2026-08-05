"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createClient } from "../../lib/supabase/client";
import { calculateMatches, type AssessmentAnswers, type MatchResult } from "../../lib/matchmaking";

const Icon = ({ name }: { name: "home"|"profile"|"match"|"modules"|"ai"|"settings"|"arrow"|"lock"|"spark"|"check"|"clock"|"money"|"scale"|"close" }) => {
  const paths: Record<string, ReactNode> = {
    home:<><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M9 20v-6h6v6"/></>,
    profile:<><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
    match:<><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    modules:<><rect x="3" y="4" width="7" height="7" rx="1"/><rect x="14" y="4" width="7" height="7" rx="1"/><rect x="3" y="15" width="7" height="6" rx="1"/><rect x="14" y="15" width="7" height="6" rx="1"/></>,
    ai:<><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/><path d="m8.5 5.5-2-2M17.5 18.5l-2-2M18.5 5.5l2-2M5.5 18.5l-2 2"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9A1.7 1.7 0 0 0 21 10h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    arrow:<><path d="M5 12h14M13 6l6 6-6 6"/></>, lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    spark:<><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/></>, check:<path d="m5 12 4 4L19 6"/>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>, money:<><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5c-.8-.8-2-1.2-3.5-1.2-2 0-3.5 1-3.5 2.6 0 3.8 7 1.8 7 5.4 0 1.5-1.4 2.7-3.6 2.7-1.6 0-3-.5-4-1.5M12 5v14"/></>,
    scale:<><path d="M4 19h16M12 4v15M6 7h12M6 7l-3 6h6L6 7ZM18 7l-3 6h6l-3-6Z"/></>, close:<><path d="M5 5l14 14M19 5 5 19"/></>
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

type Props={firstName:string;fullName:string;initials:string;metadataAnswers?:AssessmentAnswers;metadataMatches?:MatchResult[];metadataSelected?:string|null;initialPlan?:string|null;initialPaymentStatus?:string;initialAccessStatus?:string};

export default function DashboardClient({firstName,fullName,initials,metadataAnswers,metadataMatches,metadataSelected,initialPlan,initialPaymentStatus="unpaid",initialAccessStatus="locked"}:Props){
  const supabase=useMemo(()=>createClient(),[]);
  const [answers,setAnswers]=useState<AssessmentAnswers>(metadataAnswers||{});
  const [matches,setMatches]=useState<MatchResult[]>(metadataMatches||[]);
  const [selected,setSelected]=useState<string|null>(metadataSelected||null);
  const [detail,setDetail]=useState<MatchResult|null>(null);
  const [view,setView]=useState<"overview"|"matches">("overview");
  const [saving,setSaving]=useState(false);
  const [plan,setPlan]=useState<string|null>(initialPlan||null);
  const [paymentStatus,setPaymentStatus]=useState(initialPaymentStatus);
  const [accessStatus,setAccessStatus]=useState(initialAccessStatus);
  const hasPaidAccess=paymentStatus==="paid"&&accessStatus==="active";
  const planLabel=plan?plan.charAt(0).toUpperCase()+plan.slice(1):null;

  useEffect(()=>{
    try{
      const localAnswers=JSON.parse(localStorage.getItem("origin_assessment_answers")||"{}");
      const effective=Object.keys(localAnswers).length?localAnswers:answers;
      const computed=Object.keys(effective).length?calculateMatches(effective):matches;
      setAnswers(effective); setMatches(computed);
      const localSelected=localStorage.getItem("origin_selected_model")||selected;
      setSelected(localSelected);
      if(Object.keys(effective).length){
        supabase.auth.updateUser({data:{assessment_answers:effective,assessment_matches:computed,selected_business_model:localSelected||null,assessment_completed:true}}).catch(()=>undefined);
      }
    }catch{}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    let cancelled=false;
    fetch("/api/stripe/status",{cache:"no-store"})
      .then(r=>r.ok?r.json():null)
      .then(payload=>{
        if(cancelled||!payload?.profile)return;
        setPlan(payload.profile.chosen_plan||null);
        setPaymentStatus(payload.profile.payment_status||"unpaid");
        setAccessStatus(payload.profile.access_status||"locked");
        if(payload.profile.selected_business_model)setSelected(payload.profile.selected_business_model);
      })
      .catch(()=>undefined);
    return()=>{cancelled=true};
  },[]);

  async function choose(model:MatchResult){
    setSaving(true); setSelected(model.id); localStorage.setItem("origin_selected_model",model.id);
    await supabase.auth.updateUser({data:{selected_business_model:model.id,assessment_answers:answers,assessment_matches:matches,assessment_completed:true}});
    setSaving(false); setDetail(null); setView("overview");
  }
  async function logout(){await supabase.auth.signOut(); window.location.href="/";}
  const active=matches.find(m=>m.id===selected)||null;

  return <main className="odShell mmShell">
    <aside className="odSidebar">
      <Link href="/" className="odLogo"><span className="odLogoMark">O</span><span>ORIGIN <b>INCOME</b></span></Link>
      <nav className="odNav"><span className="odNavLabel">WORKSPACE</span>
        <button className={view==="overview"?"active":""} onClick={()=>setView("overview")}><Icon name="home"/><span>Übersicht</span></button>
        <Link href="/profil"><Icon name="profile"/><span>Mein Profil</span></Link>
        <button className={view==="matches"?"active":""} onClick={()=>setView("matches")}><Icon name="match"/><span>Meine Matches</span><small>LIVE</small></button>
        <a className="locked" aria-disabled="true"><Icon name="modules"/><span>Business-Module</span><small>{hasPaidAccess?"V10":"LOCKED"}</small></a>
        <a className="locked" aria-disabled="true"><Icon name="ai"/><span>Origin AI</span><small>{hasPaidAccess?"SOON":"LOCKED"}</small></a>
        <span className="odNavLabel second">ACCOUNT</span><Link href="/einstellungen"><Icon name="settings"/><span>Einstellungen</span></Link>
      </nav>
      <div className="odSidebarFoot"><div className="odMiniUser"><span>{initials}</span><div><b>{fullName}</b><small>Verified Member</small></div></div><button onClick={logout}>Abmelden</button></div>
    </aside>
    <section className="odMain"><header className="odTopbar"><div><span className="odLiveDot"/> ORIGIN INTELLIGENCE <small>MATCH ENGINE LIVE</small></div><div className="odTopActions"><span className="odAvatar">{initials}</span></div></header>
      <div className="odContent">
      {view==="overview"?<>
        <section className="odWelcome mmWelcome"><div><small>YOUR BUSINESS ORIGIN</small><h1>{active?<>Deine Richtung steht,<br/><em>{firstName}.</em></>:<>Deine Matches sind bereit,<br/><em>{firstName}.</em></>}</h1><p>{active?`${hasPaidAccess?`Dein ${planLabel||"Origin"}-Zugang ist aktiv. Deine ${active.name} Journey wird in V10 als vollständiges Modul-System freigeschaltet.`:`Du hast ${active.name} als dein Hauptmodell gewählt. Als Nächstes schalten wir deine persönliche Roadmap über Stripe frei.`}`:"Origin Intelligence hat alle sieben Business-Segmente mit deinem Profil verglichen. Öffne deine Resultate und wähle die Journey, die du aufbauen möchtest."}</p></div><div className="odStatusOrb"><div><span>{hasPaidAccess?"04":active?"03":"02"}</span><small>PHASE</small></div><p>{hasPaidAccess?`${planLabel||"Plan"} active`:active?"Model selected":"Matches ready"}</p></div></section>
        <section className="mmSignalBar"><span><Icon name="check"/> 20 Antworten analysiert</span><span><Icon name="spark"/> 7 Modelle verglichen</span><span><Icon name="match"/> 3 Top-Matches gefunden</span></section>
        {active?<section className="mmChosenHero">
          <div className="mmChosenSeal"><span>{active.icon}</span><small>{active.accent}</small></div><div className="mmChosenCopy"><small>DEINE GEWÄHLTE BUSINESS JOURNEY</small><h2>{active.name}</h2><p>{active.tagline}</p><div className="mmChosenMeta"><span><Icon name="money"/><b>{active.startBudget}</b><small>Startbudget</small></span><span><Icon name="clock"/><b>{active.firstRevenue}</b><small>Erste Einnahmen</small></span><span><Icon name="scale"/><b>{active.scalability}</b><small>Skalierbarkeit</small></span></div></div><div className="mmChosenAction"><strong>{active.score}%</strong><span>PERSONAL MATCH</span>{hasPaidAccess?<><div className="mmPaidBadge"><Icon name="check"/> {planLabel} aktiv</div><button className="mmUnlockButton" type="button" disabled>Business Journey folgt in V10</button><small>Kein erneuter Kauf erforderlich</small></>:<><Link className="mmUnlockButton" href="/checkout">Zugang freischalten <Icon name="arrow"/></Link><small>Stripe Checkout · Testmodus</small></>}</div>
        </section>:<section className="mmTopMatches"><div className="odSectionTitle"><div><small>AI MATCHMAKING COMPLETE</small><h2>Deine drei stärksten Modelle.</h2></div><button onClick={()=>setView("matches")}>Alle Resultate öffnen <Icon name="arrow"/></button></div><div className="mmCards">{matches.map((m,i)=><MatchCard key={m.id} model={m} rank={i+1} onOpen={()=>setDetail(m)} onChoose={()=>choose(m)} saving={saving}/>)}</div></section>}
        <section className="odGrid mmLowerGrid">
          <article className="odProfileCard"><div className="odCardTop"><span>ORIGIN PROFILE</span><small>COMPLETE</small></div><div className="odScoreRing"><div><strong>100</strong><span>%</span><small>PROFILE</small></div></div><h3>Dein Fundament steht.</h3><p>20 präzise Antworten bilden die Basis für dein persönliches Ranking.</p><div className="odProfileStats"><span><b>20</b> Antworten</span><span><b>7</b> Modelle</span><span><b>3</b> Matches</span></div><Link href="/onboarding">Assessment neu starten <Icon name="arrow"/></Link></article>
          <article className="mmRoadmapPreview"><div className="odCardTop"><span>YOUR ROADMAP</span><small>{hasPaidAccess?"PAID":active?"PREVIEW":"LOCKED"}</small></div><h3>{active?active.name:"Wähle zuerst dein Modell"}</h3><p>{active?(hasPaidAccess?"Dein Zugang ist bezahlt und dauerhaft gespeichert. Die interaktive 7-Schritte-Journey wird als Nächstes in V10 gebaut.":"Deine sieben Schritte sind vorbereitet. Nach Stripe werden sie als interaktive Journey freigeschaltet."):"Sobald du eines deiner drei Matches auswählst, richtet sich dein Dashboard auf dieses Business aus."}</p><ol>{(active?.modules||["Business-Modell auswählen","Persönliche Roadmap erhalten","Zugang freischalten"]).map((x,i)=><li key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><Icon name={hasPaidAccess?"check":"lock"}/></li>)}</ol></article>
          <article className="odAiCard"><div className="odAiVisual"><span/><span/><span/><span/><div>OI</div></div><small>ORIGIN INTELLIGENCE</small><h3>Your AI Co-Founder.</h3><p>Origin AI wird später dein gewähltes Modell, deine Assessment-Antworten und deinen Modulfortschritt kennen.</p><span className="odLockedLabel"><Icon name={hasPaidAccess?"check":"lock"}/> {hasPaidAccess?"Zugang aktiv · Origin AI folgt später":"Freischaltung nach Aktivierung"}</span></article>
        </section>
      </>:<section className="mmMatchesPage"><div className="mmMatchesHeader"><button onClick={()=>setView("overview")}>← Übersicht</button><small>ORIGIN INTELLIGENCE · FINAL RANKING</small><h1>Deine drei stärksten<br/><em>Business Matches.</em></h1><p>Das Ranking verbindet deine Ressourcen, Ziele, Stärken und Präferenzen. Öffne jedes Modell, vergleiche ehrlich und entscheide dich für deine Journey.</p></div><div className="mmCompareGrid">{matches.map((m,i)=><MatchCard key={m.id} model={m} rank={i+1} onOpen={()=>setDetail(m)} onChoose={()=>choose(m)} saving={saving} selected={selected===m.id}/>)}</div><div className="mmMethod"><Icon name="spark"/><div><small>SO ENTSTEHT DEIN SCORE</small><h3>Regelbasiert. Persönlich. Nachvollziehbar.</h3><p>Deine 20 Antworten werden gegen die Anforderungen aller sieben Modelle gewichtet. Die Prozentwerte werden nicht frei erfunden; sie basieren auf festen Signalen. Später ergänzt Origin AI diese Grundlage mit noch tieferen persönlichen Erklärungen.</p></div></div></section>}
      <footer className="odFooter"><span>ORIGIN INCOME © 2026</span><span>Jeder Erfolg hat einen Ursprung.</span><Link href="/">Zur Website ↗</Link></footer></div>
    </section>
    {detail&&<MatchModal model={detail} selected={selected===detail.id} saving={saving} onClose={()=>setDetail(null)} onChoose={()=>choose(detail)}/>} 
  </main>;
}

function MatchCard({model,rank,onOpen,onChoose,saving,selected=false}:{model:MatchResult;rank:number;onOpen:()=>void;onChoose:()=>void;saving:boolean;selected?:boolean}){
  return <article className={`mmCard ${rank===1?"winner":""} ${selected?"selected":""}`}><div className="mmCardGlow"/><div className="mmCardHead"><span className="mmRank">0{rank}</span><span className="mmCategory">{model.category}</span>{rank===1&&<small>BEST MATCH</small>}</div><div className="mmModelIcon">{model.icon}</div><h3>{model.name}</h3><p>{model.tagline}</p><div className="mmScore"><div><strong>{model.score}</strong><span>%</span></div><small>PERSONAL MATCH</small><i><b style={{width:`${model.score}%`}}/></i></div><div className="mmQuick"><span><small>START</small><b>{model.startBudget}</b></span><span><small>REVENUE</small><b>{model.firstRevenue}</b></span></div><ul>{model.why.slice(0,2).map(x=><li key={x}><Icon name="check"/>{x}</li>)}</ul><div className="mmCardActions"><button onClick={onOpen}>Details ansehen</button><button className="gold" onClick={onChoose} disabled={saving}>{selected?"Ausgewählt ✓":"Modell wählen"}</button></div></article>
}

function MatchModal({model,onClose,onChoose,saving,selected}:{model:MatchResult;onClose:()=>void;onChoose:()=>void;saving:boolean;selected:boolean}){
  return <div className="mmModalBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="mmModal"><button className="mmModalClose" onClick={onClose}><Icon name="close"/></button><div className="mmModalHero"><div className="mmModelIcon">{model.icon}</div><div><small>{model.category}</small><h2>{model.name}</h2><p>{model.tagline}</p></div><div className="mmModalScore"><strong>{model.score}%</strong><span>PERSONAL MATCH</span></div></div><div className="mmModalGrid"><div className="mmWhy"><small>WARUM ES ZU DIR PASST</small><h3>Deine persönlichen Match-Signale</h3><ul>{model.why.map(x=><li key={x}><Icon name="check"/><span>{x}</span></li>)}</ul></div><aside><small>REALITY CHECK</small><h3>Deine grösste Herausforderung</h3><p>{model.challenge}</p></aside></div><div className="mmFacts"><span><Icon name="money"/><small>STARTBUDGET</small><b>{model.startBudget}</b></span><span><Icon name="clock"/><small>ZEIT / WOCHE</small><b>{model.weeklyTime}</b></span><span><Icon name="arrow"/><small>ERSTE EINNAHMEN</small><b>{model.firstRevenue}</b></span><span><Icon name="scale"/><small>SKALIERUNG</small><b>{model.scalability}</b></span></div><div className="mmModuleStrip"><small>DEINE ZUKÜNFTIGE 7-SCHRITTE-ROADMAP</small><div>{model.modules.map((x,i)=><span key={x}><b>{String(i+1).padStart(2,"0")}</b>{x}</span>)}</div></div><div className="mmModalBottom"><p>Du kannst alle drei Matches vergleichen. Deine Wahl richtet danach Dashboard, Stripe-Checkout, Module und Origin AI auf dieses Modell aus.</p><button onClick={onChoose} disabled={saving||selected}>{selected?"Dieses Modell ist ausgewählt ✓":saving?"Wird gespeichert…":"Diese Business Journey wählen →"}</button></div></section></div>
}
