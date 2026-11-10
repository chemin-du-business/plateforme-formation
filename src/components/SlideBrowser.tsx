"use client";

import { useEffect, useState } from "react";
import SlideView from "@/components/SlideView";
import type { Slide } from "@/content/slides";

type Props = { slides: Slide[]; initialIndex: number; notes: Record<string, string> | null };

// Responsive : la slide prend toute la largeur disponible (téléphone, tablette, ordinateur),
// sans jamais dépasser la hauteur de la fenêtre.
const FIT = "min(100%, max(320px, calc((100dvh - 320px) * 1.7778)))";

export default function SlideBrowser({ slides, initialIndex, notes }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const last = slides.length - 1;
  const go = (i: number) => setIndex(Math.min(Math.max(i, 0), last));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setIndex((i) => Math.min(i + 1, last)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  const slide = slides[index];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <div key={index} className="fade-up mx-auto max-w-full" style={{ width: FIT }}>
          <SlideView html={slide.html} className="rounded-xl border border-line" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Slide précédente" className="press rounded-full border border-line bg-white px-5 py-2 font-bold hover:border-brand disabled:opacity-40">← <span className="hidden sm:inline">Précédente</span></button>
          <p className="whitespace-nowrap text-sm font-semibold">Slide {index + 1} / {slides.length}</p>
          <button onClick={() => go(index + 1)} disabled={index === last} aria-label="Slide suivante" className="press rounded-full bg-brand px-5 py-2 font-bold text-cream hover:bg-brand-dark disabled:opacity-40"><span className="hidden sm:inline">Suivante</span> →</button>
        </div>
        {notes && (
          <section className="mt-5 rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-brand">Notes du formateur</h2>
            <p className="mt-2 whitespace-pre-line text-sm">{notes[slide.id] || "Pas de note pour cette slide."}</p>
          </section>
        )}
      </div>
      <ol className="max-h-[70vh] space-y-1 overflow-y-auto rounded-2xl border border-line bg-white p-2" aria-label="Sommaire des slides">
        {slides.map((s, i) => (
          <li key={s.id}>
            <button onClick={() => go(i)} aria-current={i === index} className={`flex w-full gap-3 rounded-lg px-3 py-2 text-left text-sm ${i === index ? "bg-gold/30 font-bold" : "hover:bg-cream"}`}>
              <span className="w-6 flex-none text-muted">{i + 1}</span>
              <span><span className="block text-xs text-muted">{s.kicker.replace(/·.*$/, "").trim()}</span>{s.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
