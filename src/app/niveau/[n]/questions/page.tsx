import Link from "next/link";
import { notFound } from "next/navigation";
import QuizForm from "@/components/QuizForm";
import { levelByN } from "@/content/catalog";
import { questionsByLevel } from "@/content/quiz";
import { requireUser } from "@/lib/data";

export default async function QuestionsPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const level = levelByN(Number(n));
  if (!level) notFound();
  await requireUser();
  // On n’envoie au navigateur ni la bonne réponse ni l’explication.
  const questions = questionsByLevel(level.n).map(({ id, question, options }) => ({ id, question, options: [...options] }));

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href={`/niveau/${level.n}`} className="text-sm font-semibold text-brand underline">← Niveau {level.n} · {level.name}</Link>
      <h1 className="mt-4 font-display text-3xl font-semibold text-brand">Questions de fin de niveau</h1>
      <p className="mb-8 mt-2 text-muted">{questions.length} questions, une seule bonne réponse chacune. La correction expliquée s’affiche après validation.</p>
      <QuizForm level={level.n} levelName={level.name} questions={questions} />
    </div>
  );
}
