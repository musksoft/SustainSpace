-- Listings table
create table public.listings (
    id uuid primary key default gen_random_uuid(),

    seller_id uuid not null
        references public.profiles(id)
        on delete cascade,

    title text not null,
    description text not null,

    price numeric(10,2) not null,

    category text not null,

    item_condition text not null,

    location text not null,

    width numeric not null,
    height numeric not null,
    depth numeric not null,

    featured_image text not null,

    gallery_images text[] not null default '{}',

    status text not null default 'available'
        check (
            status in (
                'available',
                'reserved',
                'sold'
            )
        ),

    created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.listings enable row level security;

-- Anyone authenticated can view listings
create policy "listing_select"
on public.listings
for select
to authenticated
using (true);

-- Insert only for logged-in users and seller_id must match auth user
create policy "listing_insert"
on public.listings
for insert
to authenticated
with check (
    seller_id = auth.uid()
);

-- Update own listings only
create policy "listing_update"
on public.listings
for update
to authenticated
using (
    seller_id = auth.uid()
)
with check (
    seller_id = auth.uid()
);

-- Delete own listings only
create policy "listing_delete"
on public.listings
for delete
to authenticated
using (
    seller_id = auth.uid()
);

grant usage on schema public to authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.listings
TO authenticated;


create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'buyer'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create policy "Allow sellers to insert listings"
on public.listings
for insert
to authenticated
with check (auth.uid() = seller_id)


select * from listings


GRANT INSERT ON TABLE public.listings TO authenticated;
CREATE POLICY "Allow sellers to insert listings"
ON public.listings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only sellers can insert listings"
ON public.listings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = seller_id
);

GRANT SELECT ON public.listings TO authenticated;

GRANT UPDATE ON public.listings TO authenticated;

drop policy if exists "Only sellers can update their own listings"
on public.listings;

create policy "Only sellers can update their own listings"
on public.listings
for update
to authenticated
using (
  auth.uid() = seller_id
)
with check (
  auth.uid() = seller_id
);
