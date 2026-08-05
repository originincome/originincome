import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { getBusinessModel } from "../../lib/matchmaking";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/");
  const { data: profile } = await supabase
    .from("profiles")
    .select("payment_status,access_status,selected_business_model")
    .eq("user_id", user.id)
    .maybeSingle();
  if(profile?.payment_status==="paid"&&profile?.access_status==="active") redirect("/dashboard");
  const selected=(profile?.selected_business_model||user.user_metadata?.selected_business_model) as string|undefined;
  if(!selected) redirect("/dashboard");
  const model=getBusinessModel(selected);
  const firstName=user.user_metadata?.first_name||user.user_metadata?.full_name?.split(" ")?.[0]||"Founder";
  return <CheckoutClient firstName={firstName} selectedModelName={model?.name||"deine Business Journey"} selectedModelTagline={model?.tagline||"Deine persönliche Roadmap ist vorbereitet."}/>;
}
