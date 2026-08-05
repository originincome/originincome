import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { getJourney } from "../../../lib/journeys";
import JourneyClient from "./JourneyClient";

export default async function JourneyPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("chosen_plan,payment_status,access_status,selected_business_model")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.payment_status !== "paid" || profile?.access_status !== "active") {
    redirect("/checkout");
  }

  const journey = getJourney(model);
  if (!journey) {
    return (
      <main className="journeyFallback">
        <div className="journeyFallbackCard">
          <div className="journeyFallbackLogo"><span>O</span> ORIGIN <b>INCOME</b></div>
          <small>BUSINESS JOURNEY</small>
          <h1>Deine Journey wird vorbereitet.</h1>
          <p>Dieses Geschäftsmodell ist bereits mit deinem Profil verknüpft. Die vollständige Schritt-für-Schritt-Journey wird gerade finalisiert – dein Zugang bleibt selbstverständlich aktiv.</p>
          <div className="journeyFallbackStatus"><i/><span>Kein 404. Kein verlorener Zugang. Dein Fortschritt bleibt sicher.</span></div>
          <Link href="/dashboard">Zurück zum Dashboard →</Link>
        </div>
      </main>
    );
  }

  const firstName = user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")?.[0] || "Founder";
  return <JourneyClient firstName={firstName} plan={profile?.chosen_plan || "pro"} journey={journey} />;
}
