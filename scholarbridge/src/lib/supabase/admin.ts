import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only. Uses the secret/service_role key, which bypasses RLS.
// Never import this in a Client Component or expose it to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}