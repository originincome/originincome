import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { getStripe, getStripePlan } from "../../../lib/stripe/config";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }){
  const params = await searchParams;
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/");

  let planName="Origin Access";
  let paid=false;
  let planId:string|undefined;
  let selectedModel=user.user_metadata?.selected_business_model||"deine Business Journey";

  if(params.session_id){
    try{
      const stripe=getStripe();
      const session=await stripe.checkout.sessions.retrieve(params.session_id);
      const belongsToUser=session.client_reference_id===user.id || session.metadata?.user_id===user.id;
      paid=session.payment_status==="paid" && belongsToUser;
      planId=session.metadata?.plan;
      selectedModel=session.metadata?.selected_business_model||selectedModel;
      const plan=getStripePlan(planId);
      planName=plan?.name||String(session.metadata?.plan_name||"Origin Access");
      if(paid){
        await supabase.auth.updateUser({data:{payment_status:"paid",stripe_checkout_session_id:session.id,origin_plan:planId,origin_plan_name:planName,selected_business_model:selectedModel,access_unlocked:true,paid_at:new Date().toISOString()}});
      }
    }catch(error){
      console.error("checkout success verification failed",error);
    }
  }

  return <main className="provisionPage"><div className="provisionGlow"/><section className="provisionCard">
    <div className="provisionLogo">↗</div>
    <small>{paid?"PAYMENT CONFIRMED":"PAYMENT CHECK"}</small>
    <h1>{paid?"Willkommen bei Origin Income.":"Wir prüfen deine Zahlung."}</h1>
    <p>{paid?`Dein ${planName} Zugang wurde bestätigt. Deine persönliche Business Journey wird jetzt vorbereitet.`:"Falls du gerade bezahlt hast, aktualisiere die Seite in wenigen Sekunden oder kehre zum Dashboard zurück."}</p>
    <div className="provisionSteps">
      <span><i/> Business Journey wird vorbereitet</span>
      <span><i/> Origin AI wird konfiguriert</span>
      <span><i/> Roadmap wird erstellt</span>
      <span><i/> Module werden freigeschaltet</span>
    </div>
    <div className="provisionBar"><b/></div>
    <Link className="provisionButton" href="/dashboard">Business starten →</Link>
  </section></main>;
}
