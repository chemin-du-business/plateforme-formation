import Link from "next/link";
import { CreateAccountForm, ResetPasswordForm } from "@/components/AccountForms";
import { requireTrainer } from "@/lib/data";
import { createAdminClient, hasAdminKey } from "@/lib/supabase/admin";
import { setAccess } from "./actions";

export const metadata = { title: "Comptes · L’Essor Digital" };

export default async function AccountsPage() {
  const { user } = await requireTrainer();
  type Row = { id: string; email: string; name: string; role: string; blocked: boolean; last: string | null };
  let rows: Row[] = [];
  if (hasAdminKey) {
    const admin = createAdminClient();
    const [{ data: users }, { data: profiles }] = await Promise.all([admin.auth.admin.listUsers({ page: 1, perPage: 200 }), admin.from("profiles").select("id, full_name, role")]);
    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
    rows = (users?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? "",
      name: byId.get(u.id)?.full_name || "—",
      role: byId.get(u.id)?.role ?? "learner",
      blocked: Boolean(u.banned_until && new Date(u.banned_until) > new Date()),
      last: u.last_sign_in_at ?? null,
    }));
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/tableau-de-bord" className="text-sm font-semibold text-brand underline">← Tableau de bord</Link>
      <h1 className="fade-up mt-4 font-display text-3xl font-semibold text-brand">Comptes des apprenants</h1>
      <p className="mt-2 text-muted">La formation est payante : c’est vous qui créez les comptes et communiquez les identifiants.</p>

      {!hasAdminKey ? (
        <p className="mt-6 rounded-xl bg-gold/25 px-5 py-4 text-sm font-semibold text-brand-dark">
          Pour gérer les comptes depuis cette page, ajoutez <code>SUPABASE_SECRET_KEY</code> dans <code>.env.local</code> (clé secrète Supabase, jamais dans le dépôt). En attendant, créez les comptes dans Supabase → Authentication → Add user.
        </p>
      ) : (
        <>
          <div className="mt-6"><CreateAccountForm /></div>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-wider text-muted">
                <tr><th className="px-4 py-3">Nom</th><th className="px-4 py-3">E-mail</th><th className="px-4 py-3">Rôle</th><th className="px-4 py-3">Dernière connexion</th><th className="px-4 py-3">Mot de passe</th><th className="px-4 py-3">Accès</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-line align-top">
                    <td className="px-4 py-3 font-semibold">{r.name}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.role === "trainer" ? "Formateur" : "Apprenant"}</td>
                    <td className="px-4 py-3">{r.last ? new Date(r.last).toLocaleDateString("fr-FR") : "Jamais"}</td>
                    <td className="px-4 py-3"><ResetPasswordForm userId={r.id} /></td>
                    <td className="px-4 py-3">
                      {r.id === user.id ? <span className="text-muted">Vous</span> : (
                        <form action={setAccess}>
                          <input type="hidden" name="user_id" value={r.id} />
                          <input type="hidden" name="block" value={r.blocked ? "0" : "1"} />
                          <button className="press rounded-full border border-line px-3 py-1.5 text-xs font-bold hover:border-brand">{r.blocked ? "Rétablir l’accès" : "Retirer l’accès"}</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
