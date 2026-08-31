-- =========================
-- 1. SAFE GRANTS
-- =========================
grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.conversations to authenticated;

grant select, insert, update, delete
on public.messages to authenticated;

grant select
on public.listings to authenticated;

grant select
on public.profiles to authenticated;

-- Allow anonymous users to use the schema
GRANT USAGE ON SCHEMA public TO anon;

-- Allow anonymous users to read listings
GRANT SELECT ON public.listings TO anon;
-- =========================
-- 2. RLS FOR LISTINGS
-- =========================
alter table public.listings enable row level security;

create policy "listings_are_public"
on public.listings
for select
to authenticated
using (true);


-- =========================
-- 3. RLS FOR PROFILES
-- =========================
alter table public.profiles enable row level security;

drop policy if exists "listings_are_public" on public.listings;

create policy "listings_are_public"
on public.listings
for select
to public
using (true);

drop policy if exists "create_conversation" on public.conversations;

create policy "create_conversation"
on public.conversations
for insert
to authenticated
with check (
  auth.uid() = buyer_id
  or auth.uid() = seller_id
);