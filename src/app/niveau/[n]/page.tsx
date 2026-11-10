import Link from "next/link";
import { notFound } from "next/navigation";
import { levelByN } from "@/content/catalog";
import { questionsByLevel } from "@/content/quiz";
import { bestScore, loadProgress } from "@/lib/data";

export default async function LevelPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const level = levelByN(Number(n));
  if (!level) notFound();
  const { progress, attempts } = await loadProgress();
  const done = new Set(progress.filter((p) => p.completed).map((p) => p.module_key));
  const best = bestScore(attempts, level.n);
  const allDone = level.modules.every((m) => done.has(m.key));

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/tableau-de-bord" className="text-sm font-semibold text-brand underline">← Tableau de bord</Link>
      <p className="mt-4 text-sm font-bold uppercase tracking-widest text-gold-dark">Niveau {level.n}</p>
      <h1 className="font-display text-4xl font-semibold text-brand">{level.name}</h1>
      <p className="mt-2 text-muted">{level.tagline}</p>

      <ol className="mt-8 space-y-3">
        {level.modules.map((m, i) => {
          const isDone = done.has(m.key);
          return (
            <li key={m.key} style={{ "--d": i + 1 } as React.CSSProperties} className="fade-up">
              <Link href={`/niveau/${level.n}/${m.num}`} className="lift flex items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4 hover:border-brand">
                <span className={`${isDone ? "check-pop " : ""}flex h-10 w-10 flex-none items-center justify-center rounded-full font-bold ${isDone ? "bg-green-700 text-white" : "bg-gold text-brand-dark"}`} aria-hidden>{isDone ? "✓" : m.num}</span>
                <span className="font-semibold">{m.title}</span>
                <span className={`ml-auto text-sm ${isDone ? "font-semibold text-green-700" : "text-muted"}`}>{isDone ? "Terminée" : "À regarder"}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      <section style={{ "--d": level.modules.length + 2 } as React.CSSProperties} className="fade-up mt-10 rounded-2xl bg-gold/25 p-7">
        <h2 className="font-display text-2xl font-semibold text-brand-dark">Questions de fin de niveau</h2>
        <p className="mt-2">{questionsByLevel(level.n).length} questions, avec la correction expliquée après chaque réponse. {allDone ? "Vous avez vu toutes les vidéos : vous êtes prêt." : "Regardez d’abord toutes les vidéos du niveau."}</p>
        {best && <p className="mt-2 font-semibold">Meilleur score : {best.score} / {best.total}</p>}
        <Link href={`/niveau/${level.n}/questions`} className="press shine mt-5 inline-block rounded-full bg-brand px-6 py-2.5 font-bold text-cream hover:bg-brand-dark">{best ? "Repasser les questions" : "Passer les questions"}</Link>
      </section>
    </div>
  );
}
