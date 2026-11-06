# Portfolio — Mirado Rakotoniaina

React + Vite + TypeScript, backend **Supabase** (contenu éditable en CRUD par l'admin), déployable sur Vercel.
Sans variables Supabase, le site fonctionne en 100 % statique avec le contenu initial.

## Lancer en local
```bash
npm install
cp .env.example .env   # puis renseigner les variables
npm run dev
```

## Mettre en place Supabase (≈10 min)
1. Créer un projet sur https://supabase.com.
2. **SQL Editor** → coller et exécuter `supabase/schema.sql` (tables, sécurité RLS, bucket d'images).
3. Créer le compte admin (au choix) :
   - **Dashboard** → Authentication → Users → *Add user* (e-mail `miradorakoto111@gmail.com`, mot de passe de votre choix, cocher *Auto confirm*) ;
   - ou en ligne de commande :
     ```bash
     SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... \
     ADMIN_EMAIL=miradorakoto111@gmail.com ADMIN_PASSWORD='...' node scripts/create-admin.mjs
     ```
4. Si vous avez créé l'utilisateur via le Dashboard, **ré-exécutez la dernière instruction** de `schema.sql` (`insert into public.admins …`) pour le déclarer admin.
5. Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (Settings → API, clé **anon**) dans `.env` et dans Vercel → Settings → Environment Variables.
6. Recommandé : Authentication → Providers → Email → désactiver les inscriptions publiques.

> La clé `service_role` ne doit **jamais** être mise dans une variable `VITE_*` ni dans le code front.

## Utiliser l'espace admin
- Icône cadenas dans la barre de navigation → connexion.
- Première connexion : bouton **« Importer le contenu initial »** dans la barre admin (une seule fois).
- Ensuite, sur chaque section : crayon (modifier), corbeille, flèches (ordre), « Ajouter… ». Les textes (intro, à propos, citation…) se modifient au crayon, en FR et EN.
- Éditable : projets, galerie, parcours, compétences, domaines, 7 textes. Non éditable : libellés du menu, infos « à propos », CV et liens de profil (`src/data/profile.ts`).

## Déploiement
Vercel : Framework *Vite*, build `npm run build`, sortie `dist`. Ajouter les variables d'environnement ci-dessus.
