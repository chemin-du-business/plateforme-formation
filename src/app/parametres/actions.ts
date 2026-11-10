"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/data";

export type PasswordState = { error?: string; ok?: string } | undefined;

// L’apprenant change son propre mot de passe : on revérifie l’ancien, puis on enregistre le nouveau.
export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const { user } = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current) return { error: "Saisissez votre mot de passe actuel." };
  if (next.length < 8) return { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
  if (next !== confirm) return { error: "Les deux nouveaux mots de passe ne sont pas identiques." };
  if (next === current) return { error: "Le nouveau mot de passe doit être différent de l’actuel." };
  if (!user.email) return { error: "Compte sans adresse e-mail : contactez votre formateur." };

  const supabase = await createClient();
  const { error: checkError } = await supabase.auth.signInWithPassword({ email: user.email, password: current });
  if (checkError) return { error: "Le mot de passe actuel est incorrect." };

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { error: "Impossible de changer le mot de passe pour le moment. Réessayez dans un instant." };
  return { ok: "Votre mot de passe a bien été changé." };
}
