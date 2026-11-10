# L’Essor Digital · Plateforme de formation WordPress

Next.js (App Router) + Supabase. Accès sur invitation. Deux parties : **Révision en ligne** (vidéos, exercices, questions de fin de niveau, progression) et
**Slides des sessions** (les slides utilisées pendant les sessions synchrones, partagées par ailleurs sur Teams ou Zoom).
Espace formateur : suivi des apprenants et gestion des comptes. Page « Paramètres » : chaque compte change son propre mot de passe.

## Démarrer

1. **Supabase** : créez un projet (région Europe). Dans *SQL Editor*, exécutez le fichier `supabase/schema.sql`.
2. **Variables** : copiez `.env.example` en `.env.local` et renseignez `NEXT_PUBLIC_SUPABASE_URL` (Project Settings → API →
   « Project URL ») et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. `SUPABASE_SECRET_KEY` n’est utilisée que par la page
   « Comptes » du formateur : jamais dans le dépôt, jamais dans un chat.
3. **Accès sur invitation** (formation payante) : dans Supabase → Authentication → Sign In / Providers → Email, **désactivez
   « Allow new users to sign up »**. Il n’y a pas d’inscription publique : c’est le formateur qui crée les comptes
   (page `/formateur/comptes`, ou Authentication → Add user dans Supabase).
4. **Vidéos** : dans *Storage*, le bucket privé `videos` est créé par le SQL. Envoyez-y les fichiers du dossier
   `Formation_TOSA_WordPress/videos/` (les `.mp4` et les `.vtt`, **sans changer leurs noms**, à la racine du bucket).
5. `npm install` puis `npm run dev` → http://localhost:3000

## Compte formateur

Les comptes créés sont « apprenants » par défaut ; la page Comptes permet de créer un autre formateur. Pour le tout premier formateur, passez votre propre compte en formateur dans le *SQL Editor* :

```sql
update public.profiles set role = 'trainer'
where id = (select id from auth.users where email = 'votre-adresse@exemple.com');
```

## Structure

- `src/content/catalog.ts` : niveaux, modules et noms de fichiers vidéo.
- `src/content/quiz.ts` : 10 questions par niveau (corrigées côté serveur, jamais envoyées avec leurs réponses).
- `src/content/slides/` : les 3 diaporamas des sessions (HTML 1920×1080) et les notes du formateur (visibles des formateurs seulement).
- `supabase/schema.sql` : tables, sécurité (RLS) et stockage.
- `src/proxy.ts` : rafraîchit la session et protège les pages réservées aux comptes connectés.

## Données et RGPD

Les données (nom, e-mail, progression, tentatives) sont stockées dans Supabase : choisissez une région européenne.
Le consentement est demandé à l’inscription et horodaté (`profiles.consent_at`).
