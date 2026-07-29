"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createClient as createSupabaseClient } from "../../lib/supabase/client";

function Mark() {
  return <svg width="58" height="58" viewBox="0 0 160 160" fill="none" aria-hidden="true"><defs><linearGradient id="register-gold" x1="18" y1="8" x2="145" y2="155"><stop stopColor="#FFF4BB"/><stop offset=".42" stopColor="#E0BC49"/><stop offset=".72" stopColor="#A66D0A"/><stop offset="1" stopColor="#583300"/></linearGradient></defs><path d="M80 9 139 44v68l-59 39-59-39V44L80 9Z" fill="#070708" stroke="url(#register-gold)" strokeWidth="3"/><path d="M42 107 73 48l25 42" stroke="url(#register-gold)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/><path d="m72 108 47-54" stroke="url(#register-gold)" strokeWidth="10" strokeLinecap="round"/><path d="M101 53h18v18" stroke="url(#register-gold)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function RegisterPage() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message, setMessage] = useState("");
  const checks = { length: password.length >= 8, upper: /[A-ZÄÖÜ]/.test(password), lower: /[a-zäöü]/.test(password), number: /\d/.test(password) };
  const passwordValid = Object.values(checks).every(Boolean);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading"); setMessage("");
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const confirm = String(form.get("confirmPassword") || "");
    if (!passwordValid) { setStatus("error"); setMessage("Bitte erfülle alle Passwort-Anforderungen."); return; }
    if (password !== confirm) { setStatus("error"); setMessage("Die beiden Passwörter stimmen nicht überein."); return; }
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/email-bestaetigt`;
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo, data: { first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}`.trim() } } });
    if (error) { setStatus("error"); setMessage(error.message.toLowerCase().includes("already") ? "Für diese E-Mail-Adresse besteht bereits ein Account. Bitte melde dich an oder setze dein Passwort zurück." : "Die Registrierung ist gerade nicht möglich. Bitte versuche es erneut."); return; }
    setStatus("success");
    setMessage("Fast geschafft: Wir haben dir eine Bestätigungs-E-Mail geschickt. Öffne den Link, um deinen Origin Account zu aktivieren.");
    if (data.user?.identities?.length === 0) setMessage("Für diese E-Mail-Adresse besteht möglicherweise bereits ein Account. Prüfe dein Postfach oder nutze den Login.");
  };

  return <main className="authFlowPage registerPage"><div className="authFlowGlow"/><section className="authFlowCard registerCard">
    <Link className="authBack" href="/">← Zurück zu Origin Income</Link>
    <div className="authFlowBrand"><Mark/><span>ORIGIN ACCOUNT</span></div>
    <small className="authFlowEyebrow">CREATE YOUR ORIGIN</small>
    <h1>Dein nächster Schritt<br/><em>beginnt hier.</em></h1>
    <p>Erstelle deinen persönlichen Account. Nach der Bestätigung deiner E-Mail wartet dein Origin Workspace auf dich.</p>
    {status === "success" ? <div className="registrationSuccess"><span>✦</span><h2>Prüfe dein Postfach.</h2><p>{message}</p><Link href="/">Zurück zur Startseite <i>↗</i></Link></div> :
    <form className="authFlowForm registerForm" onSubmit={submit}>
      <div className="registerNames"><label><span>Vorname</span><input name="firstName" autoComplete="given-name" required placeholder="Roger"/></label><label><span>Nachname</span><input name="lastName" autoComplete="family-name" required placeholder="Streit"/></label></div>
      <label><span>E-Mail-Adresse</span><input type="email" name="email" autoComplete="email" required placeholder="name@beispiel.ch"/></label>
      <label><span>Passwort</span><input type="password" name="password" autoComplete="new-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mindestens 8 Zeichen"/></label>
      <div className="passwordChecks"><span className={checks.length?"ok":""}>8 Zeichen</span><span className={checks.upper?"ok":""}>Grossbuchstabe</span><span className={checks.lower?"ok":""}>Kleinbuchstabe</span><span className={checks.number?"ok":""}>Zahl</span></div>
      <label><span>Passwort bestätigen</span><input type="password" name="confirmPassword" autoComplete="new-password" required placeholder="Passwort wiederholen"/></label>
      <label className="termsCheck"><input type="checkbox" required/><span>Ich akzeptiere die <Link href="/datenschutz">Datenschutzerklärung</Link> und die zukünftigen Nutzungsbedingungen.</span></label>
      {message && <div className="authFlowMessage error" role="alert">{message}</div>}
      <button type="submit" disabled={status==="loading"}><span>{status==="loading"?"Account wird erstellt…":"Account erstellen"}</span><i>↗</i></button>
    </form>}
    <div className="authFlowNote">Bereits registriert? <Link href="/">Über das Account-Symbol einloggen.</Link></div>
  </section></main>;
}
