import Link from "next/link";
import PasswordForm from "@/components/PasswordForm";
import { requireUser } from "@/lib/data";

export const metadata = { title: "Paramètres · L’Essor Digital" };

export default async function ParametresPage() {
  const { user } = await requireUser();
  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <Link href="/tableau-de-bord" className="text-sm font-semibold text-brand underline">← Tableau de bord</Link>
      <h1 className="fade-up mt-4 font-display text-3xl font-semibold text-brand">Paramètres</h1>
      <p className="mt-2 text-muted">Connecté avec <b className="text-ink">{user.email}</b></p>
      <div className="fade-up mt-6"><PasswordForm /></div>
    </div>
  );
}
