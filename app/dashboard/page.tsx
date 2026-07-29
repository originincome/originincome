import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import DashboardClient from "./DashboardClient";
import type { AssessmentAnswers, MatchResult } from "../../lib/matchmaking";

export default async function DashboardPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)redirect("/");
  const firstName=user.user_metadata?.first_name||user.user_metadata?.full_name?.split(" ")?.[0]||user.email?.split("@")[0]||"Founder";
  const fullName=user.user_metadata?.full_name||user.email||"Origin Member";
  const initials=String(fullName).split(" ").map((part:string)=>part[0]).join("").slice(0,2).toUpperCase();
  return <DashboardClient firstName={firstName} fullName={fullName} initials={initials} metadataAnswers={(user.user_metadata?.assessment_answers||{}) as AssessmentAnswers} metadataMatches={(user.user_metadata?.assessment_matches||[]) as MatchResult[]} metadataSelected={user.user_metadata?.selected_business_model||null}/>;
}
