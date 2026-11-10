import Link from "next/link";
import { LEVELS } from "@/content/catalog";
import { bestScore, loadProgress } from "@/lib/data";

export const metadata = { title: "Tableau de bord · L’Essor Digital" };

export default async function Dashboard() {
  const { profile, user, progress, attempts } = await loadProgress();
  const done = new Set(progress.filter((p) => p.completed).map((p) => p.module_key));
  const total = LEVELS.reduce((s, l) => s + l.modules.length, 0);
  const totalDone = LEVELS.reduce((s, l) => s + l.modules.filter((m) => done.has(m.key)).length, 0);
  const name = profile?.full_name || user.email;

  // Prochaine vidéo à regarder : la première non terminée.
  let next: { href: string; label: string } | null = null;
  for (const l of LEVELS) {
    const m = l.modules.find((x) => !done.has(x.key));
    if (m) { next = { href: `/niveau/${l.n}/${m.num}`, label: `Niveau ${l.n} · ${m.title}` }; break; }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="fade-up font-display text-3xl font-semibold text-brand">Bonjour {name}</h1>
      <p className="mt-2 text-muted">{totalDone} vidéo{totalDone > 1 ? "s" : ""} de révision terminée{totalDone > 1 ? "s" : ""} sur {total}.</p>


      {next && (
        <Link href={next.href} style={{ "--d": 2 } as React.CSSProperties} className="fade-up lift shine mt-6 block rounded-2xl bg-gold px-6 py-5 text-brand-dark hover:bg-gold-dark hover:text-cream">
          <span className="text-xs font-bold uppercase tracking-widest">Reprendre la révision</span>
          <span className="mt-1 block font-display text-xl font-semibold">{next.label}</span>
        </Link>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {LEVELS.map((l) => {
          const n = l.modules.filter((m) => done.has(m.key)).length;
          const pct = Math.round((n / l.modules.length) * 100);
          const best = bestScore(attempts, l.n);
          return (
            <article key={l.n} style={{ "--d": 3 + l.n } as React.CSSProperties} className="fade-up lift flex flex-col rounded-2xl border border-line bg-white p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-gold-dark">Niveau {l.n}</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-brand">{l.name}</h2>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-cream" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progression du niveau ${l.name}`}>
                <div className={`bar-grow h-full rounded-full ${pct === 100 ? "bg-green-700" : "bg-brand"}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold">{n} / {l.modules.length} vidéos · {pct} %</p>
              <p className="mt-2 text-sm">{best ? <>Meilleur score aux questions : <b>{best.score} / {best.total}</b></> : "Questions de fin de niveau : pas encore passées"}</p>
              <Link href={`/niveau/${l.n}`} className="press mt-6 rounded-full bg-brand px-5 py-2.5 text-center text-sm font-bold text-cream hover:bg-brand-dark">Ouvrir le niveau</Link>
            </article>
          );
        })}
      </div>

      <section className="mt-12">
        <h2 className="fade-up font-display text-2xl font-semibold text-brand">Slides des sessions</h2>
        <p className="mt-1 text-muted">Les slides utilisées pendant les sessions avec votre formateur : retrouvez-les pour réviser à votre rythme.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {LEVELS.map((l) => (
            <Link key={l.n} href={`/ressources/${l.n}`} className="lift flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold font-bold text-brand-dark" aria-hidden>{l.n}</span>
              <span className="font-semibold">Niveau {l.n} · {l.name}</span>
              <span className="ml-auto text-brand">→</span>
            </Link>
          ))}
        </div>
      </section>

      {profile?.role === "trainer" && (
        <div className="mt-10 rounded-xl border border-line bg-white px-5 py-4 text-sm">
          <p className="font-semibold">Vous êtes connecté en tant que formateur. Cette page montre votre propre parcours, comme un apprenant ; le suivi de tous les apprenants est dans « Suivi ».</p>
          <div className="mt-3 flex flex-wrap gap-3"><Link href="/formateur/suivi" className="press inline-block rounded-full bg-brand px-5 py-2 font-bold text-cream hover:bg-brand-dark">Suivi des apprenants</Link><Link href="/formateur/comptes" className="press inline-block rounded-full border border-brand px-5 py-2 font-bold text-brand hover:bg-brand hover:text-cream">Gérer les comptes</Link></div>
          
        </div>
      )}
    </div>
  );
}
