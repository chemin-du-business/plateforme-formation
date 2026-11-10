"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";

export type AuthState = { error?: string; info?: string } | undefined;

const NOT_CONFIGURED = "La plateforme n’est pas encore reliée à sa base de données (variables Supabase manquantes).";

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasSupabase) return { error: NOT_CONFIGURED };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-mail ou mot de passe incorrect." };
  redirect("/tableau-de-bord");
}

export async function signOut() {
  if (hasSupabase) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
