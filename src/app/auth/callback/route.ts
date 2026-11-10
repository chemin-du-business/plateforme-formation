import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Retour du lien de confirmation e-mail envoyé par Supabase.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/tableau-de-bord`);
  }
  return NextResponse.redirect(`${origin}/connexion`);
}
