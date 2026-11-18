export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Client-side features (portfolio, admin) only need the public URL + anon key.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
// Writing from API routes also needs the service role key, which stays on the server.
export const isSupabaseServerConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);

export const CONFIG_HINT =
  "Supabase isn't configured yet. Copy .env.example to .env.local, fill in the values from your Supabase project (Project Settings → API), then restart the dev server.";

export const SERVER_CONFIG_HINT =
  "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local, then restart the dev server.";
