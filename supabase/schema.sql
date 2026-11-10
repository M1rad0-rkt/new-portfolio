-- ════════════════════════════════════════════════════════════════
--  Portfolio Mirado — schéma Supabase
--  À coller dans Supabase → SQL Editor → Run. Rejouable sans risque.
--
--  Sécurité : tout le monde LIT le contenu, seuls les comptes listés
--  dans public.admins peuvent ÉCRIRE (règles RLS appliquées par la base,
--  pas par le site : un visiteur ne peut rien modifier même avec la clé anon).
-- ════════════════════════════════════════════════════════════════

-- 1) Administrateurs ------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

drop policy if exists "admin reads own row" on public.admins;
create policy "admin reads own row" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 2) Contenu --------------------------------------------------------
create table if not exists public.entries (
  id          uuid primary key default gen_random_uuid(),
  collection  text not null
              check (collection in ('projects','gallery','journey','skills','services','texts')),
  position    integer not null default 0,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists entries_collection_position_idx
  on public.entries (collection, position);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists entries_touch on public.entries;
create trigger entries_touch before update on public.entries
  for each row execute function public.touch_updated_at();

alter table public.entries enable row level security;

drop policy if exists "public can read entries" on public.entries;
create policy "public can read entries" on public.entries
  for select to anon, authenticated using (true);

drop policy if exists "admin can insert entries" on public.entries;
create policy "admin can insert entries" on public.entries
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admin can update entries" on public.entries;
create policy "admin can update entries" on public.entries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin can delete entries" on public.entries;
create policy "admin can delete entries" on public.entries
  for delete to authenticated using (public.is_admin());

-- 3) Images (bucket public « portfolio ») ---------------------------
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists "public can read portfolio files" on storage.objects;
create policy "public can read portfolio files" on storage.objects
  for select using (bucket_id = 'portfolio');

drop policy if exists "admin can upload portfolio files" on storage.objects;
create policy "admin can upload portfolio files" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "admin can update portfolio files" on storage.objects;
create policy "admin can update portfolio files" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio' and public.is_admin())
  with check (bucket_id = 'portfolio' and public.is_admin());

drop policy if exists "admin can delete portfolio files" on storage.objects;
create policy "admin can delete portfolio files" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio' and public.is_admin());

-- 3 bis) Avis des visiteurs -----------------------------------------
--  • n'importe qui peut DÉPOSER un avis, mais il est créé « non validé » ;
--  • le public ne voit QUE les avis validés (approved = true) ;
--  • l'admin voit tout, valide (approved = true), masque ou supprime.
--  Validation possible depuis le site (mode édition) ou depuis
--  Supabase → Table Editor → reviews (cocher / décocher « approved »).
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 80),
  role        text check (role is null or char_length(role) <= 80),
  rating      smallint not null check (rating between 1 and 5),
  message     text not null check (char_length(btrim(message)) between 10 and 600),
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists reviews_approved_created_idx
  on public.reviews (approved, created_at desc);

-- Garde-fou anti-flood : au plus 100 avis en attente à la fois (hors admin).
create or replace function public.reviews_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin()
     and (select count(*) from public.reviews where approved = false) >= 100 then
    raise exception 'Trop d''avis en attente, réessayez plus tard.';
  end if;
  return new;
end;
$$;
drop trigger if exists reviews_guard_trg on public.reviews;
create trigger reviews_guard_trg before insert on public.reviews
  for each row execute function public.reviews_guard();

alter table public.reviews enable row level security;

drop policy if exists "public reads approved reviews" on public.reviews;
create policy "public reads approved reviews" on public.reviews
  for select to anon, authenticated using (approved = true or public.is_admin());

drop policy if exists "anyone can submit a review" on public.reviews;
create policy "anyone can submit a review" on public.reviews
  for insert to anon, authenticated with check (approved = false or public.is_admin());

drop policy if exists "admin can update reviews" on public.reviews;
create policy "admin can update reviews" on public.reviews
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin can delete reviews" on public.reviews;
create policy "admin can delete reviews" on public.reviews
  for delete to authenticated using (public.is_admin());

-- 4) Déclarer le compte administrateur ------------------------------
-- À rejouer APRÈS avoir créé l'utilisateur (Authentication → Users → Add user,
-- ou `node scripts/create-admin.mjs`). Sans effet tant que l'utilisateur n'existe pas.
insert into public.admins (user_id)
select id from auth.users where email = 'miradorakoto111@gmail.com'
on conflict (user_id) do nothing;
