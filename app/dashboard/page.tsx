import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

const Icon = ({ name }: { name: "home"|"profile"|"match"|"modules"|"ai"|"settings"|"arrow"|"lock"|"spark" }) => {
  const paths: Record<string, ReactNode> = {
    home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M9 20v-6h6v6"/></>,
    profile: <><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
    match: <><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    modules: <><rect x="3" y="4" width="7" height="7" rx="1"/><rect x="14" y="4" width="7" height="7" rx="1"/><rect x="3" y="15" width="7" height="6" rx="1"/><rect x="14" y="15" width="7" height="6" rx="1"/></>,
    ai: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/><path d="m8.5 5.5-2-2M17.5 18.5l-2-2M18.5 5.5l2-2M5.5 18.5l-2 2"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9A1.7 1.7 0 0 0 21 10h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    spark: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const firstName = user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")?.[0] || user.email?.split("@")[0] || "Founder";
  const fullName = user.user_metadata?.full_name || user.email || "Origin Member";
  const initials = String(fullName).split(" ").map((part:string)=>part[0]).join("").slice(0,2).toUpperCase();

  async function signOut() {
    "use server";
    const client = await createClient();
    await client.auth.signOut();
    redirect("/");
  }

  return <main className="odShell">
    <aside className="odSidebar">
      <Link href="/" className="odLogo"><span className="odLogoMark">O</span><span>ORIGIN <b>INCOME</b></span></Link>
      <nav className="odNav">
        <span className="odNavLabel">WORKSPACE</span>
        <Link className="active" href="/dashboard"><Icon name="home"/><span>Übersicht</span></Link>
        <Link href="/profil"><Icon name="profile"/><span>Mein Profil</span></Link>
        <a className="locked" aria-disabled="true"><Icon name="match"/><span>Meine Matches</span><small>SOON</small></a>
        <a className="locked" aria-disabled="true"><Icon name="modules"/><span>Business-Module</span><small>LOCKED</small></a>
        <a className="locked" aria-disabled="true"><Icon name="ai"/><span>Origin AI</span><small>LOCKED</small></a>
        <span className="odNavLabel second">ACCOUNT</span>
        <Link href="/einstellungen"><Icon name="settings"/><span>Einstellungen</span></Link>
      </nav>
      <div className="odSidebarFoot">
        <div className="odMiniUser"><span>{initials}</span><div><b>{fullName}</b><small>Verified Member</small></div></div>
        <form action={signOut}><button type="submit">Abmelden</button></form>
      </div>
    </aside>

    <section className="odMain">
      <header className="odTopbar">
        <div><span className="odLiveDot"/> ORIGIN WORKSPACE <small>PRIVATE BETA</small></div>
        <div className="odTopActions"><button aria-label="Benachrichtigungen">◌</button><span className="odAvatar">{initials}</span></div>
      </header>

      <div className="odContent">
        <section className="odWelcome">
          <div><small>YOUR BUSINESS ORIGIN</small><h1>Willkommen zurück,<br/><em>{firstName}.</em></h1><p>Dein persönlicher Workspace ist bereit. Wir bauen daraus Schritt für Schritt dein passendes Geschäftsmodell.</p></div>
          <div className="odStatusOrb"><div><span>01</span><small>PHASE</small></div><p>Foundation<br/>active</p></div>
        </section>

        <section className="odJourney">
          <div className="odSectionTitle"><div><small>YOUR JOURNEY</small><h2>Vom Profil zum Business.</h2></div><span>1 von 5 Phasen aktiv</span></div>
          <div className="odJourneyTrack">
            <article className="done"><i>✓</i><div><small>01</small><b>Origin Profil</b><span>Assessment abgeschlossen</span></div></article>
            <article className="current"><i>02</i><div><small>NEXT</small><b>AI Matchmaking</b><span>Deine 3 stärksten Modelle</span></div></article>
            <article><i><Icon name="lock"/></i><div><small>03</small><b>Aktivierung</b><span>Zugang freischalten</span></div></article>
            <article><i><Icon name="lock"/></i><div><small>04</small><b>Roadmap</b><span>Module & Meilensteine</span></div></article>
            <article><i><Icon name="lock"/></i><div><small>05</small><b>Origin AI</b><span>Dein AI Co-Founder</span></div></article>
          </div>
        </section>

        <section className="odGrid">
          <article className="odPrimaryCard">
            <div className="odCardTop"><span><Icon name="spark"/> NEXT MILESTONE</span><small>COMING NEXT</small></div>
            <h2>Deine drei stärksten<br/><em>Business Matches.</em></h2>
            <p>Origin Intelligence analysiert dein Profil nach Zeit, Kapital, Fähigkeiten, Interessen und Arbeitsstil. Danach erhältst du drei Modelle mit persönlichem Match-Score.</p>
            <div className="odMatchPreview">
              <div><span>01</span><b>Business Match</b><i>— %</i></div>
              <div><span>02</span><b>Business Match</b><i>— %</i></div>
              <div><span>03</span><b>Business Match</b><i>— %</i></div>
            </div>
            <button disabled>Matchmaking wird vorbereitet <Icon name="arrow"/></button>
          </article>

          <article className="odProfileCard">
            <div className="odCardTop"><span>ORIGIN PROFILE</span><small>COMPLETE</small></div>
            <div className="odScoreRing"><div><strong>100</strong><span>%</span><small>PROFILE</small></div></div>
            <h3>Dein Fundament steht.</h3><p>30 Antworten bilden die Basis für deine persönliche Strategie.</p>
            <div className="odProfileStats"><span><b>30</b> Antworten</span><span><b>5</b> Analysefelder</span><span><b>1</b> Zielprofil</span></div>
            <Link href="/onboarding">Antworten ansehen <Icon name="arrow"/></Link>
          </article>

          <article className="odAiCard">
            <div className="odAiVisual"><span/><span/><span/><span/><div>OI</div></div>
            <small>ORIGIN INTELLIGENCE</small><h3>Your AI Co-Founder.</h3><p>Später begleitet dich Origin AI durch jede Aufgabe, Entscheidung und Wachstumsphase.</p><span className="odLockedLabel"><Icon name="lock"/> Freischaltung nach Aktivierung</span>
          </article>

          <article className="odActivityCard">
            <div className="odCardTop"><span>ACTIVITY</span><small>LIVE</small></div>
            <h3>Dein Fortschritt</h3>
            <ul><li><i className="green">✓</i><div><b>Account erstellt</b><span>Dein Workspace wurde aktiviert.</span></div><small>DONE</small></li><li><i className="green">✓</i><div><b>E-Mail verifiziert</b><span>Deine Identität ist bestätigt.</span></div><small>DONE</small></li><li><i>02</i><div><b>Matchmaking</b><span>Nächster Entwicklungsschritt.</span></div><small>NEXT</small></li></ul>
          </article>
        </section>

        <footer className="odFooter"><span>ORIGIN INCOME © 2026</span><span>Jeder Erfolg hat einen Ursprung.</span><Link href="/">Zur Website ↗</Link></footer>
      </div>
    </section>
  </main>;
}
