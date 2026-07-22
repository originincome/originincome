"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useMemo, useState } from "react";

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

export default function Home() {
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 4300);
    return () => window.clearTimeout(timer);
  }, []);

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

      <header className="nav shell">
        <Link href="/" className="brand">
          <Logo />
          <span>ORIGIN <b>INCOME</b></span>
        </Link>
        <nav>
          <a href="#origin-ai">Origin AI</a>
          <a href="#system">System</a>
          <a href="#dashboard">Dashboard</a>
          <Link className="navBtn" href="/onboarding">AI Discovery starten</Link>
        </nav>
      </header>

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
          <a href="mailto:hello@originincome.com">hello@originincome.com</a>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </footer>
    </>
  );
}
