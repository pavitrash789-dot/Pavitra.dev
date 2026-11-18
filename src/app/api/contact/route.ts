import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseServerConfigured, SERVER_CONFIG_HINT } from "@/lib/env";
export async function POST(req: Request) {
  try {
    const b = await req.json(); const name = String(b.name ?? "").trim().slice(0, 100), email = String(b.email ?? "").trim().slice(0, 200), message = String(b.message ?? "").trim().slice(0, 3000);
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) return NextResponse.json({ error:"Please fill in all fields." }, { status:400 });
    if (!isSupabaseServerConfigured) return NextResponse.json({ error: SERVER_CONFIG_HINT }, { status:503 });
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{ persistSession:false } });
    const { error } = await sb.from("enquiries").insert({ name, email, message });
    if (error) { console.error("enquiries insert failed:", error); return NextResponse.json({ error:"Could not send message. The database rejected it — check that supabase/schema.sql has been run." }, { status:500 }); }
    return NextResponse.json({ ok:true });
  } catch { return NextResponse.json({ error:"Server error." }, { status:500 }); }
}
