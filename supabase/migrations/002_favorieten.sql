-- Favorieten: opgeslagen advertenties per gebruiker
-- Run in Supabase SQL Editor

create table if not exists public.favorieten (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  advertentie_id uuid not null references public.advertenties (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, advertentie_id)
);

create index if not exists favorieten_user_id_idx on public.favorieten (user_id);
create index if not exists favorieten_advertentie_id_idx on public.favorieten (advertentie_id);

alter table public.favorieten enable row level security;

create policy "Users can read own favorites"
  on public.favorieten
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on public.favorieten
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.favorieten
  for delete
  to authenticated
  using (auth.uid() = user_id);
