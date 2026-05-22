import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase admin client (uses the service-role key).
 * Returns null when env isn't configured yet, so the app still builds/runs
 * before the dedicated PopsShop project is wired up.
 *
 * NEVER import this into a client component — the service-role key bypasses RLS.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch {
    return null;
  }
}

export const ORDER_PHOTO_BUCKET = "order-photos";
