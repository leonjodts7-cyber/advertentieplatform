-- Phase 2: analytics, reviews, chat foundation

-- Analytics events
create type public.analytics_event_type as enum (
  'profile_view',
  'phone_click',
  'whatsapp_click',
  'website_click',
  'favorite_add',
  'favorite_remove',
  'chat_start',
  'video_view'
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type public.analytics_event_type not null,
  advertentie_id uuid not null references public.advertenties (id) on delete cascade,
  aanbieder_id uuid not null,
  viewer_id uuid references auth.users (id) on delete set null,
  session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_advertentie_idx
  on public.analytics_events (advertentie_id, created_at desc);
create index if not exists analytics_events_aanbieder_idx
  on public.analytics_events (aanbieder_id, created_at desc);
create index if not exists analytics_events_type_idx
  on public.analytics_events (event_type, created_at desc);
create index if not exists analytics_events_viewer_idx
  on public.analytics_events (viewer_id, created_at desc)
  where viewer_id is not null;

alter table public.analytics_events enable row level security;

create policy "Anyone can insert analytics events"
  on public.analytics_events
  for insert
  to anon, authenticated
  with check (true);

create policy "Providers read own analytics"
  on public.analytics_events
  for select
  to authenticated
  using (auth.uid() = aanbieder_id);

-- Reviews
create table if not exists public.advertentie_reviews (
  id uuid primary key default gen_random_uuid(),
  advertentie_id uuid not null references public.advertenties (id) on delete cascade,
  aanbieder_id uuid not null,
  reviewer_id uuid not null references auth.users (id) on delete cascade,
  rating smallint not null check (rating >= 1 and rating <= 5),
  title text,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (advertentie_id, reviewer_id)
);

create index if not exists advertentie_reviews_ad_idx
  on public.advertentie_reviews (advertentie_id, created_at desc);
create index if not exists advertentie_reviews_aanbieder_idx
  on public.advertentie_reviews (aanbieder_id);

alter table public.advertentie_reviews enable row level security;

create policy "Anyone can read reviews for active listings"
  on public.advertentie_reviews
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated users insert own reviews"
  on public.advertentie_reviews
  for insert
  to authenticated
  with check (auth.uid() = reviewer_id);

create policy "Users update own reviews"
  on public.advertentie_reviews
  for update
  to authenticated
  using (auth.uid() = reviewer_id);

create policy "Users delete own reviews"
  on public.advertentie_reviews
  for delete
  to authenticated
  using (auth.uid() = reviewer_id);

-- Chat foundation (user ↔ provider)
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  advertentie_id uuid references public.advertenties (id) on delete set null,
  visitor_id uuid not null references auth.users (id) on delete cascade,
  provider_id uuid not null references auth.users (id) on delete cascade,
  last_message_at timestamptz,
  visitor_last_read_at timestamptz,
  provider_last_read_at timestamptz,
  visitor_typing_at timestamptz,
  provider_typing_at timestamptz,
  created_at timestamptz not null default now(),
  unique (visitor_id, provider_id, advertentie_id)
);

create index if not exists conversations_visitor_idx
  on public.conversations (visitor_id, last_message_at desc nulls last);
create index if not exists conversations_provider_idx
  on public.conversations (provider_id, last_message_at desc nulls last);

alter table public.conversations enable row level security;

create policy "Participants read own conversations"
  on public.conversations
  for select
  to authenticated
  using (auth.uid() = visitor_id or auth.uid() = provider_id);

create policy "Visitors create conversations"
  on public.conversations
  for insert
  to authenticated
  with check (auth.uid() = visitor_id);

create policy "Participants update own conversations"
  on public.conversations
  for update
  to authenticated
  using (auth.uid() = visitor_id or auth.uid() = provider_id);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists conversation_messages_conv_idx
  on public.conversation_messages (conversation_id, created_at asc);

alter table public.conversation_messages enable row level security;

create policy "Participants read messages"
  on public.conversation_messages
  for select
  to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.visitor_id = auth.uid() or c.provider_id = auth.uid())
    )
  );

create policy "Participants send messages"
  on public.conversation_messages
  for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.visitor_id = auth.uid() or c.provider_id = auth.uid())
    )
  );
