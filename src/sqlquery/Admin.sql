create table public.admins (

    id uuid primary key default gen_random_uuid(),

    user_id uuid not null unique
        references auth.users(id)
        on delete cascade,

    email text not null unique,

    full_name text not null,

    active boolean default true,

    last_login timestamptz,

    created_at timestamptz default now()

);

alter table public.admins
enable row level security;
create policy "Admins can view their own profile"

on public.admins

for select

using (
    auth.uid() = user_id
);

create policy "Admins can update their own login time"

on public.admins

for update

using (
    auth.uid() = user_id
)

with check (
    auth.uid() = user_id
);

insert into public.admins
(
    user_id,
    email,
    full_name
)

values
(
    'd834ed11-87f1-4248-a17f-d5466301c596',
    'admin@sustainspace.com',
    'Main Administrator'
);

select * from public.admins


drop policy if exists 
"Admins can view their own profile"
on public.admins;


create policy
"Authenticated users can check admin status"

on public.admins

for select

to authenticated

using (
    auth.uid() = user_id
);

-- ==========================================
-- ADMIN TABLE PERMISSIONS + RLS SETUP
-- ==========================================


-- Grant permissions to authenticated users

grant select
on table public.admins
to authenticated;


grant update
on table public.admins
to authenticated;



-- Allow Supabase service role full access

grant all
on table public.admins
to service_role;



-- ==========================================
-- REMOVE OLD POLICIES
-- ==========================================


drop policy if exists
"Admins can view their own profile"
on public.admins;


drop policy if exists
"Admins can update their own login time"
on public.admins;


drop policy if exists
"Users can verify admin account"
on public.admins;


drop policy if exists
"Admins update own login"
on public.admins;



-- ==========================================
-- ENABLE RLS
-- ==========================================


alter table public.admins
enable row level security;



-- ==========================================
-- ALLOW ADMIN CHECK AFTER LOGIN
-- ==========================================


create policy
"Users can verify admin account"

on public.admins

for select

to authenticated

using (

    auth.uid() = user_id

);



-- ==========================================
-- ALLOW LAST LOGIN UPDATE
-- ==========================================


create policy
"Admins update own login"

on public.admins

for update

to authenticated

using (

    auth.uid() = user_id

)

with check (

    auth.uid() = user_id

);



-- ==========================================
-- VERIFY TABLE DATA
-- ==========================================


select

    id,
    user_id,
    email,
    full_name,
    active,
    last_login,
    created_at

from public.admins;

drop policy if exists "admin_view_all_listings" on public.listings;

create policy "admin_view_all_listings"
on public.listings
for select
to authenticated
using (
    exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
          and p.role = 'admin'
    )
);

-- ==========================================
--- CREATE A VIEW FOR THE LISTINGS TABLE
-- ==========================================

create or replace view public.admin_listings as
select
    l.id,
    l.title,
    l.description,
    l.price,
    l.category,
    l.item_condition,
    l.location,
    l.status,
    l.featured_image,
    l.gallery_images,
    l.created_at,

    p.id as seller_id,
    p.full_name,
    p.email

from public.listings l
join public.profiles p
on p.id = l.seller_id;

grant select on public.admin_listings to authenticated;

-- ==========================================
-- ADMIN TRANSACTIONS VIEW
-- ==========================================

drop view if exists public.admin_transactions;

create view public.admin_transactions as

select

    -- Transaction
    t.id as transaction_id,
    t.status as transaction_status,
    t.delivery_method,
    t.payment_method,
    t.pickup_date,
    t.pickup_location,
    t.verification_code,
    t.created_at as transaction_created_at,

    -- Order
    o.id as order_id,
    o.status as order_status,
    o.title,
    o.image_url,
    o.agreed_price,
    o.created_at as order_created_at,

    -- Purchase Request
    pr.id as request_id,
    pr.status as request_status,
    pr.created_at as request_created_at,

    -- Buyer
    buyer.id as buyer_id,
    buyer.full_name as buyer_name,
    buyer.email as buyer_email,

    -- Seller
    seller.id as seller_id,
    seller.full_name as seller_name,
    seller.email as seller_email

from public.transactions t

join public.orders o
on o.id = t.order_id

join public.purchase_requests pr
on pr.id = o.purchase_request_id

join public.profiles buyer
on buyer.id = t.buyer_id

join public.profiles seller
on seller.id = t.seller_id

order by t.created_at desc;

grant select
on public.admin_transactions
to authenticated;

drop policy if exists admin_view_all_transactions
on public.transactions;

create policy admin_view_all_transactions

on public.transactions

for select

to authenticated

using (

    exists (

        select 1
        from public.admins a
        where a.user_id = auth.uid()
        and a.active = true

    )

);

drop policy if exists admin_view_all_orders
on public.orders;

create policy admin_view_all_orders

on public.orders

for select

to authenticated

using (

    exists (

        select 1
        from public.admins a
        where a.user_id = auth.uid()
        and a.active = true

    )

);

drop policy if exists admin_view_all_requests
on public.purchase_requests;

create policy admin_view_all_requests

on public.purchase_requests

for select

to authenticated

using (

    exists (

        select 1
        from public.admins a
        where a.user_id = auth.uid()
        and a.active = true

    )

);

drop view if exists public.admin_transactions;


create view public.admin_transactions as

select


    -- Transaction

    t.id as transaction_id,
    t.status as transaction_status,
    t.delivery_method,
    t.payment_method,
    t.pickup_date,
    t.pickup_location,
    t.verification_code,
    t.created_at as transaction_created_at,


    -- Order

    o.id as order_id,
    o.status as order_status,
    o.agreed_price,
    o.created_at as order_created_at,


    -- Listing

    l.id as listing_id,
    l.title,
    l.description,
    l.featured_image,
    l.gallery_images,


    -- Purchase Request

    pr.id as request_id,
    pr.status as request_status,
    pr.created_at as request_created_at,


    -- Buyer

    buyer.id as buyer_id,
    buyer.full_name as buyer_name,
    buyer.email as buyer_email,


    -- Seller

    seller.id as seller_id,
    seller.full_name as seller_name,
    seller.email as seller_email


from public.transactions t


join public.orders o
on o.id = t.order_id


join public.listings l
on l.id = o.listing_id


join public.purchase_requests pr
on pr.id = o.purchase_request_id


join public.profiles buyer
on buyer.id = t.buyer_id


join public.profiles seller
on seller.id = t.seller_id


order by t.created_at desc;

grant select
on public.admin_transactions
to authenticated;