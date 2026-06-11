import { createBrowserSupabaseClient } from "@/lib/supabase";

export function createClient() {
  return createBrowserSupabaseClient();
}
