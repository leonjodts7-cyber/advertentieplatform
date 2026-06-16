import { createBrowserClient } from "@supabase/ssr";

export const MEDIA_BUCKET = "advertentie-media";

export type { Advertentie, AdvertentieFoto, AdvertentieStatus } from "@/lib/types";
export type {
  AdvertentieMetadata,
  AdvertentiePakket,
  WerktijdDag,
} from "@/lib/advertentie-metadata";

export function getSupabaseEnv() {
  return {
    url:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      "https://placeholder.supabase.co",
    anonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key",
  };
}

export function heeftSupabaseConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Browser/client-side Supabase client (Client Components) */
export function createBrowserSupabaseClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}

/** Service role client voor server-only admin taken (nooit in de browser) */
export function createServiceRoleSupabaseClient() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ontbreekt. Alleen gebruiken op de server."
    );
  }

  return createBrowserClient(url, serviceRoleKey);
}
