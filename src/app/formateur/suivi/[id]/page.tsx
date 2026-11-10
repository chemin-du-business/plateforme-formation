import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS } from "@/content/catalog";
import { requireTrainer } from "@/lib/data";
import { createAdminClient, hasAdminKey } from "@/lib/supabase/admin";

const fmt = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
const mmss = (s: number) => `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`;

export default async function LearnerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireTrainer();
  const { data: profile } = await supabase.from("profiles").select("id, full_name, role").eq("id", id).maybeSingle();
  if (!profile) notFound();
  const [{ data: progress }, { data: attempts }] = await Promise.all([
    supabase.from("progress").select("module_key, completed, last_position, updated_at").eq("user_id", id),
    supabase.from("quiz_attempts").select("level, score, total, created_at").eq("user_id", id).order("created_at", { ascending: false }),
  ]);
  let email = "";
  if (hasAdminKey) email = (await createAdminClient().auth.admin.getUserById(id)).data.user?.email ?? "";
  const byKey = new Map((progress ?? []).map((p) => [p.module_key, p]));

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/formateur/suivi" className="text-sm font-semibold text-brand underline">← Suivi des apprenants</Link>
      <h1 className="fade-up mt-4 font-display text-3xl font-semibold text-brand">{profile.full_name || email || "Sans nom"}</h1>
      {email && <p className="text-muted">{email}</p>}

      {LEVELS.map((l) => (
        <section key={l.n} className="fade-up mt-8" style={{ "--d": l.n } as React.CSSProperties}>
          <h2 className="font-display text-xl font-semibold">Niveau {l.n} · {l.name}</h2>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {l.modules.map((m) => {
              const p = byKey.get(m.key);
              return (
                <li key={m.key} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${p?.completed ? "bg-green-700 text-white" : p ? "bg-gold text-brand-dark" : "bg-cream text-muted"}`} aria-hidden>{p?.completed ? "✓" : m.num}</span>
                  <span className="font-semibold">{m.title}</span>
                  <span className="ml-auto text-muted">{p?.completed ? "Terminée" : p ? `En cours · ${mmss(p.last_position)}` : "Pas commencée"}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Questions de fin de niveau</h2>
        {(attempts ?? []).length === 0 ? <p className="mt-2 text-muted">Aucune tentative pour l’instant.</p> : (
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {(attempts ?? []).map((a, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="font-semibold">Niveau {a.level}</span>
                <span className="text-muted">{fmt(a.created_at)}</span>
                <span className="ml-auto font-bold">{a.score} / {a.total}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
