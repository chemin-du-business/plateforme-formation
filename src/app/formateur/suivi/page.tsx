import Link from "next/link";
import { LEVELS } from "@/content/catalog";
import { requireTrainer } from "@/lib/data";
import { createAdminClient, hasAdminKey } from "@/lib/supabase/admin";

export const metadata = { title: "Suivi des apprenants · L’Essor Digital" };

export default async function TrackingPage() {
  const { supabase } = await requireTrainer();
  const [{ data: profiles }, { data: progress }, { data: attempts }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role").eq("role", "learner"),
    supabase.from("progress").select("user_id, module_key, completed, updated_at"),
    supabase.from("quiz_attempts").select("user_id, level, score, total, created_at"),
  ]);
  const emails = new Map<string, string>();
  if (hasAdminKey) {
    const { data } = await createAdminClient().auth.admin.listUsers({ page: 1, perPage: 200 });
    data?.users.forEach((u) => emails.set(u.id, u.email ?? ""));
  }

  const rows = (profiles ?? []).map((p) => {
    const mine = (progress ?? []).filter((x) => x.user_id === p.id);
    const done = new Set(mine.filter((x) => x.completed).map((x) => x.module_key));
    const att = (attempts ?? []).filter((a) => a.user_id === p.id);
    const lastDates = [...mine.map((x) => x.updated_at), ...att.map((a) => a.created_at)].filter(Boolean).sort();
    return {
      id: p.id,
      name: p.full_name || emails.get(p.id) || "Sans nom",
      email: emails.get(p.id) ?? "",
      levels: LEVELS.map((l) => {
        const n = l.modules.filter((m) => done.has(m.key)).length;
        const best = att.filter((a) => a.level === l.n).reduce<{ score: number; total: number } | null>((b, a) => (!b || a.score > b.score ? a : b), null);
        return { n, total: l.modules.length, best };
      }),
      last: lastDates.at(-1) ?? null,
    };
  });
  const overall = rows.length ? Math.round((rows.reduce((s, r) => s + r.levels.reduce((a, l) => a + l.n, 0), 0) / (rows.length * LEVELS.reduce((a, l) => a + l.modules.length, 0))) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/tableau-de-bord" className="text-sm font-semibold text-brand underline">← Tableau de bord</Link>
      <h1 className="fade-up mt-4 font-display text-3xl font-semibold text-brand">Suivi des apprenants</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="fade-up rounded-2xl border border-line bg-white p-5"><p className="text-sm text-muted">Apprenants</p><p className="font-display text-3xl font-semibold text-brand">{rows.length}</p></div>
        <div className="fade-up rounded-2xl border border-line bg-white p-5" style={{ "--d": 1 } as React.CSSProperties}><p className="text-sm text-muted">Avancement moyen</p><p className="font-display text-3xl font-semibold text-brand">{overall} %</p></div>
        <div className="fade-up rounded-2xl border border-line bg-white p-5" style={{ "--d": 2 } as React.CSSProperties}><p className="text-sm text-muted">Questions passées</p><p className="font-display text-3xl font-semibold text-brand">{(attempts ?? []).length}</p></div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-xl bg-gold/25 px-5 py-4 text-sm font-semibold text-brand-dark">Aucun apprenant pour l’instant. Créez des comptes dans « Comptes ».</p>
      ) : (
        <div className="fade-up mt-8 overflow-x-auto rounded-2xl border border-line bg-white" style={{ "--d": 3 } as React.CSSProperties}>
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Apprenant</th>
                {LEVELS.map((l) => <th key={l.n} className="px-4 py-3">Niveau {l.n} · {l.name}</th>)}
                <th className="px-4 py-3">Dernière activité</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-line align-top">
                  <td className="px-4 py-3"><p className="font-semibold">{r.name}</p>{r.email && r.email !== r.name && <p className="text-xs text-muted">{r.email}</p>}</td>
                  {r.levels.map((l, i) => {
                    const pct = Math.round((l.n / l.total) * 100);
                    return (
                      <td key={i} className="min-w-40 px-4 py-3">
                        <div className="h-2.5 overflow-hidden rounded-full bg-cream" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Niveau ${i + 1}`}><div className={`bar-grow h-full rounded-full ${pct === 100 ? "bg-green-700" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div>
                        <p className="mt-1 text-xs font-semibold">{l.n} / {l.total} vidéos</p>
                        <p className="text-xs text-muted">{l.best ? `Questions : ${l.best.score} / ${l.best.total}` : "Questions : non passées"}</p>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3">{r.last ? new Date(r.last).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Jamais"}</td>
                  <td className="px-4 py-3"><Link href={`/formateur/suivi/${r.id}`} className="press rounded-full border border-brand px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand hover:text-cream">Détail</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
