import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
export default async function SettingsPage(){const supabase=await createClient();const{data:{user}}=await supabase.auth.getUser();if(!user)redirect("/");return <main className="accountPage"><div className="accountPageCard"><small>ACCOUNT</small><h1>Deine <em>Einstellungen.</em></h1><p>Kontoeinstellungen, E-Mail-Präferenzen und Abonnementverwaltung werden in einer späteren Version ergänzt.</p><Link href="/dashboard">Zum Dashboard <span>↗</span></Link></div></main>}
