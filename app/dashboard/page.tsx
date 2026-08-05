import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import DashboardClient from "./DashboardClient";
import type { AssessmentAnswers, MatchResult } from "../../lib/matchmaking";

export default async function DashboardPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)redirect("/");
  const { data: profile } = await supabase
    .from("profiles")
    .select("chosen_plan,payment_status,access_status,stripe_customer_id,stripe_session_id,selected_business_model,purchase_date")
    .eq("user_id", user.id)
    .maybeSingle();
  const firstName=user.user_metadata?.first_name||user.user_metadata?.full_name?.split(" ")?.[0]||user.email?.split("@")[0]||"Founder";
  const fullName=user.user_metadata?.full_name||user.email||"Origin Member";
  const initials=String(fullName).split(" ").map((part:string)=>part[0]).join("").slice(0,2).toUpperCase();
  return <DashboardClient
    firstName={firstName}
    fullName={fullName}
    initials={initials}
    metadataAnswers={(user.user_metadata?.assessment_answers||{}) as AssessmentAnswers}
    metadataMatches={(user.user_metadata?.assessment_matches||[]) as MatchResult[]}
    metadataSelected={profile?.selected_business_model||user.user_metadata?.selected_business_model||null}
    initialPlan={profile?.chosen_plan||null}
    initialPaymentStatus={profile?.payment_status||"unpaid"}
    initialAccessStatus={profile?.access_status||"locked"}
  />;
}
