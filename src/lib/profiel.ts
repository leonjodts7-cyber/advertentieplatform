import { createClient } from "@/lib/supabase/server";

export async function zorgProfielBestaat(userId: string, email: string) {
  const supabase = await createClient();

  const { data: bestaand } = await supabase
    .from("profielen")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!bestaand) {
    await supabase.from("profielen").insert({ id: userId, email });
  }
}
