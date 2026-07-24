import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        { ok: false, service: "supabase-auth", error: error.message },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true, service: "supabase-auth" });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "supabase-auth",
        error: error instanceof Error ? error.message : "Unknown configuration error",
      },
      { status: 503 },
    );
  }
}
