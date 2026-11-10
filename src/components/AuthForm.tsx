"use client";

import { useActionState } from "react";
import type { AuthState } from "@/app/(auth)/actions";

const field = "w-full rounded-xl border border-line bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function AuthForm({ action }: { action: (prev: AuthState, formData: FormData) => Promise<AuthState> }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="fade-up mx-auto mt-10 w-full max-w-md space-y-5 rounded-2xl border border-line bg-white p-8 shadow-sm">
      <h1 className="font-display text-3xl font-semibold text-brand">Connexion</h1>
      <p className="text-sm text-muted">Utilisez l’adresse e-mail et le mot de passe qui vous ont été communiqués par L’Essor Digital.</p>
      <label className="block text-sm font-semibold">
        Adresse e-mail
        <input name="email" type="email" required autoComplete="email" className={`${field} mt-1`} />
      </label>
      <label className="block text-sm font-semibold">
        Mot de passe
        <input name="password" type="password" required autoComplete="current-password" className={`${field} mt-1`} />
      </label>
      {state?.error && <p role="alert" className="rounded-lg bg-brand/10 px-4 py-3 text-sm font-semibold text-brand-dark">{state.error}</p>}
      <button disabled={pending} className="press w-full rounded-full bg-brand px-6 py-3 text-base font-bold text-cream hover:bg-brand-dark disabled:opacity-60">
        {pending ? "Un instant…" : "Me connecter"}
      </button>
    </form>
  );
}
