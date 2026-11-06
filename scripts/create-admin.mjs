/**
 * Crée (ou met à jour) le compte administrateur et l'enregistre dans public.admins.
 *
 *   SUPABASE_URL=https://xxxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   ADMIN_EMAIL=miradorakoto111@gmail.com \
 *   ADMIN_PASSWORD='votre-mot-de-passe' \
 *   node scripts/create-admin.mjs
 *
 * ⚠ La clé « service_role » est SECRÈTE : ne la mettez jamais dans le front ni dans Vercel
 *   (variables VITE_*). Elle ne sert qu'à lancer ce script en local.
 */
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Variables manquantes : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let userId;
const created = await sb.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  email_confirm: true,
});

if (created.error) {
  // Déjà existant : on retrouve l'utilisateur et on met à jour son mot de passe.
  const list = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = list.data?.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  if (!existing) {
    console.error('Création impossible :', created.error.message);
    process.exit(1);
  }
  userId = existing.id;
  const upd = await sb.auth.admin.updateUserById(userId, { password: ADMIN_PASSWORD, email_confirm: true });
  if (upd.error) {
    console.error('Mise à jour du mot de passe impossible :', upd.error.message);
    process.exit(1);
  }
  console.log('Utilisateur existant : mot de passe mis à jour.');
} else {
  userId = created.data.user.id;
  console.log('Utilisateur créé.');
}

const { error } = await sb.from('admins').upsert({ user_id: userId });
if (error) {
  console.error("Enregistrement dans public.admins impossible (schema.sql exécuté ?) :", error.message);
  process.exit(1);
}
console.log(`✔ ${ADMIN_EMAIL} est administrateur.`);
