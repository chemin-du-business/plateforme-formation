import AuthForm from "@/components/AuthForm";
import { signIn } from "../actions";

export const metadata = { title: "Connexion · L’Essor Digital" };

export default function ConnexionPage() {
  return (
    <div className="px-5 pb-16">
      <AuthForm action={signIn} />
    </div>
  );
}
