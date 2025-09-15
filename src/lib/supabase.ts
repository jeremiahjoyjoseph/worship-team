import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export const supabase = (() => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Only throw error in production if variables are missing
  if (
    process.env.NODE_ENV === "production" &&
    (!supabaseUrl || !supabaseAnonKey)
  ) {
    throw new Error("Missing Supabase environment variables");
  }

  // For build time or missing variables, use dummy values
  const url = supabaseUrl || "https://dummy.supabase.co";
  const key = supabaseAnonKey || "dummy-key";

  supabaseClient = createClient(url, key);
  return supabaseClient;
})();
