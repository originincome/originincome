"use client";
import Link from "next/link";
import {useMemo,useState} from "react";

const questions = [["Grundlage", "Wie alt bist du?", "number", []], ["Grundlage", "In welchem Land lebst du?", "text", []], ["Grundlage", "Was ist deine aktuelle berufliche Situation?", "choice", ["Angestellt", "Selbstständig", "In Ausbildung", "Arbeitssuchend", "Andere"]], ["Grundlage", "Wie hoch ist dein monatliches Nettoeinkommen ungefähr?", "choice", ["Unter CHF 3’000", "CHF 3’000–6’000", "CHF 6’000–10’000", "Über CHF 10’000"]], ["Grundlage", "Wie viel Startkapital möchtest du einsetzen?", "choice", ["Unter CHF 500", "CHF 500–2’000", "CHF 2’000–10’000", "Über CHF 10’000"]], ["Zeit", "Wie viele Stunden pro Woche kannst du investieren?", "choice", ["Unter 3 Stunden", "3–5 Stunden", "5–10 Stunden", "10–20 Stunden", "Über 20 Stunden"]], ["Zeit", "Wann kannst du am zuverlässigsten arbeiten?", "choice", ["Morgens", "Tagsüber", "Abends", "Wochenende", "Flexibel"]], ["Zeit", "Wie lange willst du bis zu ersten Einnahmen realistisch einplanen?", "choice", ["Unter 1 Monat", "1–3 Monate", "3–6 Monate", "6–12 Monate"]], ["Ziele", "Welches monatliche Zusatzeinkommen ist dein erstes Ziel?", "choice", ["CHF 500", "CHF 1’000", "CHF 2’500", "CHF 5’000+"]], ["Ziele", "Was ist dein langfristiges Hauptziel?", "choice", ["Finanzielle Sicherheit", "Mehr Freiheit", "Vollzeit-Selbstständigkeit", "Vermögen aufbauen", "Etwas Sinnvolles schaffen"]], ["Ziele", "Wie wichtig ist dir Skalierbarkeit?", "scale", []], ["Ziele", "Wie wichtig ist dir planbares Einkommen?", "scale", []], ["Fähigkeiten", "Wie stark bist du im Verkauf?", "scale", []], ["Fähigkeiten", "Wie stark bist du im Schreiben und Kommunizieren?", "scale", []], ["Fähigkeiten", "Wie stark bist du technisch/digital?", "scale", []], ["Fähigkeiten", "Wie stark bist du in Organisation und Umsetzung?", "scale", []], ["Fähigkeiten", "Welche Erfahrung bringst du bereits mit?", "multi", ["Verkauf", "Marketing", "Design", "Programmierung", "Beratung", "Handwerk", "Finanzen", "Social Media", "Keine"]], ["Interessen", "Welche Themen interessieren dich besonders?", "multi", ["Fitness", "Finanzen", "Technologie", "Beauty", "Mode", "Reisen", "Haustiere", "Gaming", "Bildung", "Business"]], ["Interessen", "Arbeitest du lieber mit Menschen oder Systemen?", "choice", ["Vor allem Menschen", "Eher Menschen", "Beides", "Eher Systeme", "Vor allem Systeme"]], ["Interessen", "Möchtest du selbst sichtbar sein?", "choice", ["Ja, gerne", "Teilweise", "Lieber nicht", "Noch unsicher"]], ["Modell", "Was reizt dich mehr?", "choice", ["Dienstleistung", "Digitales Produkt", "E-Commerce", "Content/Community", "Software/KI", "Noch offen"]], ["Modell", "Möchtest du eher lokal oder online arbeiten?", "choice", ["Lokal", "Online", "Hybrid", "Noch offen"]], ["Modell", "Wie wichtig ist dir ein Geschäftsmodell ohne Lager/Logistik?", "scale", []], ["Risiko", "Wie hoch ist deine Risikobereitschaft?", "scale", []], ["Risiko", "Wie gehst du mit Unsicherheit um?", "choice", ["Ich brauche klare Sicherheit", "Mit Plan geht es", "Ich kann gut experimentieren", "Ich liebe Risiko"]], ["Arbeitsstil", "Arbeitest du lieber allein oder im Team?", "choice", ["Allein", "Kleines Team", "Beides", "Grosses Team"]], ["Arbeitsstil", "Was bremst dich aktuell am meisten?", "choice", ["Keine klare Idee", "Zu viele Ideen", "Zeitmangel", "Angst vor Fehlern", "Technisches Wissen", "Disziplin"]], ["Arbeitsstil", "Wie konsequent setzt du Pläne um?", "scale", []], ["Positionierung", "Welche Wirkung soll deine zukünftige Marke haben?", "multi", ["Premium", "Vertrauenswürdig", "Innovativ", "Nahbar", "Mutig", "Minimalistisch"]], ["Positionierung", "Beschreibe in einem Satz, was du dir von Origin Income erwartest.", "text", []]] as const;
type Answer=string|string[]|number;

