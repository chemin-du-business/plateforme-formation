"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { submitQuiz, type QuizResult } from "@/app/niveau/[n]/questions/actions";

type PublicQuestion = { id: string; question: string; options: string[] };

export default function QuizForm({ level, levelName, questions }: { level: number; levelName: string; questions: PublicQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pending, start] = useTransition();
  const answered = Object.keys(answers).length;

  function submit() {
    start(async () => {
      setResult(await submitQuiz(level, answers));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div>
        <section className="pop-in rounded-2xl bg-brand p-8 text-cream">
          <p className="text-sm font-bold uppercase tracking-widest text-gold">Résultat · Niveau {levelName}</p>
          <p className="mt-2 font-display text-5xl font-semibold">{result.score} / {result.total}</p>
          <p className="mt-3 text-lg">
            {pct >= 80 ? "Excellent : vous êtes prêt pour la suite." : pct >= 50 ? "Bien, mais revoyez les points ci-dessous avant de continuer." : "Reprenez les vidéos indiquées, puis refaites les questions."}
          </p>
        </section>

        {result.toReview.length > 0 && (
          <section className="mt-6 rounded-2xl bg-gold/25 p-6">
            <h2 className="font-display text-xl font-semibold text-brand-dark">À revoir</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {result.toReview.map((m) => (
                <li key={m.num}><Link className="font-semibold underline" href={`/niveau/${level}/${m.num}`}>Module {m.num} · {m.title}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <ol className="mt-8 space-y-5">
          {questions.map((q, i) => {
            const d = result.details.find((x) => x.id === q.id)!;
            return (
              <li key={q.id} style={{ "--d": i + 1 } as React.CSSProperties} className={`fade-up rounded-2xl border-2 bg-white p-6 ${d.correct ? "border-green-700/60" : "border-brand/60"}`}>
                <p className="font-semibold"><span className="mr-2 text-gold-dark">{i + 1}.</span>{q.question}</p>
                <p className="mt-3 text-sm"><b>{d.correct ? "Bonne réponse" : "Réponse incorrecte"}</b> : {q.options[d.answer]}</p>
                {!d.correct && d.chosen !== null && <p className="mt-1 text-sm text-muted">Votre réponse : {q.options[d.chosen]}</p>}
                {!d.correct && d.chosen === null && <p className="mt-1 text-sm text-muted">Pas de réponse.</p>}
                <p className="mt-3 rounded-lg bg-cream px-4 py-3 text-sm">{d.explanation}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => { setAnswers({}); setResult(null); }} className="rounded-full border border-brand px-6 py-2.5 font-bold text-brand hover:bg-brand hover:text-cream">Refaire les questions</button>
          <Link href={`/niveau/${level}`} className="rounded-full bg-brand px-6 py-2.5 font-bold text-cream hover:bg-brand-dark">Retour au niveau</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="space-y-5">
        {questions.map((q, i) => (
          <li key={q.id}>
            <fieldset className="rounded-2xl border border-line bg-white p-6">
              <legend className="px-1 font-semibold"><span className="mr-2 text-gold-dark">{i + 1}.</span>{q.question}</legend>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, k) => (
                  <label key={k} className={`press flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${answers[q.id] === k ? "select-pulse border-brand bg-brand/5" : "border-line hover:border-brand/50"}`}>
                    <input type="radio" name={q.id} checked={answers[q.id] === k} onChange={() => setAnswers((a) => ({ ...a, [q.id]: k }))} className="mt-1 accent-brand" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-4 border-t border-line bg-cream/95 py-4 backdrop-blur">
        <p className="text-sm font-semibold">{answered} / {questions.length} réponses</p>
        <button onClick={submit} disabled={pending || answered === 0} className="press rounded-full bg-brand px-7 py-3 font-bold text-cream hover:bg-brand-dark disabled:opacity-50">
          {pending ? "Correction…" : "Valider mes réponses"}
        </button>
      </div>
    </div>
  );
}
