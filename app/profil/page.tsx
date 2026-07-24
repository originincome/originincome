import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
export default async function ProfilePage(){const supabase=await createClient();const{data:{user}}=await supabase.auth.getUser();if(!user)redirect("/");return <main className="accountPage"><div className="accountPageCard"><small>ACCOUNT</small><h1>Mein <em>Profil.</em></h1><p>{user.email}</p><p>Die vollständigen Profildaten folgen zusammen mit der Benutzerdatenbank.</p><Link href="/dashboard">Zum Dashboard <span>↗</span></Link></div></main>}
