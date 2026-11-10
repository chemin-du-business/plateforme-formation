import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

// Client administrateur : sert UNIQUEMENT côté serveur, après avoir vérifié que l'appelant est formateur.
// La clé secrète vient de SUPABASE_SECRET_KEY (jamais préfixée NEXT_PUBLIC_, jamais commitée).
export const hasAdminKey = Boolean(process.env.SUPABASE_SECRET_KEY);

export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key || !SUPABASE_URL) throw new Error("SUPABASE_SECRET_KEY manquante");
  return createClient(SUPABASE_URL, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
