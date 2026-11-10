"use server";

import { revalidatePath } from "next/cache";
import { requireTrainer } from "@/lib/data";
import { createAdminClient, hasAdminKey } from "@/lib/supabase/admin";

export type AccountState = { error?: string; ok?: string } | undefined;

const NO_KEY = "La clé administrateur n’est pas configurée (SUPABASE_SECRET_KEY dans .env.local). Voir le README.";

export async function createAccount(_prev: AccountState, formData: FormData): Promise<AccountState> {
  await requireTrainer();
  if (!hasAdminKey) return { error: NO_KEY };
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "trainer" ? "trainer" : "learner";
  if (!fullName || !email) return { error: "Indiquez le nom et l’adresse e-mail." };
  if (password.length < 8) return { error: "Le mot de passe provisoire doit contenir au moins 8 caractères." };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // le compte est créé par l'administrateur : pas de mail de confirmation
    user_metadata: { full_name: fullName },
  });
  if (error || !data.user) return { error: "Impossible de créer le compte : " + (error?.message ?? "erreur inconnue") };
  if (role === "trainer") await admin.from("profiles").update({ role: "trainer" }).eq("id", data.user.id);
  revalidatePath("/formateur/comptes");
  return { ok: `Compte créé pour ${fullName} (${email}). Communiquez-lui son mot de passe provisoire.` };
}

export async function resetPassword(_prev: AccountState, formData: FormData): Promise<AccountState> {
  await requireTrainer();
  if (!hasAdminKey) return { error: NO_KEY };
  const userId = String(formData.get("user_id") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!userId || password.length < 8) return { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
  const { error } = await createAdminClient().auth.admin.updateUserById(userId, { password });
  if (error) return { error: "Impossible de changer le mot de passe : " + error.message };
  return { ok: "Mot de passe modifié." };
}

// Retire (ou rétablit) l'accès d'un compte sans supprimer sa progression.
export async function setAccess(formData: FormData) {
  const { user } = await requireTrainer();
  if (!hasAdminKey) return;
  const userId = String(formData.get("user_id") ?? "");
  const block = formData.get("block") === "1";
  if (!userId || userId === user.id) return; // on ne se bloque pas soi-même
  await createAdminClient().auth.admin.updateUserById(userId, { ban_duration: block ? "876000h" : "none" });
  revalidatePath("/formateur/comptes");
}
