"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createClient as createSupabaseClient } from "../../lib/supabase/client";

function Mark() {
  return (
    <svg width="58" height="58" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <defs><linearGradient id="reset-gold-a" x1="18" y1="8" x2="145" y2="155"><stop stopColor="#FFF4BB"/><stop offset=".42" stopColor="#E0BC49"/><stop offset=".72" stopColor="#A66D0A"/><stop offset="1" stopColor="#583300"/></linearGradient></defs>
      <path d="M80 9 139 44v68l-59 39-59-39V44L80 9Z" fill="#070708" stroke="url(#reset-gold-a)" strokeWidth="3"/>
      <path d="M42 107 73 48l25 42" stroke="url(#reset-gold-a)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m72 108 47-54" stroke="url(#reset-gold-a)" strokeWidth="10" strokeLinecap="round"/>
      <path d="M101 53h18v18" stroke="url(#reset-gold-a)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const redirectTo = `${window.location.origin}/auth/callback?next=/passwort-zuruecksetzen`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      setStatus("error");
      setMessage("Die Reset-Mail konnte gerade nicht versendet werden. Bitte versuche es später erneut.");
      return;
    }

    setStatus("success");
    setMessage("Prüfe dein Postfach. Falls ein Konto zu dieser Adresse besteht, erhältst du gleich einen sicheren Reset-Link.");
  };

  return (
    <main className="authFlowPage">
      <div className="authFlowGlow" />
      <section className="authFlowCard">
        <Link className="authBack" href="/">← Zurück zu Origin Income</Link>
        <div className="authFlowBrand"><Mark /><span>ORIGIN ACCOUNT</span></div>
        <small className="authFlowEyebrow">PASSWORD RECOVERY</small>
        <h1>Passwort<br/><em>zurücksetzen.</em></h1>
        <p>Gib die E-Mail-Adresse deines Accounts ein. Wir senden dir automatisch einen sicheren Link, mit dem du ein neues Passwort festlegen kannst.</p>

        <form className="authFlowForm" onSubmit={submit}>
          <label><span>E-Mail-Adresse</span><input type="email" name="email" autoComplete="email" placeholder="name@beispiel.ch" required /></label>
          {message && <div className={`authFlowMessage ${status}`} role="status">{message}</div>}
          <button type="submit" disabled={status === "loading"}><span>{status === "loading" ? "E-Mail wird versendet…" : "Reset-Link senden"}</span><i>↗</i></button>
        </form>

        <div className="authFlowNote">Der Link ist zeitlich begrenzt und kann nur für deinen Account verwendet werden.</div>
      </section>
    </main>
  );
}
