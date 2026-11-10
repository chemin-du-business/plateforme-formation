"use server";

import { levelByN } from "@/content/catalog";
import { questionsByLevel } from "@/content/quiz";
import { requireUser } from "@/lib/data";

export type QuizResult = {
  score: number;
  total: number;
  details: { id: string; correct: boolean; chosen: number | null; answer: number; explanation: string; moduleNum: number }[];
  toReview: { num: number; title: string }[];
};

// Corrige côté serveur : les bonnes réponses ne sont jamais envoyées au navigateur avant la soumission.
export async function submitQuiz(levelN: number, answers: Record<string, number>): Promise<QuizResult> {
  const level = levelByN(levelN);
  if (!level) throw new Error("Niveau inconnu");
  const questions = questionsByLevel(levelN);
  const details = questions.map((q) => {
    const chosen = Number.isInteger(answers[q.id]) ? answers[q.id] : null;
    return { id: q.id, correct: chosen === q.answer, chosen, answer: q.answer, explanation: q.explanation, moduleNum: q.moduleNum };
  });
  const score = details.filter((d) => d.correct).length;
  const wrongModules = [...new Set(details.filter((d) => !d.correct).map((d) => d.moduleNum))].sort((a, b) => a - b);
  const toReview = wrongModules.map((num) => ({ num, title: level.modules.find((m) => m.num === num)?.title ?? `Module ${num}` }));

  const { supabase, user } = await requireUser();
  await supabase.from("quiz_attempts").insert({ user_id: user.id, level: levelN, score, total: questions.length, answers });
  return { score, total: questions.length, details, toReview };
}
