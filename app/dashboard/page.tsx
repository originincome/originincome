import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const name = user.user_metadata?.full_name || user.user_metadata?.first_name || user.email?.split("@")[0] || "Founder";
  return <main className="accountPage"><div className="accountPageCard"><small>ORIGIN DASHBOARD · V8.2</small><h1>Welcome back,<br/><em>{name}.</em></h1><p>Dein persönliches Dashboard wird in Version 9 aufgebaut. Login, Session und geschützter Zugriff funktionieren bereits.</p><Link href="/">Zur Landingpage <span>↗</span></Link></div></main>;
}
