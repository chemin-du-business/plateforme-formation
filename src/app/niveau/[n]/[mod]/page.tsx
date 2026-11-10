import Link from "next/link";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { levelByN, slideIdFor } from "@/content/catalog";
import { requireUser } from "@/lib/data";

const SIGNED_SECONDS = 60 * 60 * 3;

export default async function ModulePage({ params }: { params: Promise<{ n: string; mod: string }> }) {
  const { n, mod } = await params;
  const level = levelByN(Number(n));
  const index = level ? level.modules.findIndex((m) => m.num === Number(mod)) : -1;
  if (!level || index < 0) notFound();
  const mod_ = level.modules[index];
  const prev = level.modules[index - 1];
  const next = level.modules[index + 1];

  const { supabase, user } = await requireUser();
  const [{ data: row }, signed] = await Promise.all([
    supabase.from("progress").select("last_position, completed").eq("user_id", user.id).eq("module_key", mod_.key).maybeSingle(),
    supabase.storage.from("videos").createSignedUrls([`${mod_.file}_16x9.mp4`, `${mod_.file}_9x16.mp4`, `${mod_.file}.vtt`], SIGNED_SECONDS),
  ]);
  const urls = signed.data ?? [];
  const pick = (suffix: string) => urls.find((u) => u.path?.endsWith(suffix) && !u.error)?.signedUrl ?? null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href={`/niveau/${level.n}`} className="text-sm font-semibold text-brand underline">← Niveau {level.n} · {level.name}</Link>
      <p className="mt-4 text-sm font-bold uppercase tracking-widest text-gold-dark">Module {mod_.num} / {level.modules.length}{row?.completed ? <span className="text-green-700"> · terminé ✓</span> : null}</p>
      <h1 className="fade-up mb-6 font-display text-3xl font-semibold text-brand">{mod_.title}</h1>

      <VideoPlayer
        moduleKey={mod_.key}
        desktopUrl={pick("_16x9.mp4")}
        mobileUrl={pick("_9x16.mp4")}
        subtitlesUrl={pick(".vtt")}
        startAt={row?.last_position ?? 0}
      />

      {mod_.exercise.length > 0 && (
        <section className="fade-up mt-8 rounded-2xl bg-gold/25 p-6">
          <h2 className="font-display text-xl font-semibold text-brand-dark">À vous de jouer : l’exercice</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">{mod_.exercise.map((e) => <li key={e}>{e}</li>)}</ul>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
            <a href="https://playground.wordpress.net/" target="_blank" rel="noopener noreferrer" className="press rounded-full bg-brand px-5 py-2 text-cream hover:bg-brand-dark">Ouvrir un WordPress de démonstration ↗</a>
            <Link href={`/ressources/${level.n}?s=${slideIdFor(level.n, mod_.num)}`} className="press rounded-full border border-brand px-5 py-2 text-brand hover:bg-brand hover:text-cream">Revoir les slides de ce module</Link>
          </div>
        </section>
      )}

      <nav className="mt-8 flex items-center justify-between gap-4 text-sm font-bold">
        {prev ? <Link href={`/niveau/${level.n}/${prev.num}`} className="rounded-full border border-line bg-white px-5 py-2.5 hover:border-brand">← Module précédent</Link> : <span />}
        {next ? (
          <Link href={`/niveau/${level.n}/${next.num}`} className="rounded-full bg-brand px-5 py-2.5 text-cream hover:bg-brand-dark">Module suivant →</Link>
        ) : (
          <Link href={`/niveau/${level.n}/questions`} className="rounded-full bg-gold px-5 py-2.5 text-brand-dark hover:bg-gold-dark hover:text-cream">Passer les questions →</Link>
        )}
      </nav>
    </div>
  );
}
