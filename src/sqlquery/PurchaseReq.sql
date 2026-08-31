-- Create purchase requests table
create table public.purchase_requests (
    id uuid primary key default gen_random_uuid(),

    listing_id uuid not null
        references public.listings(id)
        on delete cascade,

    buyer_id uuid not null
        references public.profiles(id)
        on delete cascade,

    seller_id uuid not null
        references public.profiles(id)
        on delete cascade,

    status text not null default 'pending'
        check (
            status in (
                'pending',
                'accepted',
                'rejected',
                'cancelled',
                'completed'
            )
        ),

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    -- One request per buyer per listing until the seller accepts/rejects it
    unique (listing_id, buyer_id)
);


alter table public.purchase_requests enable row level security;
create policy "purchase_requests_select"
on public.purchase_requests
for select
to authenticated
using (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
);

create policy "purchase_requests_insert"
on public.purchase_requests
for insert
to authenticated
with check (
    buyer_id = auth.uid()
);

create policy "purchase_requests_update"
on public.purchase_requests
for update
to authenticated
using (
    seller_id = auth.uid()
)
with check (
    seller_id = auth.uid()
);

create policy "purchase_requests_delete"
on public.purchase_requests
for delete
to authenticated
using (
    buyer_id = auth.uid()
);

grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.purchase_requests
to authenticated;

ALTER TABLE public.purchase_requests
ADD COLUMN agreed_price numeric;

ALTER TABLE purchase_requests
DROP CONSTRAINT purchase_requests_status_check;

ALTER TABLE purchase_requests
ADD CONSTRAINT purchase_requests_status_check
CHECK (
    status IN (
        'pending',
        'accepted',
        'cancelled',
        'completed'
    )
);

ALTER TABLE public.purchase_requests
DROP CONSTRAINT purchase_requests_listing_id_buyer_id_key;

