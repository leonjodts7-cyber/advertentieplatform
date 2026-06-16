import type { SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "advertentie-media";

export type MediaUploadResult =
  | { ok: true; url: string; path: string }
  | { ok: false; error: string };

export function isBucketMissingError(message: string) {
  const lower = message.toLowerCase();
  return lower.includes("bucket") && lower.includes("not found");
}

export async function uploadAdvertentieMedia(
  supabase: SupabaseClient,
  advertentieId: string,
  file: File,
  index: number
): Promise<MediaUploadResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${advertentieId}/${Date.now()}-${index}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    if (isBucketMissingError(error.message)) {
      return {
        ok: false,
        error: "Maak in Supabase Storage de bucket advertentie-media aan.",
      };
    }
    return { ok: false, error: error.message };
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl, path };
}

export async function saveFotoRecords(
  supabase: SupabaseClient,
  advertentieId: string,
  urls: string[]
) {
  if (urls.length === 0) return { error: null };

  const rows = urls.map((url, index) => ({
    advertentie_id: advertentieId,
    url,
    volgorde: index,
  }));

  const { error } = await supabase.from("advertentie_fotos").insert(rows);
  return { error };
}

export async function replaceFotoRecords(
  supabase: SupabaseClient,
  advertentieId: string,
  urls: string[]
) {
  await supabase.from("advertentie_fotos").delete().eq("advertentie_id", advertentieId);
  return saveFotoRecords(supabase, advertentieId, urls);
}
