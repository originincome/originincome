import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import ProvisioningClient from "./ProvisioningClient";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  if (!params.session_id) redirect("/dashboard");

  return <ProvisioningClient sessionId={params.session_id} firstName={user.user_metadata?.first_name || "Founder"} />;
}
