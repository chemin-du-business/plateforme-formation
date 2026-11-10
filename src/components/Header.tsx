import Image from "next/image";
import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";

export default async function Header() {
  let loggedIn = false;
  let trainer = false;
  if (hasSupabase) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    loggedIn = Boolean(data.user);
    if (data.user) {
      const { data: p } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
      trainer = p?.role === "trainer";
    }
  }
  const items = [
    { href: "/tableau-de-bord", label: "Révision" },
    { href: "/ressources", label: "Slides des sessions" },
    ...(trainer ? [{ href: "/formateur/suivi", label: "Suivi" }, { href: "/formateur/comptes", label: "Comptes" }] : []),
    { href: "/parametres", label: "Paramètres" },
  ];
  return (
    <header className="relative z-40 bg-brand text-cream">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <Link href={loggedIn ? "/tableau-de-bord" : "/"} className="flex items-center gap-3" aria-label="L’Essor Digital, accueil">
          <Image src="/logo-essor.png" alt="" width={44} height={44} className="pop-in rounded-full" priority />
          <span className="whitespace-nowrap font-display text-lg font-semibold">L’Essor Digital</span>
        </Link>
        <NavMenu loggedIn={loggedIn} items={items} badge={trainer ? "Espace formateur" : "Espace apprenant"} trainer={trainer} />
      </div>
    </header>
  );
}
