// Envoie les vidéos et sous-titres dans le bucket privé « videos » de Supabase.
// Usage : node scripts/upload-videos.mjs [dossier]   (clé lue dans .env.local : SUPABASE_SECRET_KEY)
import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

process.loadEnvFile(".env.local");
const dir = process.argv[2] ?? "/Users/gracia/Downloads/Formation_TOSA_WordPress/videos";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

const { data: buckets, error: be } = await sb.storage.listBuckets();
if (be) { console.error("Connexion impossible :", be.message); process.exit(1); }
if (!buckets.some((b) => b.name === "videos")) {
  const { error } = await sb.storage.createBucket("videos", { public: false });
  if (error) { console.error("Création du bucket impossible :", error.message); process.exit(1); }
  console.log("Bucket « videos » créé (privé).");
}

const { data: existing } = await sb.storage.from("videos").list("", { limit: 1000 });
const have = new Map((existing ?? []).map((f) => [f.name, f.metadata?.size]));
const files = readdirSync(dir).filter((f) => /\.(mp4|vtt)$/.test(f)).sort();
let ok = 0, skipped = 0, failed = 0;
for (const f of files) {
  const size = statSync(join(dir, f)).size;
  if (have.get(f) === size) { skipped++; continue; }
  const type = f.endsWith(".mp4") ? "video/mp4" : "text/vtt";
  const { error } = await sb.storage.from("videos").upload(f, readFileSync(join(dir, f)), { contentType: type, upsert: true });
  if (error) { failed++; console.error("ÉCHEC", f, error.message); } else { ok++; console.log("ok", f, Math.round(size / 1e5) / 10 + " Mo"); }
}
console.log(`Terminé : ${ok} envoyés, ${skipped} déjà présents, ${failed} échecs, sur ${files.length} fichiers.`);
