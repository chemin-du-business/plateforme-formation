import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Les vérifications de build (npm run build) peuvent utiliser un autre dossier (NEXT_DIST_DIR) pour ne pas écraser celui du serveur de développement.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
