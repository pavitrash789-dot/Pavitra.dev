import { NextResponse } from "next/server.js";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const ADMIN_EMAILS = [
  "pavitrash789@gmail.com",
  "pavitrash123123@gmail.com",
];

function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const client = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: { user }, error } = await client.auth.getUser(token);

  if (error || !user || !user.email) return null;

  if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return user;
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const user = await verifyAdmin(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const sb = getServiceRoleClient();
    if (!sb) {
      return NextResponse.json({ error: "Supabase not configured on server" }, { status: 500 });
    }

    const [a, b, c] = await Promise.all([
      sb.from("requests").select("*").order("created_at", { ascending: false }),
      sb.from("enquiries").select("*").order("created_at", { ascending: false }),
      sb.from("portfolio_projects").select("*").order("created_at", { ascending: false }),
    ]);

    let reqs = a.data ?? [];
    let enqs = b.data ?? [];
    let pf = c.data ?? [];

    // Read any local backup submissions
    try {
      const localReqFile = path.resolve(process.cwd(), "data/local_requests.json");
      if (fs.existsSync(localReqFile)) {
        const local = JSON.parse(fs.readFileSync(localReqFile, "utf8"));
        if (Array.isArray(local)) {
          // Merge items that aren't already in DB
          const existingIds = new Set(reqs.map((r: any) => r.id));
          for (const item of local) {
            if (!existingIds.has(item.id)) {
              reqs.unshift(item);
            }
          }
        }
      }
    } catch {}

    try {
      const localEnqFile = path.resolve(process.cwd(), "data/local_enquiries.json");
      if (fs.existsSync(localEnqFile)) {
        const local = JSON.parse(fs.readFileSync(localEnqFile, "utf8"));
        if (Array.isArray(local)) {
          const existingIds = new Set(enqs.map((e: any) => e.id));
          for (const item of local) {
            if (!existingIds.has(item.id)) {
              enqs.unshift(item);
            }
          }
        }
      }
    } catch {}

    return NextResponse.json({
      requests: reqs,
      enquiries: enqs,
      portfolio: pf,
      adminEmail: user.email,
    });
  } catch (err: any) {
    console.error("Admin API GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await verifyAdmin(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const sb = getServiceRoleClient();
    if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

    const body = await req.json();
    const { id, patch } = body;
    if (!id || !patch) {
      return NextResponse.json({ error: "Missing id or patch data" }, { status: 400 });
    }

    const { error } = await sb.from("requests").update(patch).eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await verifyAdmin(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const sb = getServiceRoleClient();
    if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

    const body = await req.json();
    const { type, payload, id } = body;

    if (type === "portfolio_save") {
      const { error } = id
        ? await sb.from("portfolio_projects").update(payload).eq("id", id)
        : await sb.from("portfolio_projects").insert(payload);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await verifyAdmin(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const sb = getServiceRoleClient();
    if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing project id" }, { status: 400 });

    const { error } = await sb.from("portfolio_projects").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
