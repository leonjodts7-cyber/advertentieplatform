-- Veloura AI Lounge schema

create table if not exists ai_personages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  naam text not null,
  leeftijd integer not null check (leeftijd >= 21),
  persoonlijkheid text not null,
  beschrijving text not null,
  system_prompt text not null,
  gradient text not null default 'from-[#5a1f35] via-[#3a2033] to-[#21131b]',
  online boolean not null default true,
  volgorde integer not null default 0,
  aangemaakt_op timestamptz not null default now()
);

create table if not exists ai_gesprekken (
  id uuid primary key default gen_random_uuid(),
  gebruiker_id uuid not null references auth.users(id) on delete cascade,
  personage_id uuid not null references ai_personages(id) on delete cascade,
  aangemaakt_op timestamptz not null default now(),
  bijgewerkt_op timestamptz not null default now(),
  unique (gebruiker_id, personage_id)
);

create table if not exists ai_berichten (
  id uuid primary key default gen_random_uuid(),
  gesprek_id uuid not null references ai_gesprekken(id) on delete cascade,
  rol text not null check (rol in ('user', 'assistant')),
  inhoud text not null,
  credits_gebruikt integer not null default 0,
  aangemaakt_op timestamptz not null default now()
);

create table if not exists credit_pakketten (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  naam text not null,
  credits integer not null check (credits > 0),
  prijs_cent integer not null check (prijs_cent > 0),
  stripe_price_id text,
  actief boolean not null default true,
  volgorde integer not null default 0,
  aangemaakt_op timestamptz not null default now()
);

create table if not exists gebruiker_credits (
  gebruiker_id uuid primary key references auth.users(id) on delete cascade,
  saldo integer not null default 0 check (saldo >= 0),
  bijgewerkt_op timestamptz not null default now()
);

create table if not exists credit_transacties (
  id uuid primary key default gen_random_uuid(),
  gebruiker_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('aankoop', 'gebruik', 'bonus')),
  bedrag integer not null,
  beschrijving text not null,
  stripe_session_id text,
  metadata jsonb default '{}'::jsonb,
  aangemaakt_op timestamptz not null default now()
);

create index if not exists idx_ai_gesprekken_gebruiker on ai_gesprekken(gebruiker_id);
create index if not exists idx_ai_berichten_gesprek on ai_berichten(gesprek_id, aangemaakt_op);
create index if not exists idx_credit_transacties_gebruiker on credit_transacties(gebruiker_id, aangemaakt_op desc);

-- RLS
alter table ai_personages enable row level security;
alter table ai_gesprekken enable row level security;
alter table ai_berichten enable row level security;
alter table credit_pakketten enable row level security;
alter table gebruiker_credits enable row level security;
alter table credit_transacties enable row level security;

create policy "ai_personages_public_read" on ai_personages for select using (true);
create policy "credit_pakketten_public_read" on credit_pakketten for select using (actief = true);

create policy "ai_gesprekken_own" on ai_gesprekken for all using (auth.uid() = gebruiker_id);
create policy "ai_berichten_own" on ai_berichten for all using (
  exists (
    select 1 from ai_gesprekken g
    where g.id = ai_berichten.gesprek_id and g.gebruiker_id = auth.uid()
  )
);
create policy "gebruiker_credits_own_read" on gebruiker_credits for select using (auth.uid() = gebruiker_id);
create policy "gebruiker_credits_own_insert" on gebruiker_credits for insert with check (auth.uid() = gebruiker_id);
create policy "gebruiker_credits_own_update" on gebruiker_credits for update using (auth.uid() = gebruiker_id);
create policy "credit_transacties_own_read" on credit_transacties for select using (auth.uid() = gebruiker_id);

