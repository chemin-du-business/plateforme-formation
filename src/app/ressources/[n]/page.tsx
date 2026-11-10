import Link from "next/link";
import { notFound } from "next/navigation";
import SlideBrowser from "@/components/SlideBrowser";
import { levelByN } from "@/content/catalog";
import { getNotes, getSlides } from "@/content/slides";
import { requireUser } from "@/lib/data";

export default async function DeckPage({ params, searchParams }: { params: Promise<{ n: string }>; searchParams: Promise<{ s?: string }> }) {
  const { n } = await params;
  const { s } = await searchParams;
  const level = levelByN(Number(n));
  if (!level) notFound();
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const slides = getSlides(level.n);
  const start = Math.max(0, slides.findIndex((x) => x.id === s));
  // Les notes du formateur ne sont envoyées qu'aux comptes formateur.
  const notes = profile?.role === "trainer" ? getNotes(level.n) : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <Link href="/ressources" className="text-sm font-semibold text-brand underline">← Slides des sessions</Link>
      <h1 className="mb-5 mt-3 font-display text-2xl font-semibold text-brand">Niveau {level.n} · {level.name}</h1>
      <SlideBrowser slides={slides} initialIndex={start} notes={notes} />
    </div>
  );
}
