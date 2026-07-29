import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { getBusinessModel } from "../../lib/matchmaking";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/");
  const selected=user.user_metadata?.selected_business_model as string|undefined;
  if(!selected) redirect("/dashboard");
  const model=getBusinessModel(selected);
  const firstName=user.user_metadata?.first_name||user.user_metadata?.full_name?.split(" ")?.[0]||"Founder";
  return <CheckoutClient firstName={firstName} selectedModelName={model?.name||"deine Business Journey"} selectedModelTagline={model?.tagline||"Deine persönliche Roadmap ist vorbereitet."}/>;
}
