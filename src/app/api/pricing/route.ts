import { NextResponse } from "next/server.js";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_PRICING_CONFIG, type PricingConfig } from "@/lib/pricing";
import { getLocalPricingConfig, saveLocalPricingConfig } from "@/lib/pricing-store";

export const runtime = "nodejs";

const ADMIN_EMAILS = [
  "pavitrash789@gmail.com",
  "pavitrash123123@gmail.com",
];

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  try {
    const client = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data: { user }, error } = await client.auth.getUser(token);
    if (error || !user || !user.email) return null;
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return user;
    }
  } catch (err) {
    console.error("Auth check error:", err);
  }
  return null;
}

export async function GET() {
  try {
    // 1. Try Supabase pricing table if available
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      try {
        const sb = createClient(url, key, { auth: { persistSession: false } });
        const { data, error } = await sb
          .from("pricing_config")
          .select("config")
          .eq("id", "active")
          .maybeSingle();

        if (!error && data?.config?.categories) {
          return NextResponse.json(data.config);
        }
      } catch {}
    }

    // 2. Return local file or defaults
    const config = getLocalPricingConfig();
    return NextResponse.json(config);
  } catch (err: any) {
    console.error("GET /api/pricing error:", err);
    return NextResponse.json(DEFAULT_PRICING_CONFIG);
  }
}

export async function POST(req: Request) {
  try {
    // Check admin authorization
    const user = await verifyAdmin(req);
    // Allow in development or when verified
    if (!user && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    if (!body || !Array.isArray(body.categories)) {
      return NextResponse.json({ error: "Invalid pricing configuration format" }, { status: 400 });
    }

    const updatedConfig: PricingConfig = {
      categories: body.categories,
      extraPageRate: Number(body.extraPageRate) || 500,
      features: Array.isArray(body.features) ? body.features : DEFAULT_PRICING_CONFIG.features,
      specialRequirements: Array.isArray(body.specialRequirements)
        ? body.specialRequirements
        : DEFAULT_PRICING_CONFIG.specialRequirements,
      taxRate: Number(body.taxRate) || 18,
      currency: "₹",
      lastUpdated: new Date().toISOString(),
    };

    // Save to local file
    saveLocalPricingConfig(updatedConfig);

    // Sync to Supabase if configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && key) {
      try {
        const sb = createClient(url, key, { auth: { persistSession: false } });
        await sb
          .from("pricing_config")
          .upsert({ id: "active", config: updatedConfig, updated_at: new Date().toISOString() });
      } catch (err) {
        console.warn("Could not sync pricing to Supabase table (non-fatal):", err);
      }
    }

    return NextResponse.json({ ok: true, config: updatedConfig });
  } catch (err: any) {
    console.error("POST /api/pricing error:", err);
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 });
  }
}
