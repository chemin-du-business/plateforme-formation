-- L'Essor Digital · Plateforme de formation WordPress (TOSA)
-- À exécuter une fois dans Supabase : SQL Editor → New query → coller → Run.
-- Région recommandée à la création du projet : Europe (RGPD).

-- ============ Profils ============
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'learner' check (role in ('learner', 'trainer')),
  consent_at timestamptz,
  created_at timestamptz not null default now()
);

-- Crée automatiquement le profil à l'inscription (le rôle est toujours « learner » ici ;
-- on passe un compte en « trainer » à la main, voir README).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, consent_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when (new.raw_user_meta_data ->> 'consent') = 'true' then now() else null end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Aide : le compte connecté est-il formateur ?
create or replace function public.is_trainer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'trainer');
$$;

-- ============ Progression des vidéos ============
create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  module_key text not null,            -- ex. « n2-m4 » (voir src/content/catalog.ts)
  completed boolean not null default false,
  last_position integer not null default 0,   -- secondes
  updated_at timestamptz not null default now(),
  primary key (user_id, module_key)
);

-- ============ Tentatives aux questions de fin de niveau ============
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  level smallint not null check (level between 1 and 3),
  score smallint not null,
  total smallint not null,
  answers jsonb not null,              -- { questionId: indexChoisi }
  created_at timestamptz not null default now()
);
create index if not exists quiz_attempts_user_level on public.quiz_attempts (user_id, level, created_at desc);

-- ============ Sécurité (Row Level Security) ============
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.quiz_attempts enable row level security;

-- Profils : chacun lit et modifie le sien (sans pouvoir changer son rôle) ; le formateur lit tout.
drop policy if exists "profil: lecture" on public.profiles;
create policy "profil: lecture" on public.profiles for select
  using (id = auth.uid() or public.is_trainer());

drop policy if exists "profil: mise à jour" on public.profiles;
create policy "profil: mise à jour" on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Progression : chacun gère la sienne ; le formateur la lit.
drop policy if exists "progression: lecture" on public.progress;
create policy "progression: lecture" on public.progress for select
  using (user_id = auth.uid() or public.is_trainer());
drop policy if exists "progression: écriture" on public.progress;
create policy "progression: écriture" on public.progress for insert
  with check (user_id = auth.uid());
drop policy if exists "progression: modification" on public.progress;
create policy "progression: modification" on public.progress for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Questions : chacun lit et ajoute ses tentatives (le score est calculé côté serveur) ; le formateur lit tout.
drop policy if exists "quiz: lecture" on public.quiz_attempts;
create policy "quiz: lecture" on public.quiz_attempts for select
  using (user_id = auth.uid() or public.is_trainer());
drop policy if exists "quiz: ajout" on public.quiz_attempts;
create policy "quiz: ajout" on public.quiz_attempts for insert
  with check (user_id = auth.uid());

-- ============ Stockage des vidéos (bucket privé « videos ») ============
insert into storage.buckets (id, name, public)
values ('videos', 'videos', false)
on conflict (id) do nothing;

drop policy if exists "vidéos: lecture pour les comptes connectés" on storage.objects;
create policy "vidéos: lecture pour les comptes connectés" on storage.objects for select
  using (bucket_id = 'videos' and auth.role() = 'authenticated');