function direction(a:Record<number,Answer>){
  const model=String(a[20]||"Noch offen");
  let title="Digitale Expertenmarke";
  let text="Ein schlankes, wissensbasiertes Modell mit klarer Positionierung, hochwertigem Angebot und organischem Vertrauensaufbau.";
  if(model.includes("E-Commerce")){title="Fokussierte E-Commerce-Marke";text="Ein eng positioniertes Produktkonzept mit klarer Zielgruppe, Premium-Auftritt und kontrolliertem Testbudget."}
  if(model.includes("Software")){title="KI-gestütztes Micro-SaaS";text="Ein kleines digitales Werkzeug, das ein konkretes Problem für eine klar definierte Zielgruppe löst."}
  if(model.includes("Content")){title="Content- und Community-Business";text="Eine Medienmarke, die Vertrauen aufbaut und später Produkte, Mitgliedschaften oder Partnerschaften monetarisiert."}
  if(model.includes("Dienstleistung")){title="Premium-Service-Business";text="Ein spezialisiertes Angebot mit hoher Marge, direktem Kundenkontakt und schneller Validierung."}
  return {title,text};
}

export default function Onboarding(){
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState<Record<number,Answer>>({});
  const [done,setDone]=useState(false);
  const q=questions[step];
  const value=answers[step];
  const report=useMemo(()=>direction(answers),[answers]);
  const progress=Math.round(((step+(done?1:0))/questions.length)*100);

  function set(v:Answer){setAnswers(x=>({...x,[step]:v}))}
  function next(){if(step<questions.length-1)setStep(x=>x+1);else setDone(true)}
  function back(){if(done)setDone(false);else if(step>0)setStep(x=>x-1)}
  function toggle(opt:string){const arr=Array.isArray(value)?value:[];set(arr.includes(opt)?arr.filter(x=>x!==opt):[...arr,opt])}
  const valid=Array.isArray(value)?value.length>0:value!==undefined&&String(value).trim()!=="";

  return <main className="obPage">
    <header className="obNav"><Link href="/" className="obBrand">ORIGIN <b>INCOME</b></Link><span>Origin Profile Engine</span><span>{done?"Analyse":`${step+1} / ${questions.length}`}</span></header>
    <div className="obProgress"><span style={{width:`${progress}%`}}/></div>

    {!done?<section className="obWrap">
      <div className="obMeta"><span>{q[0]}</span><small>Frage {step+1} von {questions.length}</small></div>
      <h1>{q[1]}</h1>
      <div className="answerArea">
        {q[2]==="text"&&<textarea autoFocus value={String(value||"")} onChange={e=>set(e.target.value)} placeholder="Deine Antwort…"/>}
        {q[2]==="number"&&<input autoFocus type="number" value={String(value||"")} onChange={e=>set(e.target.value)} placeholder="Zum Beispiel: 30"/>}
        {q[2]==="choice"&&<div className="optionGrid">{q[3].map(opt=><button type="button" className={value===opt?"selected":""} onClick={()=>set(opt)} key={opt}><span>{opt}</span><i>{value===opt?"✓":"→"}</i></button>)}</div>}
        {q[2]==="multi"&&<div className="optionGrid">{q[3].map(opt=>{const yes=Array.isArray(value)&&value.includes(opt);return <button type="button" className={yes?"selected":""} onClick={()=>toggle(opt)} key={opt}><span>{opt}</span><i>{yes?"✓":"+"}</i></button>})}</div>}
        {q[2]==="scale"&&<div className="scale"><div><span>1</span><span>10</span></div><input type="range" min="1" max="10" value={Number(value||5)} onChange={e=>set(Number(e.target.value))}/><strong>{Number(value||5)} / 10</strong></div>}
      </div>
      <div className="obActions"><button type="button" className="back" onClick={back} disabled={step===0}>← Zurück</button><button type="button" className="next" onClick={next} disabled={!valid}>Weiter <span>→</span></button></div>
    </section>:<section className="resultWrap">
      <div className="resultTop"><p>Dein erster Origin Report</p><h1>{report.title}</h1><span>{report.text}</span></div>
      <div className="resultGrid">
        <article><small>Empfohlener Fokus</small><strong>{String(answers[20]||"Digitales Geschäftsmodell")}</strong><p>Das Modell passt am besten zu deinen aktuellen Präferenzen.</p></article>
        <article><small>Zeitfenster</small><strong>{String(answers[5]||"Noch offen")}</strong><p>Die Roadmap wird auf dieses wöchentliche Zeitbudget ausgerichtet.</p></article>
        <article><small>Startbudget</small><strong>{String(answers[4]||"Noch offen")}</strong><p>Die ersten Tests werden bewusst innerhalb dieses Rahmens geplant.</p></article>
      </div>
      <div className="roadmap"><h2>Deine ersten vier Schritte</h2><ol>
        <li><span>01</span><div><b>Positionierung schärfen</b><p>Zielgruppe, Problem und glaubwürdiges Versprechen definieren.</p></div></li>
        <li><span>02</span><div><b>Angebot entwerfen</b><p>Ein erstes testbares Angebot mit klarem Ergebnis und Preisrahmen formulieren.</p></div></li>
        <li><span>03</span><div><b>Marke sichtbar machen</b><p>Name, visuelle Richtung, Landingpage und erste Inhalte aufbauen.</p></div></li>
        <li><span>04</span><div><b>Marktvalidierung starten</b><p>Mit Gesprächen, Sign-ups oder Vorverkäufen echte Nachfrage prüfen.</p></div></li>
      </ol></div>
      <div className="resultActions"><button onClick={()=>{setDone(false);setStep(0)}}>Antworten bearbeiten</button><a href="mailto:hello@originincome.com?subject=Mein Origin Report">Report besprechen ↗</a></div>
      <p className="disclaimer">V2-Demo: Die Antworten bleiben im laufenden Browserzustand. Benutzerkonto, Datenbank und serverseitige KI-Auswertung folgen als nächste Ausbaustufe.</p>
    </section>}
  </main>
}
