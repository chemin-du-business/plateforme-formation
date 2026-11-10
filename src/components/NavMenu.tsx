"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/(auth)/actions";

type Item = { href: string; label: string };
type Props = { loggedIn: boolean; items: Item[]; badge: string; trainer: boolean };

// Menu normal en ligne dès 768 px (tablette, ordinateur) ; menu burger à gauche (avant le logo) + tiroir qui s'ouvre depuis la gauche sous 768 px (téléphone).
export default function NavMenu({ loggedIn, items, badge, trainer }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const burger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // la page derrière ne défile plus
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    // Si l'on repasse en grand écran, le tiroir se ferme.
    const mq = window.matchMedia(trainer ? "(min-width: 1024px)" : "(min-width: 768px)");
    const onResize = () => { if (mq.matches) setOpen(false); };
    mq.addEventListener("change", onResize);
    const btn = burger.current;
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
      btn?.focus();
    };
  }, [open, trainer]);

  if (!loggedIn) {
    return <Link href="/connexion" className="press ml-auto whitespace-nowrap rounded-full bg-gold px-5 py-2 text-sm font-bold text-brand-dark hover:bg-cream">Connexion</Link>;
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const inlineNav = trainer ? "hidden lg:flex" : "hidden md:flex";
  const burgerOnly = trainer ? "lg:hidden" : "md:hidden";
  const badgeClass = `inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${trainer ? "bg-gold text-brand-dark" : "bg-cream/20 text-cream"}`;

  return (
    <>
      {/* Tablette et ordinateur : menu normal en ligne */}
      <nav aria-label="Navigation principale" className={`ml-auto ${inlineNav} items-center gap-4 text-sm font-semibold lg:gap-6`}>
        {items.map((it) => (
          <Link key={it.href} href={it.href} aria-current={isActive(it.href) ? "page" : undefined} className={`whitespace-nowrap border-b-2 py-1 transition-colors hover:text-gold ${isActive(it.href) ? "border-gold text-gold" : "border-transparent"}`}>{it.label}</Link>
        ))}
        <span className={`${badgeClass} !hidden lg:!inline-block`}>{badge}</span>
        <form action={signOut}>
          <button className="press whitespace-nowrap rounded-full border border-cream/60 px-4 py-1.5 hover:bg-cream hover:text-brand">Déconnexion</button>
        </form>
      </nav>

      {/* Téléphone : bouton burger tout à gauche, avant le logo */}
      <button
        ref={burger}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="menu-tiroir"
        aria-label="Ouvrir le menu"
        className={`press order-first flex h-11 w-11 flex-none items-center justify-center rounded-full border border-cream/50 ${burgerOnly}`}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M3 6h16M3 11h16M3 16h16" /></svg>
      </button>

      {open && (
        <div className={`fixed inset-0 z-[100] ${burgerOnly}`}>
          <button type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)} className="backdrop-in absolute inset-0 h-full w-full cursor-default bg-black/55" tabIndex={-1} />
          <aside id="menu-tiroir" role="dialog" aria-modal="true" aria-label="Menu" className="drawer-in absolute left-0 top-0 flex h-full w-[min(86vw,340px)] flex-col bg-brand-dark text-cream shadow-2xl">
            <div className="flex items-center gap-3 border-b border-cream/15 px-5 py-3">
              <Image src="/logo-essor.png" alt="" width={36} height={36} className="rounded-full" />
              <span className="font-display font-semibold">L’Essor Digital</span>
              <button ref={closeBtn} type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu" className="press ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-cream/50">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M5 5l12 12M17 5L5 17" /></svg>
              </button>
            </div>
            <div className="px-5 pt-4"><span className={badgeClass}>{badge}</span></div>
            <nav aria-label="Navigation principale" className="px-5 pt-2">
              <ul className="divide-y divide-cream/15 text-lg font-semibold">
                {items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} onClick={() => setOpen(false)} aria-current={isActive(it.href) ? "page" : undefined} className={`flex items-center justify-between py-4 ${isActive(it.href) ? "text-gold" : ""}`}>
                      {it.label}<span aria-hidden className="text-cream/50">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <form action={signOut} className="mt-auto p-5">
              <button className="press w-full rounded-full border border-cream/60 px-4 py-3 font-bold hover:bg-cream hover:text-brand">Déconnexion</button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
