import type { Metadata } from "next";
import { Nunito_Sans, Rubik } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const nunito = Nunito_Sans({ variable: "--font-nunito", subsets: ["latin"] });
const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "L’Essor Digital · Formation WordPress",
  description: "Plateforme de formation WordPress : vidéos, questions de fin de niveau et sessions en direct.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${nunito.variable} ${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line py-6 text-center text-sm text-muted">
          L’Essor Digital · Formation WordPress
        </footer>
      </body>
    </html>
  );
}
