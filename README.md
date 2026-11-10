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
2. **SQL Editor** → ouvrir le fichier `supabase/schema.sql`, **copier tout son contenu** (pas son nom) et l'exécuter (tables, avis, sécurité RLS, bucket d'images). Le script est rejouable : à refaire après chaque mise à jour du projet.
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

## Avis des visiteurs
- La section **Avis** (avant le pied de page) n'apparaît que si Supabase est configuré.
- Un visiteur dépose un avis (nom, note 1–5, message) : il est enregistré **non validé** et reste invisible tant que vous ne l'approuvez pas.
- **Valider depuis le site** : connexion admin → mode édition → bloc « Avis à valider » → *Approuver* / *Supprimer*. Un avis publié peut être *masqué* ou supprimé.
- **Valider depuis Supabase** : Table Editor → `reviews` → cocher `approved` (ou supprimer la ligne).
- Protections : validation par la base (RLS), champ piège anti-robots, 1 avis/minute par navigateur, 100 avis en attente maximum.

## Contact
Il n'y a plus de section Contact ni de formulaire : les coordonnées (e-mail, GitHub, LinkedIn, localisation) sont dans le **pied de page** (lien « Contact » du menu). Elles se changent dans `src/data/profile.ts`.

## Déploiement
Vercel : Framework *Vite*, build `npm run build`, sortie `dist`. Ajouter les variables d'environnement ci-dessus.
