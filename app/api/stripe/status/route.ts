import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  const sessionId = request.nextUrl.searchParams.get("session_id");
  const { data, error } = await supabase
    .from("profiles")
    .select("chosen_plan,payment_status,access_status,stripe_session_id,selected_business_model,purchase_date")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const sessionMatches = !sessionId || data?.stripe_session_id === sessionId;

  return NextResponse.json({
    ready: Boolean(data?.access_status === "active" && data?.payment_status === "paid" && sessionMatches),
    profile: data || null,
  });
}
