import Link from "next/link";

export default function CheckoutCancelPage(){
  return <main className="checkoutCancelPage"><section className="checkoutCancelCard"><div className="cancelMark">↺</div><small>CHECKOUT ABGEBROCHEN</small><h1>Kein Problem.</h1><p>Deine Auswahl bleibt gespeichert. Du kannst jederzeit zurückkehren und deine Business Journey freischalten.</p><div><Link href="/checkout">Zurück zu den Paketen</Link><Link href="/dashboard" className="secondary">Dashboard öffnen</Link></div></section></main>;
}
