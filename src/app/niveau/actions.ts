"use server";

import { requireUser } from "@/lib/data";
import { moduleByKey } from "@/content/catalog";

// Enregistre la position de lecture (et la fin de vidéo) de l’apprenant connecté.
export async function saveProgress(moduleKey: string, position: number, completed: boolean) {
  if (!moduleByKey(moduleKey)) return;
  const { supabase, user } = await requireUser();
  const { data: existing } = await supabase
    .from("progress")
    .select("completed")
    .eq("user_id", user.id)
    .eq("module_key", moduleKey)
    .maybeSingle();
  await supabase.from("progress").upsert(
    {
      user_id: user.id,
      module_key: moduleKey,
      last_position: Math.max(0, Math.floor(position)),
      completed: completed || Boolean(existing?.completed), // une vidéo terminée le reste
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_key" },
  );
}
