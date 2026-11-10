"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePassword, type PasswordState } from "@/app/parametres/actions";

const field = "mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, undefined);
  const form = useRef<HTMLFormElement>(null);

  // Après un changement réussi, on vide les champs.
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="space-y-4 rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-xl font-semibold text-brand">Changer mon mot de passe</h2>
      <label className="block text-sm font-semibold">Mot de passe actuel
        <input name="current" type="password" autoComplete="current-password" required className={field} />
      </label>
      <label className="block text-sm font-semibold">Nouveau mot de passe
        <input name="next" type="password" autoComplete="new-password" required minLength={8} className={field} />
        <span className="mt-1 block text-xs font-normal text-muted">8 caractères minimum.</span>
      </label>
      <label className="block text-sm font-semibold">Confirmer le nouveau mot de passe
        <input name="confirm" type="password" autoComplete="new-password" required minLength={8} className={field} />
      </label>
      {state?.error && <p role="alert" className="rounded-lg bg-brand/10 px-4 py-3 text-sm font-semibold text-brand-dark">{state.error}</p>}
      {state?.ok && <p role="status" className="rounded-lg bg-gold/25 px-4 py-3 text-sm font-semibold text-brand-dark">{state.ok}</p>}
      <button disabled={pending} className="press rounded-full bg-brand px-6 py-2.5 font-bold text-cream hover:bg-brand-dark disabled:opacity-60">{pending ? "Enregistrement…" : "Enregistrer"}</button>
    </form>
  );
}
