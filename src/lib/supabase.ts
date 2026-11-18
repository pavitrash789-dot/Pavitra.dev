import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

// Placeholder values keep the site rendering before real Supabase env vars are set.
// Data-fetching features (portfolio, admin, forms) start working once .env.local is filled.
export { isSupabaseConfigured, CONFIG_HINT } from "@/lib/env";

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder-anon-key");
