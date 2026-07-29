import Link from "next/link";

export default function EmailConfirmedPage() {
  return <main className="authFlowPage"><div className="authFlowGlow"/><section className="authFlowCard confirmationCard">
    <div className="confirmationSeal">✓</div>
    <small className="authFlowEyebrow">ACCOUNT VERIFIED</small>
    <h1>E-Mail bestätigt.<br/><em>Willkommen bei Origin.</em></h1>
    <p>Dein Origin Account ist jetzt aktiviert. Du kannst dich anmelden und deinen persönlichen Workspace öffnen.</p>
    <Link className="confirmationButton" href="/">Zum Login <i>↗</i></Link>
    <div className="authFlowNote">Your AI Co-Founder is ready.</div>
  </section></main>;
}
