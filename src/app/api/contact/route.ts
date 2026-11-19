import { NextResponse } from "next/server.js";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseServerConfigured, SERVER_CONFIG_HINT } from "@/lib/env";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

function backupEnquiry(name: string, email: string, message: string) {
  try {
    const dir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "local_enquiries.json");
    let existing: any[] = [];
    if (fs.existsSync(file)) {
      try {
        existing = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch {}
    }
    existing.unshift({
      id: "enq_" + Date.now(),
      created_at: new Date().toISOString(),
      name,
      email,
      message,
    });
    fs.writeFileSync(file, JSON.stringify(existing, null, 2));
    console.log("Saved local backup enquiry from:", name);
  } catch (err) {
    console.error("Local enquiry backup failed:", err);
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const name = String(b.name ?? "").trim().slice(0, 100);
    const email = String(b.email ?? "").trim().slice(0, 200);
    const message = String(b.message ?? "").trim().slice(0, 3000);

    if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    if (!isSupabaseServerConfigured) {
      backupEnquiry(name, email, message);
      return NextResponse.json({ ok: true, fallback: true });
    }

    try {
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
      );

      const { error } = await sb.from("enquiries").insert({ name, email, message });
      if (error) {
        console.error("Supabase enquiries insert failed:", error);
        backupEnquiry(name, email, message);
        return NextResponse.json({ ok: true, fallback: true });
      }

      return NextResponse.json({ ok: true });
    } catch (dbErr: any) {
      console.error("Supabase network error, backing up enquiry locally:", dbErr.message);
      backupEnquiry(name, email, message);
      return NextResponse.json({ ok: true, fallback: true });
    }
  } catch (err: any) {
    console.error("API contact error:", err);
    return NextResponse.json(
      { error: "Server error. Please try again or reach out on WhatsApp directly." },
      { status: 500 }
    );
  }
}
