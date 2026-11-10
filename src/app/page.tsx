import Link from "next/link";
import { LEVELS } from "@/content/catalog";
import { hasSupabase } from "@/lib/supabase/env";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      {!hasSupabase && (
        <p className="mb-8 rounded-xl bg-gold/25 px-5 py-4 text-sm font-semibold text-brand-dark">
          Configuration en cours : renseignez les variables Supabase dans <code>.env.local</code> (voir <code>.env.example</code>) pour activer la connexion.
        </p>
      )}
      <section className="relative overflow-hidden rounded-3xl bg-brand px-8 py-14 text-cream sm:px-14">
        <div aria-hidden className="drift pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/30 blur-2xl" />
        <div aria-hidden className="float pointer-events-none absolute bottom-10 right-16 hidden h-24 w-24 sm:block rounded-3xl border-4 border-gold/60" />
        <div aria-hidden className="drift pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-cream/10 blur-xl" />
        <p style={{ "--d": 1 } as React.CSSProperties} className="fade-up relative text-sm font-bold uppercase tracking-widest text-gold">Formation WordPress · préparation TOSA</p>
        <h1 style={{ "--d": 2 } as React.CSSProperties} className="fade-up relative mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">Révisez WordPress pas à pas, à votre rythme.</h1>
        <p style={{ "--d": 3 } as React.CSSProperties} className="fade-up relative mt-5 max-w-2xl text-lg">Les vidéos de révision (ordinateur et mobile), des exercices, des questions de fin de niveau corrigées, et les slides utilisées pendant vos sessions avec le formateur.</p>
        <div style={{ "--d": 4 } as React.CSSProperties} className="fade-up relative mt-8 flex flex-wrap gap-4">
          <Link href="/connexion" className="press shine pulse-ring rounded-full bg-gold px-7 py-3 font-bold text-brand-dark hover:bg-cream">Me connecter</Link>
          <p className="self-center text-sm text-cream/90">Accès réservé aux apprenants inscrits. Vos identifiants vous sont envoyés par L’Essor Digital.</p>
        </div>
      </section>
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {LEVELS.map((l) => (
          <article key={l.n} style={{ "--d": 5 + l.n } as React.CSSProperties} className="fade-up lift rounded-2xl border border-line bg-white p-7">
            <p className="text-sm font-bold uppercase tracking-widest text-gold-dark">Niveau {l.n}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-brand">{l.name}</h2>
            <p className="mt-3 text-muted">{l.tagline}</p>
            <p className="mt-4 text-sm font-semibold">{l.modules.length} vidéos de révision · 10 questions · slides des sessions</p>
          </article>
        ))}
      </section>
    </div>
  );
}
