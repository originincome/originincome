import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import VaultClient from "./VaultClient";

export default async function VaultPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/");
  const {data:profile}=await supabase.from("profiles").select("chosen_plan,payment_status,access_status,selected_business_model").eq("user_id",user.id).maybeSingle();
  if(profile?.payment_status!=="paid"||profile?.access_status!=="active") redirect("/checkout");
  const firstName=user.user_metadata?.first_name||user.user_metadata?.full_name?.split(" ")?.[0]||"Founder";
  return <VaultClient firstName={firstName} plan={profile?.chosen_plan||"pro"} journey={profile?.selected_business_model||"lead-generation-agency"}/>;
}
