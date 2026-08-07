"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BusinessDNA, VaultAsset, VaultCategory, loadBusinessDNA, loadVault, saveBusinessDNA, saveVault, upsertVaultAsset } from "../../lib/vault";

const categories: VaultCategory[]=["Business","Sales","Marketing","Dokumente","Origin AI"];
const labels:Record<VaultCategory,string>={Business:"Business",Sales:"Sales",Marketing:"Marketing",Dokumente:"Dokumente","Origin AI":"Origin AI"};

export default function VaultClient({firstName,plan,journey}:{firstName:string;plan:string;journey:string}){
  const [assets,setAssets]=useState<VaultAsset[]>([]);
  const [dna,setDna]=useState<BusinessDNA>({journey,niche:"",targetGroup:"",coreProblem:"",outcome:"",positioning:"",language:"Deutsch",tone:"Klar, professionell, direkt"});
  const [category,setCategory]=useState<VaultCategory|"Alle">("Alle");
  const [selected,setSelected]=useState<VaultAsset|null>(null);
  const [aiOpen,setAiOpen]=useState(false);
  const [aiType,setAiType]=useState("Positionierung");
  const [aiGoal,setAiGoal]=useState("");
  const [notice,setNotice]=useState("");

  useEffect(()=>{
    let current=loadVault();
    let nextDna={...loadBusinessDNA(),journey};
    try{
      const progressKey=journey==="lead-generation-agency"?"origin_lead_generation_progress":journey==="ai-automation-agency"?"origin_ai_automation_progress":"";
      const progress=progressKey?JSON.parse(localStorage.getItem(progressKey)||"{}"):{};
      const mission1Complete=[0,1,2,3].every(i=>progress?.done?.[`1-${i}`]);
      if(mission1Complete){
        const now=new Date().toISOString();
        const titles=journey==="lead-generation-agency"?["Nischen-Scorecard","Positionierungs-Canvas"]:["Positionierungs-Canvas","Kernangebot-Briefing"];
        titles.forEach((title,index)=>{
          if(!current.some(x=>x.id===`${journey}-m1-asset${index}`)) current.unshift({id:`${journey}-m1-asset${index}`,title,category:index===0?"Business":"Dokumente",type:index===0?"Canvas":"Blueprint",status:"prepared",journey,mission:1,createdAt:now,updatedAt:now,source:"mission"});
        });
        saveVault(current);
      }
      if(journey==="lead-generation-agency"){
        const d=JSON.parse(localStorage.getItem("origin_lead_generation_progress_mission1_draft")||"{}");
        const niche=(d.customNiche||d.niche||nextDna.niche||"").trim();
        const positioning=d.targetGroup&&d.coreProblem&&d.outcome?`Ich helfe ${d.targetGroup}, die ${d.coreProblem}, dabei ${d.outcome}${d.differentiator?`, ${d.differentiator}`:""}.`:nextDna.positioning;
        nextDna={...nextDna,niche,targetGroup:d.targetGroup||nextDna.targetGroup,coreProblem:d.coreProblem||nextDna.coreProblem,outcome:d.outcome||nextDna.outcome,positioning};
        saveBusinessDNA(nextDna);
      }
    }catch{}
    setAssets(current);setDna(nextDna);
  },[journey]);
  const filtered=useMemo(()=>category==="Alle"?assets:assets.filter(x=>x.category===category),[assets,category]);
  const saved=assets.filter(x=>x.status==="saved"||x.status==="draft").length;

  function storeDNA(next:BusinessDNA){setDna(next);saveBusinessDNA(next);setNotice("Business DNA gespeichert");setTimeout(()=>setNotice(""),1800)}
  function createDraft(){
    const now=new Date().toISOString();
    const title=aiType;
    const context=[dna.positioning&&`Positionierung: ${dna.positioning}`,dna.niche&&`Nische: ${dna.niche}`,dna.targetGroup&&`Zielgruppe: ${dna.targetGroup}`,aiGoal&&`Ziel: ${aiGoal}`].filter(Boolean).join("\n");
    const content=`ORIGIN AI WORKFLOW – VORBEREITETER ENTWURF\n\n${context||"Business-Kontext wird in den kommenden Missionen ergänzt."}\n\nDieser Asset-Workflow ist für Origin AI vorbereitet. Sobald die AI-Engine integriert ist, wird hier automatisch ein individueller ${title}-Entwurf aus deiner Business DNA erzeugt.`;
    const asset:VaultAsset={id:`ai-${Date.now()}`,title,category:aiType.includes("Cold")?"Sales":aiType.includes("Landing")?"Marketing":aiType.includes("SOP")?"Dokumente":"Origin AI",type:"AI Asset",status:"draft",journey,mission:1,createdAt:now,updatedAt:now,content,source:"origin-ai"};
    const next=upsertVaultAsset(asset);setAssets(next);setAiOpen(false);setSelected(asset);setNotice("Asset im Vault vorbereitet");setTimeout(()=>setNotice(""),1800);
  }
  function remove(id:string){const next=assets.filter(x=>x.id!==id);saveVault(next);setAssets(next);setSelected(null)}

  return <main className="vaultPageShell">
    <aside className="vaultSide">
      <Link href="/dashboard" className="journeyLogo"><span>O</span> ORIGIN <b>INCOME</b></Link>
      <small>BUSINESS OPERATING SYSTEM</small><h2>Business<br/>Vault</h2>
      <nav><button className={category==="Alle"?"active":""} onClick={()=>setCategory("Alle")}><span>⌂</span>Alle Assets<em>{assets.length}</em></button>{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}><span>{c==="Business"?"◫":c==="Sales"?"↗":c==="Marketing"?"✦":c==="Dokumente"?"▤":"OI"}</span>{labels[c]}<em>{assets.filter(x=>x.category===c).length}</em></button>)}</nav>
      <button className="vaultAiLaunch" onClick={()=>setAiOpen(true)}><span>✦</span><div><small>ORIGIN AI</small><b>Asset erstellen</b></div></button>
      <Link className="journeyBack" href={`/journey/${journey}`}>← Zurück zur Journey</Link>
    </aside>
    <section className="vaultMain">
      <header><div><span className="journeyLive"/> VAULT ACTIVE · {plan.toUpperCase()}</div><span>{firstName} · {saved} Business Assets</span></header>
      <div className="vaultContent">
        <section className="vaultHero"><div><small>DEIN DIGITALES BUSINESS-GEDÄCHTNIS</small><h1>Alles, was dein Unternehmen<br/><em>Schritt für Schritt aufbaut.</em></h1><p>Missionen erzeugen Entscheidungen. Origin AI verwandelt diese später in individuelle Assets. Dein Vault hält beides an einem Ort – statt dich mit generischen Vorlagen zu überladen.</p><div className="vaultHeroActions"><button onClick={()=>setAiOpen(true)}>✦ Mit Origin AI erstellen</button><Link href={`/journey/${journey}`}>Journey fortsetzen →</Link></div></div><div className="vaultHeroStat"><strong>{assets.length}</strong><span>ASSETS</span><small>{saved} erstellt · {assets.length-saved} vorbereitet</small></div></section>

        <section className="dnaCard"><div><small>BUSINESS DNA</small><h2>Origin AI soll dein Business kennen – nicht jedes Mal neu kennenlernen.</h2><p>Diese Daten werden später automatisch als Kontext an Origin AI übergeben. Heute bereitest du das Fundament dafür vor.</p></div><div className="dnaGrid"><label>Nische<input value={dna.niche} onChange={e=>setDna({...dna,niche:e.target.value})} placeholder="z. B. Physiotherapiepraxen"/></label><label>Zielgruppe<input value={dna.targetGroup} onChange={e=>setDna({...dna,targetGroup:e.target.value})} placeholder="z. B. Inhaber mit 2–10 Mitarbeitenden"/></label><label>Kernproblem<input value={dna.coreProblem} onChange={e=>setDna({...dna,coreProblem:e.target.value})} placeholder="z. B. unplanbare Neukundengewinnung"/></label><label>Gewünschtes Ergebnis<input value={dna.outcome} onChange={e=>setDna({...dna,outcome:e.target.value})} placeholder="z. B. planbar qualifizierte Erstgespräche"/></label><label className="wide">Positionierung<textarea value={dna.positioning} onChange={e=>setDna({...dna,positioning:e.target.value})} placeholder="Ich helfe ..."/></label><label>Sprache<input value={dna.language} onChange={e=>setDna({...dna,language:e.target.value})}/></label><label>Ton<input value={dna.tone} onChange={e=>setDna({...dna,tone:e.target.value})}/></label></div><button onClick={()=>storeDNA(dna)}>Business DNA speichern ✓</button></section>

        <section className="vaultSectionHead"><div><small>{category==="Alle"?"ALLE KATEGORIEN":category.toUpperCase()}</small><h2>Deine Business Assets</h2></div><button onClick={()=>setAiOpen(true)}>+ Neues Asset</button></section>
        {filtered.length===0?<section className="vaultEmpty"><span>⌁</span><small>DEIN VAULT IST BEREIT</small><h2>Hier entsteht dein Unternehmen.</h2><p>Schliesse Missionen ab oder bereite mit Origin AI dein erstes individuelles Asset vor. Keine generische Download-Bibliothek – nur Dinge, die zu deinem Business gehören.</p><button onClick={()=>setAiOpen(true)}>Erstes Asset vorbereiten →</button></section>:<section className="vaultAssetGrid">{filtered.map(a=><button key={a.id} onClick={()=>setSelected(a)} className={`vaultAsset ${a.status}`}><div><span>{a.category==="Origin AI"?"✦":"⌁"}</span><small>{a.category} · MISSION {a.mission}</small></div><h3>{a.title}</h3><p>{a.status==="prepared"?"Aus deiner Journey vorbereitet":a.status==="draft"?"Origin AI Workflow vorbereitet":"Im Vault gespeichert"}</p><footer><em>{a.type}</em><b>{a.status==="prepared"?"BEREIT":a.status.toUpperCase()}</b></footer></button>)}</section>}
      </div>
    </section>

    {selected&&<div className="assetBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className="assetModal"><button className="vaultClose" onClick={()=>setSelected(null)}>×</button><small>{selected.category} · {selected.type}</small><h2>{selected.title}</h2><p>{selected.content||"Dieses Asset wurde durch deine Mission vorbereitet. Sobald Origin AI vollständig integriert ist, wird der Inhalt aus deiner Business DNA individuell erzeugt."}</p><div className="assetMeta"><span>Mission {selected.mission}</span><span>{selected.status}</span><span>{new Date(selected.updatedAt).toLocaleDateString("de-CH")}</span></div><div className="assetActions"><button onClick={()=>setAiOpen(true)}>✦ Mit Origin AI weiterarbeiten</button><button className="danger" onClick={()=>remove(selected.id)}>Entfernen</button></div></section></div>}

    {aiOpen&&<div className="assetBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setAiOpen(false)}}><section className="aiWorkflowModal"><button className="vaultClose" onClick={()=>setAiOpen(false)}>×</button><small>ORIGIN AI · WORKFLOW PREPARATION</small><h2>Was soll dein Co-Founder erstellen?</h2><p>Origin AI wird später deine Business DNA, Journey, Mission und bisherigen Assets automatisch als Kontext erhalten.</p><div className="aiTypeGrid">{["Positionierung","Angebot","Preisliste","Landingpage","Cold-Mail-Sequenz","SOP","Elevator Pitch","Value Proposition"].map(x=><button key={x} className={aiType===x?"active":""} onClick={()=>setAiType(x)}>{x}</button>)}</div><label className="aiGoal">Was soll besonders berücksichtigt werden?<textarea value={aiGoal} onChange={e=>setAiGoal(e.target.value)} placeholder="Optional: z. B. premium, Schweizer Markt, klare Sprache ..."/></label><div className="aiContextPreview"><small>BUSINESS DNA CONTEXT</small><span>{dna.niche||"Nische noch offen"}</span><span>{dna.targetGroup||"Zielgruppe noch offen"}</span><span>{dna.positioning||"Positionierung wird aus Mission 1 übernommen"}</span></div><button className="aiCreate" onClick={createDraft}>✦ Workflow vorbereiten & im Vault speichern</button><em>Die echte Text-/Dokumentgenerierung folgt mit der Origin-AI-Engine. Dieser Workflow und die Kontextübergabe sind jetzt vorbereitet.</em></section></div>}
    {notice&&<div className="vaultToast">✓ {notice}</div>}
  </main>
}
