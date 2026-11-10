import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";

export async function requireUser() {
  if (!hasSupabase) redirect("/connexion");
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/connexion");
  return { supabase, user: data.user };
}

export type ProgressRow = { module_key: string; completed: boolean; last_position: number };
export type AttemptRow = { level: number; score: number; total: number; created_at: string };

export async function loadProgress() {
  const { supabase, user } = await requireUser();
  const [{ data: progress }, { data: attempts }, { data: profile }] = await Promise.all([
    supabase.from("progress").select("module_key, completed, last_position").eq("user_id", user.id),
    supabase.from("quiz_attempts").select("level, score, total, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle(),
  ]);
  return {
    supabase,
    user,
    profile: profile as { full_name: string | null; role: string } | null,
    progress: (progress ?? []) as ProgressRow[],
    attempts: (attempts ?? []) as AttemptRow[],
  };
}

export const bestScore = (attempts: AttemptRow[], level: number) => {
  const mine = attempts.filter((a) => a.level === level);
  if (!mine.length) return null;
  return mine.reduce((best, a) => (a.score > best.score ? a : best));
};

// Réservé aux comptes « formateur » (administrateurs de la plateforme).
export async function requireTrainer() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (data?.role !== "trainer") redirect("/tableau-de-bord");
  return { supabase, user };
}
