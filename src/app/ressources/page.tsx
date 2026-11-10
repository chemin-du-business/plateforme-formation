import Link from "next/link";
import { LEVELS } from "@/content/catalog";
import { getSlides } from "@/content/slides";
import { requireUser } from "@/lib/data";

export const metadata = { title: "Slides des sessions · L’Essor Digital" };

export default async function Resources() {
  await requireUser();
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="fade-up font-display text-3xl font-semibold text-brand">Slides des sessions</h1>
      <p className="mt-2 text-muted">Les slides utilisées pendant les sessions avec votre formateur (Teams, Zoom…). Parcourez-les à votre rythme pour réviser.</p>
      <ul className="mt-8 space-y-4">
        {LEVELS.map((l, i) => (
          <li key={l.n} className="fade-up" style={{ "--d": i + 1 } as React.CSSProperties}>
            <Link href={`/ressources/${l.n}`} className="lift flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white px-6 py-5">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gold font-display text-xl font-bold text-brand-dark" aria-hidden>{l.n}</span>
              <span>
                <span className="block font-display text-xl font-semibold text-brand">Niveau {l.n} · {l.name}</span>
                <span className="text-sm text-muted">{getSlides(l.n).length} slides · {l.modules.length} modules</span>
              </span>
              <span className="ml-auto font-bold text-brand">Ouvrir →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