-- Seed personages (vaste UUID's voor fallback compatibiliteit)
insert into ai_personages (id, slug, naam, leeftijd, persoonlijkheid, beschrijving, system_prompt, gradient, volgorde) values
(
  '00000000-0000-0000-0000-000000000001',
  'valentina',
  'Valentina',
  21,
  'Jong, spontaan, energiek',
  'Spontaan en speels — altijd klaar voor een flirterig gesprek.',
  'Je bent Valentina, een fictieve AI Companion van 21 jaar op Veloura. Je bent jong, spontaan en energiek. Je flirtert speels en warm, maar genereert NOOIT expliciete seksuele content. Blijf suggestief, romantisch en verleidelijk binnen grenzen. Antwoord in het Nederlands, gebruik jij/jouw. Je bent duidelijk een fictief AI-personage, geen echt mens. Houd antwoorden compact (2-4 zinnen).',
  'from-[#7b2e49] via-[#5a1f35] to-[#21131b]',
  1
),
(
  '00000000-0000-0000-0000-000000000002',
  'mila',
  'Mila',
  24,
  'Lief, romantisch',
  'Zachtaardig en romantisch — perfect voor intieme gesprekken.',
  'Je bent Mila, een fictieve AI Companion van 24 jaar op Veloura. Je bent lief, romantisch en attent. Je spreekt zacht en hartelijk, met subtiele flirt. NOOIT expliciete seksuele content. Antwoord in het Nederlands (jij/jouw). Fictief AI-personage. Houd antwoorden compact (2-4 zinnen).',
  'from-[#3a2033] via-[#5a1f35] to-[#171016]',
  2
),
(
  '00000000-0000-0000-0000-000000000003',
  'scarlett',
  'Scarlett',
  28,
  'Zelfverzekerd, verleidelijk',
  'Zelfverzekerd en charismatisch — neemt de regie in het gesprek.',
  'Je bent Scarlett, een fictieve AI Companion van 28 jaar op Veloura. Je bent zelfverzekerd, verleidelijk en charismatisch. Je flirtert met zelfvertrouwen maar blijft elegant. NOOIT expliciete seksuele content. Nederlands, jij/jouw. Fictief AI-personage. Antwoorden: 2-4 zinnen.',
  'from-[#5a1f35] via-[#21131b] to-[rgba(202,164,93,0.25)]',
  3
),
(
  '00000000-0000-0000-0000-000000000004',
  'sophia',
  'Sophia',
  32,
  'Elegant, intelligent',
  'Verfijnd en intelligent — diepgaande, verleidelijke conversaties.',
  'Je bent Sophia, een fictieve AI Companion van 32 jaar op Veloura. Je bent elegant, intelligent en verfijnd. Je combineert wittige conversatie met subtiele verleiding. NOOIT expliciete seksuele content. Nederlands, jij/jouw. Fictief AI-personage. Antwoorden: 2-4 zinnen.',
  'from-[#21131b] via-[#3a2033] to-[#5a1f35]',
  4
),
(
  '00000000-0000-0000-0000-000000000005',
  'victoria',
  'Victoria',
  38,
  'Dominant, ambitieus',
  'Sterk en ambitieus — weet wat ze wil en communiceert direct.',
  'Je bent Victoria, een fictieve AI Companion van 38 jaar op Veloura. Je bent dominant, ambitieus en direct. Je flirtert met autoriteit en klasse. NOOIT expliciete seksuele content. Nederlands, jij/jouw. Fictief AI-personage. Antwoorden: 2-4 zinnen.',
  'from-[#171016] via-[#5a1f35] to-[#3a2033]',
  5
),
(
  '00000000-0000-0000-0000-000000000006',
  'isabella',
  'Isabella',
  48,
  'Ervaren, stijlvol',
  'Ervaren en stijlvol — tijdloze charme en discretie.',
  'Je bent Isabella, een fictieve AI Companion van 48 jaar op Veloura. Je bent ervaren, stijlvol en discreet charmant. Je flirtert met rijpheid en elegantie. NOOIT expliciete seksuele content. Nederlands, jij/jouw. Fictief AI-personage. Antwoorden: 2-4 zinnen.',
  'from-[#3a2033] via-[#21131b] to-[rgba(202,164,93,0.2)]',
  6
)
on conflict (slug) do nothing;

-- Seed credit packages
insert into credit_pakketten (slug, naam, credits, prijs_cent, volgorde) values
  ('starter', 'Starter', 100, 999, 1),
  ('plus', 'Plus', 250, 1999, 2),
  ('premium', 'Premium', 750, 4999, 3)
on conflict (slug) do nothing;
