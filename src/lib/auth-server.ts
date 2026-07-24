import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** Dedupe auth across layout + pages in the same request */
export const getCachedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
