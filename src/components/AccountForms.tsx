"use client";

import { useActionState, useRef } from "react";
import { createAccount, resetPassword, type AccountState } from "@/app/formateur/comptes/actions";

const field = "w-full rounded-xl border border-line bg-white px-4 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function randomPassword() {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function CreateAccountForm() {
  const [state, action, pending] = useActionState<AccountState, FormData>(createAccount, undefined);
  const pwd = useRef<HTMLInputElement>(null);
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-xl font-semibold text-brand">Créer un compte apprenant</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Prénom et nom<input name="full_name" required className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold">Adresse e-mail<input name="email" type="email" required className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold">Mot de passe provisoire
          <div className="mt-1 flex gap-2">
            <input ref={pwd} name="password" required minLength={8} className={field} />
            <button type="button" onClick={() => { if (pwd.current) pwd.current.value = randomPassword(); }} className="press whitespace-nowrap rounded-xl border border-brand px-3 text-sm font-bold text-brand hover:bg-brand hover:text-cream">Générer</button>
          </div>
        </label>
        <label className="text-sm font-semibold">Rôle
          <select name="role" className={`${field} mt-1`}><option value="learner">Apprenant</option><option value="trainer">Formateur / administrateur</option></select>
        </label>
      </div>
      {state?.error && <p role="alert" className="rounded-lg bg-brand/10 px-4 py-3 text-sm font-semibold text-brand-dark">{state.error}</p>}
      {state?.ok && <p role="status" className="rounded-lg bg-gold/25 px-4 py-3 text-sm font-semibold text-brand-dark">{state.ok}</p>}
      <button disabled={pending} className="press rounded-full bg-brand px-6 py-2.5 font-bold text-cream hover:bg-brand-dark disabled:opacity-60">{pending ? "Création…" : "Créer le compte"}</button>
    </form>
  );
}

export function ResetPasswordForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(resetPassword, undefined);
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="user_id" value={userId} />
      <input name="password" required minLength={8} placeholder="Nouveau mot de passe" className="w-44 rounded-lg border border-line bg-white px-3 py-1.5 text-sm" aria-label="Nouveau mot de passe" />
      <button disabled={pending} className="press rounded-full border border-brand px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand hover:text-cream">Changer</button>
      {state?.error && <span role="alert" className="text-xs font-semibold text-brand">{state.error}</span>}
      {state?.ok && <span role="status" className="text-xs font-semibold text-green-800">{state.ok}</span>}
    </form>
  );
}
