"use client";

import Link from "next/link";
import { FormEvent, MouseEvent, useEffect, useMemo, useState } from "react";

function Logo({ size = 44 }: { size?: number }) {
  const id = `origin-v4-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="18" y1="8" x2="145" y2="155">
          <stop stopColor="#FFF4BB" />
          <stop offset=".42" stopColor="#E0BC49" />
          <stop offset=".72" stopColor="#A66D0A" />
          <stop offset="1" stopColor="#583300" />
        </linearGradient>
        <filter id={`glow-${size}`} x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow dx="0" dy="12" stdDeviation="13" floodColor="#D4AF37" floodOpacity=".3" />
        </filter>
      </defs>
      <g filter={`url(#glow-${size})`}>
        <path d="M80 9 139 44v68l-59 39-59-39V44L80 9Z" fill="#070708" stroke={`url(#${id})`} strokeWidth="3" />
        <path d="M42 107 73 48l25 42" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m72 108 47-54" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" />
        <path d="M101 53h18v18" stroke={`url(#${id})`} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function Countdown() {
  const target = useMemo(() => new Date("2026-08-15T19:00:00+02:00").getTime(), []);
  const [left, setLeft] = useState(Math.max(0, target - Date.now()));

  useEffect(() => {
    const timer = window.setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const values: [string, number][] = [
    ["Tage", Math.floor(left / 86400000)],
    ["Std.", Math.floor((left % 86400000) / 3600000)],
    ["Min.", Math.floor((left % 3600000) / 60000)],
    ["Sek.", Math.floor((left % 60000) / 1000)],
  ];

  return (
    <div className="countdown">
      {values.map(([label, value]) => (
        <div className="countItem" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

const aiMessages = [
  "I found a business model that fits your skills.",
  "I would start with a premium service — not e-commerce.",
  "Your strongest advantage is trust-based selling.",
  "Next, I am building your first offer and pricing.",
];

const aiSteps = [
  "Profil und Fähigkeiten analysieren",
  "Marktchancen intelligent vergleichen",
  "Businessmodell und Angebot entwickeln",
  "Markenidentität und Website planen",
  "Persönliche Launch-Roadmap erstellen",
];

function useTypedMessage(messages: string[]) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const full = messages[messageIndex];
    if (typed.length < full.length) {
      const timer = window.setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 25);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setTyped("");
      setMessageIndex((index) => (index + 1) % messages.length);
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [typed, messageIndex, messages]);

  return typed;
}

function AIEngine() {
  const [active, setActive] = useState(0);
  const typed = useTypedMessage(aiMessages);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % aiSteps.length), 2800);
    return () => window.clearInterval(timer);
  }, []);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--rx", `${-y * 9}deg`);
    event.currentTarget.style.setProperty("--ry", `${x * 11}deg`);
    event.currentTarget.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    event.currentTarget.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };

  const resetTilt = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--rx", "1deg");
    event.currentTarget.style.setProperty("--ry", "-4deg");
  };

  return (
    <div className="aiEngineV4" onMouseMove={handleMove} onMouseLeave={resetTilt}>
      <div className="engineReflection" />
      <div className="engineHead">
        <div className="engineTitle">
          <Logo size={34} />
          <div>
            <b>Origin AI</b>
            <span><i /> Online · Your AI Co-Founder</span>
          </div>
        </div>
        <small>ORIGIN INTELLIGENCE</small>
      </div>

      <div className="aiSpeech">
        <span>ORIGIN AI SAYS</span>
        <p>{typed}<i className="cursor" /></p>
      </div>

      <div className="engineCurrent">
        <small>CURRENT PROCESS</small>
        <h3>{aiSteps[active]}</h3>
        <div className="engineBar"><span key={active} /></div>
      </div>

      <div className="engineList">
        {aiSteps.map((step, index) => (
          <div className={`engineRow ${index < active ? "done" : ""} ${index === active ? "active" : ""}`} key={step}>
            <b>{index < active ? "✓" : index === active ? "•" : String(index + 1).padStart(2, "0")}</b>
            <div>
              <strong>{step}</strong>
              <span>{index < active ? "Completed by Origin AI" : index === active ? "Origin AI is working…" : "Queued"}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="engineResult">
        <div>
          <small>AI RECOMMENDATION</small>
          <strong>Premium Service Business</strong>
        </div>
        <div>
          <small>PERSONAL FIT</small>
          <strong>94%</strong>
        </div>
      </div>
    </div>
  );
}

const systemCards = [
  ["01", "AI Discovery", "Origin AI versteht deine Ziele, Fähigkeiten, Interessen, Erfahrung, verfügbare Zeit und finanziellen Möglichkeiten."],
  ["02", "Opportunity Intelligence", "Die KI vergleicht passende Einkommensmodelle nach Nachfrage, Risiko, Startkapital und persönlichem Fit."],
  ["03", "AI Brand Builder", "Origin AI entwickelt Angebot, Positionierung, Markenname, Sprache, Website-Struktur und erste Inhalte."],
  ["04", "Execution Co-Pilot", "Du erhältst klare Prioritäten, tägliche Aufgaben und eine Roadmap, die sich an deinem Fortschritt orientiert."],
];

const dashboardTasks = [
  ["01", "Definiere das Kernversprechen deines Angebots", "12 min", "High impact"],
  ["02", "Validiere die Idee mit fünf potenziellen Kunden", "45 min", "Critical"],
  ["03", "Erstelle die erste Landingpage-Struktur", "25 min", "AI assisted"],
];


const workspaceItems = [
  ["Businessplan", "Strategie, Markt, Zielgruppe und Finanzlogik"],
  ["Pitch Deck", "Eine überzeugende Präsentation für Partner und Investoren"],
  ["AGB", "Individueller, bearbeitbarer Dokumententwurf"],
  ["Datenschutz", "Passender Entwurf für Website und Geschäftsmodell"],
  ["Impressum", "Strukturierter Entwurf anhand deiner Firmendaten"],
  ["Offerten", "Professionelle Angebote im eigenen Branding"],
  ["Verträge", "Anpassbare Vertragsentwürfe für typische Geschäftsprozesse"],
  ["Rechnungen", "Gebrandete Rechnungen mit Positionen und Berechnungen"],
];

const faqItems = [
  ["Was ist Origin AI?", "Origin AI ist dein digitaler Co-Founder. Die Plattform verbindet persönliche Analyse, Geschäftsstrategie, Branding, Dokumente und tägliche Umsetzung in einem durchgängigen System."],
  ["Sind die Ergebnisse individuell?", "Ja. Empfehlungen und Inhalte basieren auf deinen Antworten, Zielen, Fähigkeiten, Ressourcen und deinem tatsächlichen Fortschritt."],
  ["Kann Origin AI rechtliche Dokumente erstellen?", "Origin AI kann individualisierte und bearbeitbare Entwürfe erstellen. Rechtlich relevante Dokumente sollten vor dem Einsatz durch eine qualifizierte Fachperson geprüft werden."],
  ["Wann wird der AI Workspace verfügbar?", "Die erste öffentliche Version ist für den Launch am 15. August 2026 vorgesehen. Einzelne Module können schrittweise freigeschaltet werden."],
  ["Was kostet Origin Income?", "Zum Start wird es einen kostenlosen Einstieg und kostenpflichtige Pläne für umfassendere AI- und Workspace-Funktionen geben. Die finalen Preise werden vor dem Launch veröffentlicht."],
];

export default function Home() {
  const [intro, setIntro] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactTopic, setContactTopic] = useState("general");
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("sending");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setContactTopic("general");
      setContactStatus("success");
    } catch {
      setContactStatus("error");
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 4300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || previewItem ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setPreviewItem(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen, previewItem]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className={`intro introV4 ${intro ? "" : "gone"}`}>
        <div className="particleField">
          {Array.from({ length: 18 }).map((_, index) => <i key={index} style={{ "--n": index } as React.CSSProperties} />)}
        </div>
        <div className="introLogo"><Logo size={160} /></div>
        <div className="introLine introOne">Every future has an origin.</div>
        <div className="introLine introTwo">Origin Intelligence is online.</div>
      </div>

      <div className="noise" />
      <div className="aurora a1" />
      <div className="aurora a2" />

      <header className="nav shell commandNav">
        <Link href="/" className="brand">
          <Logo />
          <span>ORIGIN <b>INCOME</b></span>
        </Link>
        <div className="navActions">
          <Link className="navBtn desktopLaunch" href="/onboarding">AI Discovery starten</Link>
          <button
            className={`menuTrigger ${menuOpen ? "active" : ""}`}
            type="button"
            aria-label="Menü öffnen"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span className="menuTriggerText">Menu</span>
            <span className="menuLines"><i /><i /></span>
          </button>
        </div>
      </header>

      <div className={`commandOverlay ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <button className="commandBackdrop" aria-label="Menü schliessen" onClick={closeMenu} />
        <aside className="commandPanel">
          <div className="commandTop">
            <div className="commandIdentity"><Logo size={38} /><span>ORIGIN COMMAND</span></div>
            <button className="commandClose" type="button" onClick={closeMenu} aria-label="Menü schliessen">
              <i /><i />
            </button>
          </div>

          <div className="commandBody">
            <div className="commandIntro">
              <small>ORIGIN INCOME</small>
              <h2>Your business.<br /><em>One intelligent system.</em></h2>
              <p>Entdecke Origin AI, den Workspace und alle Bereiche der Plattform.</p>
            </div>

            <div className="commandColumns">
              <div className="commandGroup">
                <span className="commandLabel">Product</span>
                <a href="#origin-ai" onClick={closeMenu}><b>01</b><span>Origin AI<small>Dein digitaler Co-Founder</small></span><i>↗</i></a>
                <a href="/onboarding" onClick={closeMenu}><b>02</b><span>AI Discovery<small>30 Fragen, persönlicher Report</small></span><i>↗</i></a>
                <a href="#dashboard" onClick={closeMenu}><b>03</b><span>Dashboard<small>Roadmap, Missionen und Fortschritt</small></span><i>↗</i></a>
                <a href="#workspace" onClick={closeMenu}><b>04</b><span>AI Workspace<small>Dokumente und Business Assets</small></span><i>↗</i></a>
              </div>

              <div className="commandGroup">
                <span className="commandLabel">Company</span>
                <a href="#pricing" onClick={closeMenu}><b>01</b><span>Pricing<small>Pläne für jede Aufbauphase</small></span><i>↗</i></a>
                <a href="#faq" onClick={closeMenu}><b>02</b><span>FAQ<small>Die wichtigsten Antworten</small></span><i>↗</i></a>
                <a href="#about" onClick={closeMenu}><b>03</b><span>About<small>Vision und Prinzipien</small></span><i>↗</i></a>
                <a href="#contact" onClick={closeMenu}><b>04</b><span>Contact<small>Direkter Kontakt zu Origin</small></span><i>↗</i></a>
              </div>
            </div>

            <div className="commandWorkspace">
              <div className="commandWorkspaceHead">
                <div><small>AI WORKSPACE</small><strong>Business documents, built with context.</strong></div>
                <span>COMING SOON</span>
              </div>
              <div className="commandPills">
                {workspaceItems.map(([title]) => (
                  <button key={title} type="button" onClick={() => { setMenuOpen(false); setPreviewItem(title); }}>
                    <i>+</i>{title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="commandFooter">
            <div><span>Public Launch</span><b>15. August 2026</b></div>
            <Link href="/onboarding" onClick={closeMenu}>Launch Origin AI <i>↗</i></Link>
          </div>
        </aside>
      </div>

      <div className={`previewModal ${previewItem ? "open" : ""}`} aria-hidden={!previewItem}>
        <button className="previewBackdrop" aria-label="Vorschau schliessen" onClick={() => setPreviewItem(null)} />
        <div className="previewCard">
          <button className="previewClose" type="button" onClick={() => setPreviewItem(null)} aria-label="Vorschau schliessen">×</button>
          <div className="previewIcon"><Logo size={72} /></div>
          <span className="previewBadge">AI WORKSPACE · COMING SOON</span>
          <h3>{previewItem}</h3>
          <p>
            Origin AI erstellt dieses Dokument künftig anhand deines Unternehmens,
            deiner Marke, deiner Angebote und deiner gespeicherten Firmendaten.
          </p>
          <div className="previewProcess">
            <div><i>✓</i><span>Unternehmenskontext übernehmen</span></div>
            <div><i>✓</i><span>Inhalt intelligent personalisieren</span></div>
            <div><i>✓</i><span>Origin Branding anwenden</span></div>
            <div><i>✓</i><span>Bearbeitbaren Export vorbereiten</span></div>
          </div>
          <small>Rechtlich relevante Dokumente sind Entwürfe und sollten fachlich geprüft werden.</small>
          <Link href="/onboarding" onClick={() => setPreviewItem(null)}>Origin AI kennenlernen <span>↗</span></Link>
        </div>
      </div>

      <main>
        <section className="hero heroV4 shell">
          <div className="heroCopy">
            <div className="eyebrow"><span /> The AI Operating System for Entrepreneurs</div>
            <h1>Build your future.<br /><em>Origin AI builds with you.</em></h1>
            <p className="lead">
              Deine persönliche KI analysiert deine Fähigkeiten, findet ein passendes Geschäftsmodell,
              entwickelt dein Angebot und deine Marke – und führt dich mit einer klaren Roadmap bis zur Umsetzung.
            </p>
            <div className="heroActions">
              <Link className="primary" href="/onboarding">Origin AI starten <i>↗</i></Link>
              <a className="secondary" href="#dashboard">Produkt erleben</a>
            </div>
            <div className="proof">
              <span><b>30</b> persönliche Fragen</span>
              <span><b>AI</b> individuelle Auswertung</span>
              <span><b>24/7</b> digitaler Co-Founder</span>
            </div>
            <div className="heroTrust">
              <span>Keine generischen Prompts</span>
              <span>Kein Rätselraten</span>
              <span>Ein System, das wirklich mit dir baut</span>
            </div>
          </div>

          <div className="scene sceneV4">
            <div className="beam" />
            <div className="ring r1" />
            <div className="ring r2" />
            <div className="ring r3" />
            <div className="orbitalDot dot1" />
            <div className="orbitalDot dot2" />
            <AIEngine />
          </div>
        </section>

        <section className="launchStrip">
          <div className="shell launchGrid">
            <div>
              <p>Origin Income Public Launch</p>
              <strong>15. August 2026</strong>
            </div>
            <Countdown />
            <div className="launchText">
              Origin AI wird zur persönlichen Plattform für Idee, Marke, Umsetzung und nachhaltiges Wachstum.
            </div>
          </div>
        </section>

        <section className="ticker tickerV4">
          <div>
            <span>AI DISCOVERY</span><i>◆</i>
            <span>OPPORTUNITY INTELLIGENCE</span><i>◆</i>
            <span>BRAND BUILDER</span><i>◆</i>
            <span>EXECUTION CO-PILOT</span><i>◆</i>
            <span>CONTINUOUS OPTIMIZATION</span>
          </div>
        </section>

        <section className="originAi shell" id="origin-ai">
          <div className="sectionLabel">Meet Origin AI</div>
          <div className="originAiGrid">
            <div className="originAiCopy">
              <h2>Kein weiterer Chatbot.<br /><em>Ein digitaler Mitgründer.</em></h2>
              <p>
                Origin AI kennt nicht nur deine letzte Frage. Sie versteht dein gesamtes Profil,
                deine Ziele und deinen Fortschritt. Daraus entstehen individuelle Entscheidungen,
                Inhalte und nächste Schritte – als zusammenhängendes System.
              </p>
              <div className="aiPromise">
                <span>Origin Intelligence</span>
                <strong>Always building with you.</strong>
              </div>
            </div>

            <div className="conversationPanel">
              <div className="conversationTop">
                <div><i /> Origin AI · Online</div>
                <span>PERSONAL STRATEGY SESSION</span>
              </div>
              <div className="message aiMessage">
                <small>ORIGIN AI</small>
                <p>I analysed your experience, available time and income goals. I would not start with a low-margin online shop.</p>
              </div>
              <div className="message userMessage">
                <small>YOU</small>
                <p>What would you build instead?</p>
              </div>
              <div className="message aiMessage activeMessage">
                <small>ORIGIN AI</small>
                <p>A premium service business. You already have the sales skills and trust advantage required to reach revenue faster.</p>
              </div>
              <div className="conversationMeta">
                <span>Analysis confidence</span><b>94%</b>
              </div>
            </div>
          </div>
        </section>

        <section className="scrollStory">
          <div className="shell storyGrid">
            <div className="storySticky">
              <p className="kicker">From uncertainty to execution</p>
              <h2>Origin AI macht aus einem grossen Ziel einen machbaren Weg.</h2>
              <p>Jede Phase baut auf deinen Antworten und dem tatsächlichen Fortschritt auf.</p>
            </div>
            <div className="storySteps">
              {[
                ["01", "Understand", "Die KI versteht zuerst dich – nicht irgendeinen durchschnittlichen Nutzer."],
                ["02", "Decide", "Sie bewertet Chancen und empfiehlt einen begründeten Weg statt einer zufälligen Liste."],
                ["03", "Create", "Angebot, Marke, Website und Marketing entstehen als zusammenhängendes System."],
                ["04", "Execute", "Origin AI übersetzt Strategie in konkrete tägliche Aufgaben und Prioritäten."],
              ].map(([number, title, copy]) => (
                <article className="storyCard" key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <div className="storySignal"><i /><i /><i /><i /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell" id="system">
          <div className="sectionHead">
            <div>
              <p className="kicker">The Origin Intelligence System</p>
              <h2>Von deiner Ausgangslage<br />zum umsetzbaren Business.</h2>
            </div>
            <p>
              Die KI ist keine Marketing-Dekoration. Jeder Baustein dient besseren Entscheidungen,
              weniger Überforderung und schnellerer Umsetzung.
            </p>
          </div>
          <div className="featureGrid">
            {systemCards.map(([number, title, copy]) => (
              <article className="feature interactiveCard" key={number}>
                <div className="featureNo">{number}</div>
                <div className="featureIcon"><span /><span /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboardSection" id="dashboard">
          <div className="shell dashboardIntro">
            <p className="kicker">Origin Workspace Preview</p>
            <h2>Dein Business.<br />Dein Fortschritt. Deine KI.</h2>
            <p>Nach dem Onboarding wird Origin AI zum persönlichen Operating System für deine Umsetzung.</p>
          </div>

          <div className="dashboard shell">
            <aside className="dashSidebar">
              <div className="dashBrand"><Logo size={34} /><span>ORIGIN</span></div>
              {["Overview", "Origin AI", "Roadmap", "Brand Studio", "Documents", "Progress"].map((item, index) => (
                <div className={`dashNavItem ${index === 0 ? "selected" : ""}`} key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</div>
              ))}
              <div className="dashProfile"><span>RS</span><div><b>Roger</b><small>Founder profile</small></div></div>
            </aside>

            <div className="dashMain">
              <div className="dashHeader">
                <div><small>GOOD MORNING</small><h3>Your business is moving forward.</h3></div>
                <div className="onlineBadge"><i /> Origin AI online</div>
              </div>

              <div className="dashMetrics">
                <article><small>Business readiness</small><strong>72%</strong><div><i style={{ width: "72%" }} /></div></article>
                <article><small>AI tasks completed</small><strong>18</strong><span>+5 this week</span></article>
                <article><small>Launch forecast</small><strong>21 days</strong><span>On track</span></article>
              </div>

              <div className="dashContent">
                <section className="missionPanel">
                  <div className="panelTop"><div><i /> TODAY&apos;S MISSION</div><span>AI PRIORITIZED</span></div>
                  <h4>Validate your premium offer</h4>
                  <p>Origin AI recommends confirming demand before investing more time into design and automation.</p>
                  <div className="taskList">
                    {dashboardTasks.map(([number, title, time, tag]) => (
                      <div className="taskRow" key={number}>
                        <b>{number}</b>
                        <div><strong>{title}</strong><small>{tag}</small></div>
                        <span>{time}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="aiInsightPanel">
                  <div className="panelTop"><div><i /> ORIGIN AI INSIGHT</div><span>JUST NOW</span></div>
                  <Logo size={66} />
                  <h4>Your fastest path to revenue is trust-based selling.</h4>
                  <p>Based on your profile, personal outreach is likely to outperform paid advertising during your first launch phase.</p>
                  <button>Open AI strategy <span>↗</span></button>
                </section>
              </div>
            </div>
          </div>
        </section>


        <section className="workspaceSection shell" id="workspace">
          <div className="sectionHead workspaceHead">
            <div>
              <p className="kicker">Origin AI Workspace</p>
              <h2>Deine wichtigsten Dokumente.<br />Intelligent vorbereitet.</h2>
            </div>
            <p>
              Origin AI verbindet Unternehmensdaten, Strategie und Branding.
              So entstehen keine isolierten Vorlagen, sondern passende, bearbeitbare Business-Dokumente.
            </p>
          </div>

          <div className="workspaceGrid">
            {workspaceItems.map(([title, description], index) => (
              <button className="workspaceCard" type="button" key={title} onClick={() => setPreviewItem(title)}>
                <div className="workspaceCardTop">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i>↗</i>
                </div>
                <div className="documentGlyph"><i /><i /><i /></div>
                <h3>{title}</h3>
                <p>{description}</p>
                <small>AI GENERATED · EDITABLE</small>
              </button>
            ))}
          </div>

          <div className="workspaceNotice">
            <div><Logo size={42} /><span><b>Built with your business context.</b><small>Firmendaten, Branding, Angebote und Strategie fliessen automatisch ein.</small></span></div>
            <span className="workspaceStatus"><i /> IN DEVELOPMENT</span>
          </div>
        </section>

        <section className="pricingSection" id="pricing">
          <div className="shell">
            <div className="centerSectionHead">
              <p className="kicker">Pricing Preview</p>
              <h2>Start small.<br />Build without limits.</h2>
              <p>Die finalen Preise werden vor dem öffentlichen Launch bekannt gegeben.</p>
            </div>
            <div className="pricingGrid">
              <article>
                <span>DISCOVERY</span>
                <h3>Free</h3>
                <p>Der intelligente Einstieg in dein persönliches Unternehmerprofil.</p>
                <ul>
                  <li>30-Fragen AI Discovery</li>
                  <li>Persönlicher Profil-Snapshot</li>
                  <li>Erste Business-Empfehlung</li>
                </ul>
                <Link href="/onboarding">Discovery starten <i>↗</i></Link>
              </article>
              <article className="featuredPrice">
                <div className="popularBadge">MOST POPULAR</div>
                <span>FOUNDER</span>
                <h3>Coming soon</h3>
                <p>Das komplette Operating System für Aufbau, Marke und Umsetzung.</p>
                <ul>
                  <li>Vollständiger AI Business Report</li>
                  <li>Roadmap und Daily Missions</li>
                  <li>Origin AI Co-Founder</li>
                  <li>AI Workspace & Dokumente</li>
                </ul>
                <a href="#contact">Launch-Updates erhalten <i>↗</i></a>
              </article>
              <article>
                <span>BUSINESS</span>
                <h3>Custom</h3>
                <p>Für Teams und Unternehmen mit erweiterten Anforderungen.</p>
                <ul>
                  <li>Mehrere Projekte und Nutzer</li>
                  <li>Individuelle Workflows</li>
                  <li>Erweiterte Dokument-Module</li>
                </ul>
                <a href="mailto:hello@originincome.com">Kontakt aufnehmen <i>↗</i></a>
              </article>
            </div>
          </div>
        </section>

        <section className="aboutSection shell" id="about">
          <div className="aboutMark"><Logo size={145} /></div>
          <div className="aboutCopy">
            <p className="kicker">About Origin</p>
            <h2>Entrepreneurship should feel clear – not chaotic.</h2>
            <p>
              Origin Income entsteht aus einer einfachen Überzeugung: Menschen brauchen nicht noch mehr
              unverbundene Tools. Sie brauchen ein intelligentes System, das ihre Situation versteht,
              Entscheidungen strukturiert und den nächsten sinnvollen Schritt sichtbar macht.
            </p>
            <div className="aboutPrinciples">
              <div><span>01</span><b>Personal before generic</b></div>
              <div><span>02</span><b>Execution before information</b></div>
              <div><span>03</span><b>One system before ten tools</b></div>
            </div>
          </div>
        </section>

        <section className="faqSection shell" id="faq">
          <div className="faqIntro">
            <p className="kicker">Frequently Asked Questions</p>
            <h2>Questions,<br />answered clearly.</h2>
            <p>No fluff. Die wichtigsten Informationen rund um Origin AI, Dokumente und Launch.</p>
          </div>
          <div className="faqList">
            {faqItems.map(([question, answer], index) => (
              <button
                type="button"
                className={`faqItem ${openFaq === index ? "open" : ""}`}
                key={question}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><i>+</i></div>
                <p>{answer}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="contactSection shell" id="contact">
          <div className="contactGlow" />
          <div className="contactHeader">
            <p className="kicker">Contact Origin</p>
            <h2>How can<br />we help?</h2>
            <p>Wähle den passenden Bereich oder sende uns direkt eine Nachricht. Wir sorgen dafür, dass deine Anfrage am richtigen Ort landet.</p>
            <small>Antwort in der Regel innerhalb von 1–2 Werktagen.</small>
          </div>

          <div className="contactWorkspace">
            <div className="contactChannels" aria-label="Kontaktbereiche">
              {[
                ["general", "01", "General inquiries", "Allgemeine Fragen, Partnerschaften und Informationen", "hello@originincome.com"],
                ["support", "02", "Technical support", "Konto, Origin AI und technische Unterstützung", "support@originincome.com"],
                ["billing", "03", "Billing & payments", "Rechnungen, Zahlungen und Abonnements", "billing@originincome.com"],
                ["privacy", "04", "Privacy & data", "Datenschutz, Auskunft und Löschanfragen", "privacy@originincome.com"],
              ].map(([value, number, title, copy, email]) => (
                <div
                  key={value}
                  role="button"
                  tabIndex={0}
                  className={`contactChannel ${contactTopic === value ? "active" : ""}`}
                  onClick={() => setContactTopic(value)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setContactTopic(value); }}
                >
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                  <a href={`mailto:${email}`} onClick={(event) => event.stopPropagation()}>{email} ↗</a>
                </div>
              ))}
            </div>

            <form className="contactForm" onSubmit={submitContact}>
              <input type="hidden" name="topic" value={contactTopic} />
              <div className="contactFormTop">
                <div><span>Secure message</span><strong>Send us a message</strong></div>
                <i><b /> Online</i>
              </div>
              <div className="contactFields">
                <label><span>Name</span><input name="name" type="text" autoComplete="name" required placeholder="Dein Name" /></label>
                <label><span>E-Mail</span><input name="email" type="email" autoComplete="email" required placeholder="name@company.com" /></label>
                <label className="contactSubject"><span>Betreff</span><input name="subject" type="text" required placeholder="Worum geht es?" /></label>
                <label className="contactMessage"><span>Nachricht</span><textarea name="message" required rows={6} placeholder="Beschreibe kurz, wie wir dir helfen können." /></label>
              </div>
              <div className="contactFormFooter">
                <p>Mit dem Absenden bestätigst du, dass wir deine Angaben zur Bearbeitung deiner Anfrage verwenden dürfen.</p>
                <button type="submit" disabled={contactStatus === "sending"}>
                  {contactStatus === "sending" ? "Wird gesendet …" : "Nachricht senden"}<span>↗</span>
                </button>
              </div>
              {contactStatus === "success" && <div className="contactNotice success">Danke. Deine Nachricht ist sicher bei uns angekommen.</div>}
              {contactStatus === "error" && <div className="contactNotice error">Das Senden hat gerade nicht funktioniert. Schreib uns bitte direkt an hello@originincome.com.</div>}
            </form>
          </div>
        </section>

        <section className="onboardCta shell">
          <div className="ctaGlow" />
          <p className="kicker">Origin AI Discovery</p>
          <h2>30 Fragen.<br />Dein Business beginnt.</h2>
          <p>
            In weniger als zehn Minuten lernt Origin AI deine Ziele, Fähigkeiten,
            Möglichkeiten und Grenzen kennen. Danach entsteht dein persönlicher Business-Report.
          </p>
          <Link href="/onboarding">Meine AI Discovery starten <span>↗</span></Link>
        </section>
      </main>

      <footer className="footer shell">
        <div className="footerBrand"><Logo size={34} /><span>ORIGIN <b>INCOME</b></span></div>
        <div>© 2026 Origin Income · The AI Operating System for Entrepreneurs</div>
        <div>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Kontakt</a>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </footer>
    </>
  );
}
