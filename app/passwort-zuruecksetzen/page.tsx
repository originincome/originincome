"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient as createSupabaseClient } from "../../lib/supabase/client";

function Mark() {
  return (
    <svg width="58" height="58" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <defs><linearGradient id="reset-gold-b" x1="18" y1="8" x2="145" y2="155"><stop stopColor="#FFF4BB"/><stop offset=".42" stopColor="#E0BC49"/><stop offset=".72" stopColor="#A66D0A"/><stop offset="1" stopColor="#583300"/></linearGradient></defs>
      <path d="M80 9 139 44v68l-59 39-59-39V44L80 9Z" fill="#070708" stroke="url(#reset-gold-b)" strokeWidth="3"/>
      <path d="M42 107 73 48l25 42" stroke="url(#reset-gold-b)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m72 108 47-54" stroke="url(#reset-gold-b)" strokeWidth="10" strokeLinecap="round"/>
      <path d="M101 53h18v18" stroke="url(#reset-gold-b)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [ready, setReady] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setValidSession(Boolean(data.user));
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || session?.user) setValidSession(true);
      setReady(true);
    });
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, [supabase]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    if (password.length < 8) {
      setStatus("error");
      setMessage("Das neue Passwort muss mindestens 8 Zeichen enthalten.");
      return;
    }
    if (password !== confirmation) {
      setStatus("error");
      setMessage("Die beiden Passwörter stimmen nicht überein.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage("Das Passwort konnte nicht geändert werden. Fordere bitte einen neuen Reset-Link an.");
      return;
    }

    setStatus("success");
    setMessage("Dein Passwort wurde erfolgreich geändert. Du kannst dich jetzt mit dem neuen Passwort anmelden.");
    await supabase.auth.signOut();
  };

  return (
    <main className="authFlowPage">
      <div className="authFlowGlow" />
      <section className="authFlowCard">
        <Link className="authBack" href="/">← Zurück zu Origin Income</Link>
        <div className="authFlowBrand"><Mark /><span>ORIGIN ACCOUNT</span></div>
        <small className="authFlowEyebrow">SECURE PASSWORD UPDATE</small>
        <h1>Neues Passwort<br/><em>festlegen.</em></h1>
        <p>Wähle ein neues, sicheres Passwort für deinen Origin-Income-Account.</p>

        {!ready ? (
          <div className="authFlowLoading">Sicherer Link wird geprüft…</div>
        ) : status === "success" ? (
          <div className="authFlowComplete">
            <div className="authFlowMessage success">{message}</div>
            <Link href="/">Zur Anmeldung <i>↗</i></Link>
          </div>
        ) : validSession ? (
          <form className="authFlowForm" onSubmit={submit}>
            <label><span>Neues Passwort</span><input type="password" name="password" autoComplete="new-password" placeholder="Mindestens 8 Zeichen" required minLength={8} /></label>
            <label><span>Passwort bestätigen</span><input type="password" name="confirmation" autoComplete="new-password" placeholder="Passwort wiederholen" required minLength={8} /></label>
            {message && <div className={`authFlowMessage ${status}`} role="alert">{message}</div>}
            <button type="submit" disabled={status === "loading"}><span>{status === "loading" ? "Passwort wird gespeichert…" : "Passwort aktualisieren"}</span><i>↗</i></button>
          </form>
        ) : (
          <div className="authFlowComplete">
            <div className="authFlowMessage error">Dieser Reset-Link ist ungültig oder abgelaufen.</div>
            <Link href="/passwort-vergessen">Neuen Reset-Link anfordern <i>↗</i></Link>
          </div>
        )}

        <div className="authFlowNote">Origin Income speichert dein Passwort nicht im Klartext. Die sichere Verarbeitung übernimmt Supabase Auth.</div>
      </section>
    </main>
  );
}
