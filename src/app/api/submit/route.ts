import { NextResponse } from "next/server.js";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseServerConfigured, SERVER_CONFIG_HINT } from "@/lib/env";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const s = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);
const arr = (v: unknown) => (Array.isArray(v) ? v.slice(0, 30).map((x) => s(x, 60)) : []);
const OK = /^(image\/|application\/pdf|application\/msword|application\/vnd\.openxmlformats)/;

function backupSubmission(data: Record<string, any>, files: { name: string; size: number }[]) {
  try {
    const dir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "local_requests.json");
    let existing: any[] = [];
    if (fs.existsSync(file)) {
      try {
        existing = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch {}
    }
    existing.unshift({
      id: "req_" + Date.now(),
      created_at: new Date().toISOString(),
      status: "New Enquiry",
      ...data,
      files,
    });
    fs.writeFileSync(file, JSON.stringify(existing, null, 2));
    console.log("Saved local backup submission for:", data.name);
    return true;
  } catch (err) {
    console.error("Local backup write failed:", err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    let d: any;
    try {
      d = JSON.parse(String(fd.get("data") || "{}"));
    } catch {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    if (!d || typeof d !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    if (
      !s(d.name, 100) ||
      !/^\S+@\S+\.\S+$/.test(s(d.email, 200)) ||
      !s(d.category, 50) ||
      s(d.purpose, 2000).length < 10
    ) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    const files = (fd.getAll("files") as File[]).filter(
      (f) => typeof f !== "string" && f.size > 0
    );

    if (
      files.length > 5 ||
      files.some((f) => f.size > 10 * 1024 * 1024 || !OK.test(f.type))
    ) {
      return NextResponse.json(
        { error: "Maximum 5 files, 10 MB each (images, PDF or Word documents only)." },
        { status: 400 }
      );
    }

    const submissionPayload = {
      category: s(d.category, 50),
      purpose: s(d.purpose, 2000),
      design: s(d.design, 40),
      pages: arr(d.pages),
      features: arr(d.features),
      name: s(d.name, 100),
      business: s(d.business, 120),
      email: s(d.email, 200),
      whatsapp: s(d.whatsapp, 30),
      description: s(d.description, 4000),
      reference_url: s(d.reference_url, 300),
      budget: s(d.budget, 40),
      timeline: s(d.timeline, 40),
    };

    if (!isSupabaseServerConfigured) {
      backupSubmission(submissionPayload, files.map(f => ({ name: f.name, size: f.size })));
      return NextResponse.json({ ok: true, fallback: true });
    }

    try {
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } }
      );

      const { data, error } = await sb
        .from("requests")
        .insert(submissionPayload)
        .select("id")
        .single();

      if (error || !data) {
        console.error("Supabase requests insert failed:", error);
        backupSubmission(submissionPayload, files.map(f => ({ name: f.name, size: f.size })));
        return NextResponse.json({ ok: true, fallback: true });
      }

      const paths: { path: string; name: string }[] = [];
      for (const f of files) {
        const path = `${data.id}/${Date.now()}-${f.name.replace(/[^\w.\-]/g, "_")}`;
        const { error: ue } = await sb.storage
          .from("uploads")
          .upload(path, Buffer.from(await f.arrayBuffer()), {
            contentType: f.type,
          });
        if (!ue) paths.push({ path, name: f.name });
      }

      if (paths.length) {
        await sb.from("requests").update({ files: paths }).eq("id", data.id);
      }

      return NextResponse.json({ ok: true, id: data.id });
    } catch (dbErr: any) {
      console.error("Supabase network error, backing up locally:", dbErr.message);
      backupSubmission(submissionPayload, files.map(f => ({ name: f.name, size: f.size })));
      return NextResponse.json({ ok: true, fallback: true });
    }
  } catch (err: any) {
    console.error("API submit error:", err);
    return NextResponse.json(
      { error: "Server error occurred while processing your request." },
      { status: 500 }
    );
  }
}
